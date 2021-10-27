import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { TextureType } from '../texture/texturetype.enum';
import { DEFAULT_SKIN } from '../config/constants';
import { PlayerTextureMapDto } from './dtos/texturemap.dto';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { SnapshotDto, SnapshotsDto } from './dtos/snapshot.dto';
import { PermittedMaterial, PermittedMaterials } from './dtos/permitted-material.dto';
import { GameSessionService } from 'src/gamesession/gamesession.service';

import { Mutex, MutexInterface } from 'async-mutex';

@Injectable()
export class GameService {

    private readonly context: string;

    private locks : Map<string, MutexInterface>;

    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly materialService: MaterialService,
        private readonly snapshotService: SnapshotService,
        private readonly gameSessionService: GameSessionService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = GameService.name
        this.locks = new Map();
    }

    public async getTextures(user: UserEntity): Promise<PlayerTextureMapDto> {
        const richUser = await this.userService.findOne(user, {relations: ['textures']})
        const textures = await richUser.textures

        const textureMap: PlayerTextureMapDto = {}

        textures.map(texture => {
            textureMap[texture.type] = {
                textureData: texture.textureData,
                textureSignature: texture.textureSignature,
                type: texture.type,
                accessories: texture.accessories ?? undefined,
                assetId: texture.assetId
            }
        })

        // at least we need to get the default skin
        if (!textureMap[TextureType.SKIN]) {
            textureMap[TextureType.SKIN] = DEFAULT_SKIN
        }

        return textureMap
    }

    private ensureLock(key: string) {
        if (!this.locks.has(key)) {
          this.locks.set(key, new Mutex());
        }
    }

    public async processSnapshots(user: UserEntity, snapshots: SnapshotsDto): Promise<[SnapshotItemEntity[], boolean[], number, number]> {

        if (!user || !snapshots || !snapshots.snapshots || snapshots.snapshots.length == 0) {
            return [[], [], 0, 0]
        }

        // get user with gganbu and snapshots
        // if user is alone, add all the items to user
        // if user is gganbu, write half to user, half to gganbu


        const userAll = await this.userService.findOne({ uuid: user.uuid }, { relations: ['gganbu'] })

        //console.log(userAll)

        if (!userAll) {
            return [[], [], 0, 0]
        }

        const snapshotSuccessArray = Array.from({ length: snapshots.snapshots.length }, () => false)

        const received = snapshots.snapshots.length
        let saved = 0

        //let promises: Promise<SnapshotItemEntity | undefined>[]

        this.ensureLock(userAll.uuid)
        
        const userlock = this.locks.get(userAll.uuid)

        const promises = await userlock.runExclusive(async () => {
            if (!userAll.gganbu) {
                const promises = await snapshots.snapshots.map(async (snapshot: SnapshotDto, i) => {
                    const savedS = await this.assignSnapshot(userAll, snapshot)

                    if (!!savedS) {
                        saved += 1
                        snapshotSuccessArray[i] = true
                    }

                    return savedS
                })
                return promises
            } else {
                const promises = await snapshots.snapshots.map(async (snapshot: SnapshotDto, i) => {
                    const gganbu = await this.userService.findOne({ uuid: userAll.gganbu.uuid }, { relations: ['snapshotItems'] })

                    const savedU = await this.assignSnapshot(userAll, snapshot, true, true)
                    const savedG = await this.assignSnapshot(gganbu, snapshot, true, false)

                    if (!!savedU && !!savedG) {
                        saved += 1
                        snapshotSuccessArray[i] = true
                    }
                    return savedU
                })
                return promises
            }
        })
            
        const snapshotItems = await Promise.all(promises)
        //console.log([snapshotItems, snapshotSuccessArray, received, saved])
        return [snapshotItems, snapshotSuccessArray, received, saved]
    }

    public async getSnapshottableMaterialsList(): Promise<PermittedMaterials> {
        const materials = await this.materialService.findMany({ where: { snapshottable: true } })

        this.logger.debug(materials, this.context)

        if (!materials || materials.length == 0) {
            this.logger.warn(`No snapshottable materials were fetched. Oopsie.`, this.context)
            return { materials: [] }
        }

        const permittedMaterials: PermittedMaterial[] = materials.map(material => {
            return {
                name: material.name,
                key: material.key,
                ordinal: material.ordinal
            }
        })

        if (permittedMaterials && permittedMaterials.length > 0) {
            return {
                materials: permittedMaterials
            }
        }

        return { materials: [] }
    }

    public async getGameInProgress(): Promise<boolean> {
        return !!(await this.gameSessionService.getOngoing())
    }

    public async setGameInProgress(inprogress: boolean): Promise<boolean> {
        const ongoingGame = await this.gameSessionService.getOngoing()
        if (inprogress == true) {
            if (ongoingGame && ongoingGame.ongoing) {
                throw new UnprocessableEntityException("Game already in progress")
            }
            await this.gameSessionService.create({
                ongoing: true,
                startedAt: Date.now().toString(10)
            })
            return true;
        }

        if (ongoingGame) {
            await this.gameSessionService.create({
                ...ongoingGame,
                ongoing: false,
                endedAt: Date.now().toString(10)
            })
            return true;
        }

        throw new UnprocessableEntityException("Game is not in progress")
    }

    public async setGganbu(player1UUID: string, player2UUID: string): Promise<boolean> {
        let players: UserEntity[]
        let player1: UserEntity, player2: UserEntity
        try {
            //console.log(1)
            players = await this.userService.findMany({
                where: [{ uuid: player1UUID }, { uuid: player2UUID }],
                relations: ['gganbu']
            })
            //console.log(2)
            if (!players || players.length !== 2) {
                //console.log(players)
                throw new Error()
            }
            player1 = players.find(x => x.uuid === player1UUID)
            player2 = players.find(x => x.uuid === player2UUID)

            if (!player1 || !player2) {
                //console.log(player1, player2)
                throw new Error()
            }
        } catch (err) {
            this.logger.error(`setGganbu::player data could not be fetched for player1:${player1UUID} or player2:${player2UUID}`, err, this.context)
            throw new UnprocessableEntityException('Players were not found')
        }

        if (!!player1.gganbu || !!player2.gganbu) {
            this.logger.error(`setGganbu:: on of the players already has a gganbu. player1HasGanbu:${!!player1.gganbu}, player2HasGanbu:${!!player2.gganbu}`, null, this.context)
            throw new UnprocessableEntityException('One of the players already have a gganbu')
        }

        player1.gganbu = player2
        player2.gganbu = player1
        await this.userService.createMany([player1, player2])
        return true;
    }

    public async getGganbu(player1UUID: string, player2UUID: string): Promise<boolean> {
        let players: UserEntity[]
        let player1: UserEntity, player2: UserEntity
        try {
            players = await this.userService.findMany({
                where: [
                    { uuid: player1UUID },
                    { uuid: player2UUID }
                ],
                relations: ['gganbu']
            })
            if (!players || players.length !== 2) {
                //console.log(players)
                throw new Error()
            }
            player1 = players.find(x => x.uuid === player1UUID)
            player2 = players.find(x => x.uuid === player2UUID)

            if (!player1 || !player2) {
                //console.log(player1, player2)
                throw new Error()
            }

        } catch (err) {
            this.logger.error(`setGganbu::player data could not be fetched for player1:${player1UUID} or player2:${player2UUID}`, err, this.context)
            throw new UnprocessableEntityException('Players were not found')
        }

        return (!!player1.gganbu && player1.gganbu.uuid === player2UUID) && (!!player2.gganbu && player2.gganbu.uuid === player1UUID)
    }

    public async clearGganbus(): Promise<boolean> {
        let players: UserEntity[]

        const take = 2;
        let skip = 0;
        let stop = false
        while (!stop) {
            try {
                players = await this.userService.findMany({
                    take,
                    skip,
                    relations: ['gganbu']
                })
                if (!players || (!!players && players.length == 0)) {
                    this.logger.debug(`clearGganbu:: stopped at skip:${skip} take:${take}`, this.context)
                    break;
                }

            } catch (err) {
                this.logger.error(`clearGganbu:: error fetching players at skip:${skip} take:${take}`, err, this.context)
                throw new UnprocessableEntityException('Players were not found')
            }

            const pnew = players.map(x => {
                return {
                    ...x,
                    gganbu: null
                }
            })

            try {
                await this.userService.createMany(pnew)
                this.logger.debug(`clearGganbu:: success. skip:${skip} take:${take}`, this.context)

            } catch (err) {
                this.logger.error(`clearGganbu:: error updating players at skip:${skip} take:${take}`, err, this.context)
                throw new UnprocessableEntityException('Error updating players')
            }

            skip += take

        }

        return true
    }


    private async assignSnapshot(user: UserEntity, snapshot: SnapshotDto, half = false, roundup = true): Promise<SnapshotItemEntity> {
        if (!snapshot.materialName) {
            this.logger.error(`processSnapshots-${user.uuid}:: materialName was not received. Got: ${snapshot.materialName}.`, null, this.context)
            return undefined
        }

        const material = await this.materialService.findByName(snapshot.materialName)

        if (!material || !material.snapshottable) {
            this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} is not permitted for snapshot`, null, this.context)
            return undefined
        }

        if (snapshot.amount > material.maxStackSize || snapshot.amount < 0) {
            this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} had invalid amount. Received: ${snapshot.amount}. Allowed: [0, ${material.maxStackSize}]`, null, this.context)
            return undefined
        }

        const amount = half ? snapshot.amount / 2: snapshot.amount

        const itemId = `${user.uuid}-${material.name}`
        this.ensureLock(itemId)

        const itemlock = this.locks.get(itemId)

        const savedS = await itemlock.runExclusive(async () => {
            const foundItem = await this.snapshotService.findOne({id: itemId})

            if (!!foundItem) {
                //console.log('founditem')
                //console.log(foundItem)
                foundItem.amount = (Number.parseFloat(foundItem.amount) + amount).toString();
                const r = await this.snapshotService.create(foundItem)
                return r
            } else {
                //console.log('newitem')
                const entity = new SnapshotItemEntity({
                    id: `${user.uuid}-${material.name}`,
                    amount: amount.toString(),
                    owner: user,
                    material
                })
                const r = await this.snapshotService.create(entity)
                return r
            }
        })

        return savedS
    }
}
