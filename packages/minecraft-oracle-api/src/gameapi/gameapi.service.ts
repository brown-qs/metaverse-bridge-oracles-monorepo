import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { TextureType } from '../texture/texturetype.enum';
import { RecognizedAsset, RecognizedAssetType } from '../config/constants';
import { PlayerSkinDto } from './dtos/texturemap.dto';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { SnapshotDto, SnapshotsDto } from './dtos/snapshot.dto';
import { PermittedMaterial, PermittedMaterials } from './dtos/permitted-material.dto';
import { GameService } from '../game/game.service';

import { Mutex, MutexInterface } from 'async-mutex';
import { PlaySesionService } from '../playsession/playsession.service';
import { PlaySessionStatService } from '../playsession/playsessionstat.service';
import { InventoryEntity } from '../playerinventory/inventory.entity';
import { InventoryService } from '../playerinventory/inventory.service';
import { TextureEntity } from '../texture/texture.entity';
import { SkinService } from '../skin/skin.service';
import { AssetService } from '../asset/asset.service';
import { AssetEntity } from '../asset/asset.entity';
import { ProviderToken } from '../provider/token';
import { CommunismDto } from '../adminapi/dtos/communism.dto';
import { GameKind } from '../game/game.enum';
import { SetGameOngoingDto } from './dtos/setgameongoing.dto';
import { GameKindInProgressDto } from './dtos/gamekndinprogress.dto';
import { SetGameDto } from '../game/dto/game.dto';
import { GameTypeService } from '../gametype/gametype.service';
import { GameEntity } from '../game/game.entity';
import { SetPlayerScoreDto } from '../playerscore/dtos/setplayerscore.dto';
import { PlayerScoreService } from '../playerscore/playerscore.service';
import { SetAchievementsDto } from '../achievement/dtos/achievement.dto';
import { AchievementService } from '../achievement/achievement.service';
import { GetPlayerAchievementDto, SetPlayerAchievementsDto } from '../playerachievement/dtos/playerachievement.dto';
import { PlayerAchievementService } from '../playerachievement/playerachievement.service';
import { GetPlayerScoreDto } from '../playerscore/dtos/getplayerscore.dto';
import { GganbuEntity } from '../gganbu/gganbu.entity';
import { SnaplogEntity } from '../snaplog/snaplog.entity';
import { SnaplogService } from '../snaplog/snaplog.service';
import { GganbuService } from '../gganbu/gganbu.service';
import { BankDto } from './dtos/bank.dto';

@Injectable()
export class GameApiService {

    private readonly context: string;

    private locks: Map<string, MutexInterface>;

    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly skinService: SkinService,
        private readonly materialService: MaterialService,
        private readonly snapshotService: SnapshotService,
        private readonly snaplogService: SnaplogService,
        private readonly gganbuService: GganbuService,
        private readonly inventoryService: InventoryService,
        private readonly gameTypeService: GameTypeService,
        private readonly gameService: GameService,
        private readonly achievementService: AchievementService,
        private readonly playerAchievementService: PlayerAchievementService,
        private readonly playSessionService: PlaySesionService,
        private readonly playerScoreService: PlayerScoreService,
        private readonly playSessionStatService: PlaySessionStatService,
        private readonly assetService: AssetService,
        @Inject(ProviderToken.IMPORTABLE_ASSETS) private importableAssets: RecognizedAsset[],
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = GameService.name
        this.locks = new Map();
    }

    public async getUserSkins(user: UserEntity): Promise<PlayerSkinDto[]> {
        const skins = await this.skinService.findMany({where: {owner: {uuid: user.uuid}}, relations: ['texture']})

        const results: PlayerSkinDto[] = skins.map(skin => {
                return {
                    textureData: skin.texture.textureData,
                    textureSignature: skin.texture.textureSignature,
                    type: skin.texture.type,
                    accessories: skin.texture.accessories ?? undefined,
                    assetId: skin.texture.assetId,
                    assetAddress: skin.texture.assetAddress,
                    assetType: skin.texture.assetType,
                    equipped: skin.texture.type.valueOf() === TextureType.SKIN.valueOf() && skin.equipped
                }
            }
        )

        return results
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

        const game = !!snapshots.gameId ? (await this.gameService.findOne({id: snapshots.gameId}) ?? null) : null

        this.ensureLock(userAll.uuid)

        const userlock = this.locks.get(userAll.uuid)

        const promises = await userlock.runExclusive(async () => {
            if (!userAll.gganbu) {
                const promises = await snapshots.snapshots.map(async (snapshot: SnapshotDto, i) => {
                    const savedS = await this.assignSnapshot(userAll, game, snapshot)

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

                    const savedU = await this.assignSnapshot(userAll, game, snapshot, true, true)
                    const savedG = await this.assignSnapshot(gganbu, game, snapshot, true, false)

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

    public async getGameKindInProgress(dto?: GameKindInProgressDto): Promise<boolean> {
        return !!(await this.gameService.findOne({ongoing: true, type: dto?.kind ?? GameKind.CARNAGE}))
    }

    public async getTextures(skinrequest: { auctionOnly: boolean }): Promise<TextureEntity[]> {
        const textures = skinrequest.auctionOnly ? await this.textureService.findMany({ where: { auction: true } }) : await this.textureService.findMany({})
        return textures
    }

    public async setGameOngoing(dto: SetGameOngoingDto): Promise<boolean> {
        const game = await this.gameService.findOne({id: dto.gameId})

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        if (dto.ongoing && game.type === GameKind.CARNAGE) {
            throw new UnprocessableEntityException("Prevent setting of the “ongoing” flag on game_entity entries where “type” is “CARNAGE”")
        }

        if (game.ongoing && !dto.ongoing) {
            await this.gameService.update(game.id, {ongoing: dto.ongoing, endedAt: Date.now().toString()})
        } else {
            await this.gameService.update(game.id, {ongoing: dto.ongoing})
        }
        return true
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


    private async assignSnapshot(user: UserEntity, game: GameEntity | null, snapshot: SnapshotDto, half = false, validate = true): Promise<SnapshotItemEntity> {
        if (!snapshot.materialName) {
            this.logger.error(`processSnapshots-${user.uuid}:: materialName was not received. Got: ${snapshot.materialName}.`, null, this.context)
            return undefined
        }

        const material = await this.materialService.findByName(snapshot.materialName)

        if (!material || !material.snapshottable) {
            this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} is not permitted for snapshot`, null, this.context)
            return undefined
        }

        if (validate && (snapshot.amount > material.maxStackSize || snapshot.amount < 0)) {
            this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} had invalid amount. Received: ${snapshot.amount}. Allowed: [0, ${material.maxStackSize}]`, null, this.context)
            return undefined
        }

        const amount = half ? snapshot.amount / 2 : snapshot.amount

        const itemId = SnapshotService.calculateId({uuid: user.uuid, materialName: material.name, gameId: game?.id})
        this.ensureLock(itemId)

        const itemlock = this.locks.get(itemId)

        const savedS = await itemlock.runExclusive(async () => {
            const foundItem = await this.snapshotService.findOneNested({ where: { id: itemId }, relations: ['game']})

            if (!!foundItem) {
                //console.log('founditem')
                //console.log(foundItem)
                foundItem.amount = (Number.parseFloat(foundItem.amount) + amount).toString();
                const r = await this.snapshotService.create(foundItem)
                return r
            } else {
                //console.log('newitem')
                const entity = new SnapshotItemEntity({
                    id: itemId,
                    amount: amount.toString(),
                    owner: user,
                    material,
                    game
                })
                const r = await this.snapshotService.create(entity)
                return r
            }
        })

        return savedS
    }

    public async setPlayerGameSession(uuid: string, gameId: string, ended: boolean): Promise<boolean> {

        const sess = await this.playSessionService.getOngoing({ uuid })

        if (ended) {
            if (!sess) {
                this.logger.warn(`setPlayerGameSession:: end session: no ongoing player sessions to end for user ${uuid}`, this.context)
                return false
            }
            const now = Date.now()
            sess.endedAt = now.toString()
            const success = await this.playSessionService.update(sess.id, { endedAt: sess.endedAt })
            const delta = now - Number.parseFloat(sess.startedAt)
            await this.playSessionStatService.update(sess.stat.id, { timePlayed: (Number.parseFloat(sess.stat.timePlayed) + delta).toString() })
            //await this.userService.update(user.uuid, {timePlayedEvent: (Number.parseInt(user.timePlayedEvent ?? '0') + now).toString() })
            return success
        }

        if (!!sess) {
            const now = Date.now()
            sess.endedAt = now.toString()
            const success = await this.playSessionService.update(sess.id, { endedAt: sess.endedAt })
            const delta = now - Number.parseFloat(sess.startedAt)
            await this.playSessionStatService.update(sess.stat.id, { timePlayed: (Number.parseFloat(sess.stat.timePlayed) + delta).toString() })
            if (success) {
                this.logger.warn(`setPlayerGameSession:: start session: found previous ongoing play session, ended successfully for user ${uuid}`, this.context)
                //await this.userService.update(user.uuid, {timePlayedEvent: (Number.parseInt(user.timePlayedEvent ?? '0') + now).toString() })
            } else {
                this.logger.warn(`setPlayerGameSession:: start session: found previous ongoing play session, could not end successfully ${uuid}`, this.context)
            }
        }

        if (!(await this.userService.exists({ uuid }))) {
            this.logger.error(`setPlayerGameSession:: user ${uuid} does not exists`, null, this.context)
            return false
        }

        const stat = await this.playSessionStatService.create({
            id: PlaySessionStatService.calculateId({ uuid, gameId })
        })

        const game = await this.gameService.findOne({id: gameId})

        if (!game) {
            this.logger.error(`setPlayerGameSession:: game ${gameId} does not exists`, null, this.context)
            return false
        }

        await this.playSessionService.create({
            startedAt: Date.now().toString(),
            player: await this.userService.findOne({ uuid }),
            stat,
            game
        })

        return true
    }

    public async communism(settings: CommunismDto) {

        const mintT = settings.minTimePlayed ?? 2700000
        const averageM = settings.averageMultiplier ?? 0.5
        const finalDeduction = settings.deductionMultiplier ?? 0.5
        const msamasOnly = settings.moonsamasOnly ?? true
        const punishAll = settings.deductFromEveryone ?? true
        const gameId = settings.serverId

        const game = !!gameId ? (await this.gameService.findOne({id: gameId}) ?? null) : null

        let items: SnapshotItemEntity[] = []
        let batch: SnapshotItemEntity[] = []
        let skip = 0
        let take = 100

        const gameFindCondition = game?.id ? {id: game.id} : null

        do {
            batch = await this.snapshotService.findMany({ where: {game: gameFindCondition},take, skip, relations: ['material', 'owner', 'game'] })
            //console.log(batch)

            if (!!batch && batch.length > 0) {
                items = items.concat(batch)
            }

            skip += take

        } while (!!batch && batch.length > 0)

        let counter: { [key: string]: number } = {}
        let users: { [key: string]: {exists: boolean, eligible: boolean  } } = {}
        let allDistinct = 0
        let gganbuDistinct = 0

        // we sum ap all the materials for all users
        items.map(x => {
            counter[x.material.name] = typeof counter[x.material.name] === 'undefined' ? Number.parseFloat(x.amount) : counter[x.material.name] + Number.parseFloat(x.amount)
        })

        // we fetch all users
        const allUsers = await this.userService.findMany({})
        this.logger.warn(`Communism:: ${allUsers.length} users found`, this.context)

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i]
            
            const playStats = await this.playSessionStatService.findOne({ id: PlaySessionStatService.calculateId({uuid: user.uuid, gameId})})

            this.logger.debug(`Communism:: ${user.uuid} played ${playStats?.timePlayed}`, this.context)

            const tPlayed = playStats?.timePlayed ? Number.parseFloat(playStats?.timePlayed) : 0

            let playedEnough = false
            if (tPlayed >= mintT) {
                playedEnough = true
            } else {
                this.logger.warn(`Communism:: ${user.uuid} not eligible for gganbu`, this.context)
            }

            if (!users[user.uuid]) {
                allDistinct += 1
                const hasMoonsama = !!(await this.assetService.findOne({recognizedAssetType: RecognizedAssetType.MOONSAMA, owner: {uuid: user.uuid}, pendingIn: false}))
                users[user.uuid] = {
                    exists: true,
                    eligible: false
                }
                
                if (
                    playedEnough &&
                    (
                        (msamasOnly && hasMoonsama)
                        || !msamasOnly
                    )
                ) {
                    users[user.uuid].eligible = true
                    gganbuDistinct += 1
                }
            }
        }

        // we only divide the average by the gganbu eligible user numbers
        const materials = Object.keys(counter)
        let gganbuEntities: GganbuEntity[] = []
        await Promise.all(materials.map(async (key) => {
            counter[key] = (averageM * counter[key]) / gganbuDistinct
            gganbuEntities.push({
                id: GganbuService.calculateId({materialName: key, gameId: game?.id}),
                amount: counter[key].toString(),
                game,
                material: await this.materialService.findOne({name: key})
            })
        }))

        this.logger.debug(`Communism:: final gganbu amounts: ${counter}`, this.context)

        this.gganbuService.createAll(gganbuEntities)

        const userUuids = Object.keys(users)

        // we iterate on all users
        for (let i = 0; i < userUuids.length; i++) {
            const uuid = userUuids[i]
            const user = await this.userService.findOne({ uuid })
            
            // get user's snapshot items
            const snaps = items.filter(snap => snap.owner.uuid === uuid)

            // we iterate in material names
            const x = materials.map(async (materialName) => {

                // check if user had a snasphot item with that material
                const existingSnap = snaps.find(x => x.material.name === materialName)
                if (!!existingSnap) {
                    // if yes, we reduce the original amount for gganbu and add the average if eligible
                    this.logger.debug(`Communism:: ${uuid} snap for ${materialName} existed. Adding..`, this.context)

                    const finalfinaldeduction = punishAll ? finalDeduction : (users[uuid]?.eligible ? finalDeduction : 1)
                    const amount = ((Number.parseFloat(existingSnap.amount) * finalfinaldeduction) + (users[uuid]?.eligible ? counter[existingSnap.material.name] : 0 )).toString()

                    this.logger.debug(`Communism:: ${uuid} snap for ${materialName} deduction multiplier: ${finalDeduction}, amount: ${amount}, eligible: ${users[uuid]?.eligible}`, this.context)
                    await this.snapshotService.update(existingSnap.id, { amount })
                } else {
                    this.logger.debug(`Communism:: ${uuid} snap for ${materialName} not found. Creating..`, this.context)
                    const amount = counter[materialName]
                    
                    if (users[uuid]?.eligible) {
                        await this.assignSnapshot(user, game, { amount, materialName }, false, false)
                    } else {
                        this.logger.debug(`Communism:: ${uuid} snap for ${materialName} not eligible`, this.context)
                    }
                }
            })
            await Promise.all(x)
        }
    }

    public async bank(dto: BankDto): Promise<boolean> {

        this.ensureLock('bank')
        const banklock = this.locks.get('bank')

        const res = await banklock.runExclusive(async () => {

            let items: SnapshotItemEntity[] = []
            let batch: SnapshotItemEntity[] = []
            let skip = 0
            let take = 100

            const gameFindCondition = dto?.gameId ? {id: dto.gameId} : null
            do {
                batch = await this.snapshotService.findMany({ where: {game: gameFindCondition}, take, skip, relations: ['material', 'owner', 'game'] })
                //console.log(batch)

                if (!!batch && batch.length > 0) {
                    items = items.concat(batch)
                }

                skip += take

            } while (!!batch && batch.length > 0)

            let counter: { [key: string]: number } = {}
            //let users: {[key: string]: boolean} = {}
            //let distinct = 0
            items.map(x => {
                counter[x.material.name] = typeof counter[x.material.name] === 'undefined' ? Number.parseFloat(x.amount) : counter[x.material.name] + Number.parseFloat(x.amount)
            })

            const allUsers = await this.userService.findMany({})
            this.logger.warn(`Bank:: ${allUsers.length} users found`, this.context)

            /*
            allUsers.map(user => {
                if (!users[user.uuid]) {
                    users[user.uuid] = true
                    distinct+=1
                }
            })
            */

            if (!items || items.length === 0) {
                this.logger.warn(`Bank: snapshotted items were not found`, this.context)
                return true
            }

            // get all user snapshots and aggregate them together
            const userTasks = allUsers.map(async (user) => {
                const userSnapshots = items.filter(item => item.owner.uuid === user.uuid)

                if (!userSnapshots || userSnapshots.length === 0) {
                    return true
                }

                const inventoryMap: { [key: string]: { inv: InventoryEntity, snaps: SnapshotItemEntity[] } } = {}

                this.ensureLock(`snaplock-${user.uuid}`)
                const slock = this.locks.get(`snaplock-${user.uuid}`)

                await Promise.all(userSnapshots.map(async (snapshot) => slock.runExclusive(async () => {
                    const amount = (snapshot.material.multiplier ?? 1) * Number.parseFloat(snapshot.amount)
                    const materialName = snapshot.material.mapsTo ?? snapshot.material.name
                    const id = `${user.uuid}-${materialName}`
                    if (!inventoryMap[id]) {
                        const material = snapshot.material.mapsTo ? (await this.materialService.findOne({name: materialName})) : snapshot.material
                        inventoryMap[id] = {
                            inv: {
                                amount: amount.toString(),
                                material,
                                owner: snapshot.owner,
                                summonable: true,
                                id
                            },
                            snaps: [snapshot]
                        }
                    } else {
                        inventoryMap[id].inv.amount = (Number.parseFloat(inventoryMap[id].inv.amount) + amount).toString()
                        inventoryMap[id].snaps.push(snapshot)
                    }
                })))

                const existingInvItems = await this.inventoryService.findMany({ where: { owner: user.uuid }, relations: ['owner', 'material'] })

                // update inventory item and delete snapshot item on success
                await Promise.all(Object.keys(inventoryMap).map(async (id: string) => {
                    const newItem = inventoryMap[id]
                    const existingItem = existingInvItems.find((x) => x.id === id)
                    try {
                        if (!existingItem) {
                            await this.inventoryService.create(newItem.inv)
                        } else {
                            await this.inventoryService.update(existingItem.id, { amount: (Number.parseFloat(existingItem.amount) + Number.parseFloat(newItem.inv.amount)).toString() })
                        }

                        try {
                            const logs: SnaplogEntity[] = newItem.snaps.map(snap => {
                                return {
                                    ...snap,
                                    processedAt: Date.now().toString()
                                }
                            })
                            await this.snaplogService.createAll(logs)
                            await this.snapshotService.removeAll(newItem.snaps)
                        } catch (e) {
                            this.logger.error(`Bank:: error deleting snapshot while banking ${newItem.inv}`, null, this.context)
                            this.logger.error(e, null, this.context)
                        }
                    } catch (e) {
                        this.logger.error(`Bank:: error updating user inventory ${newItem.inv}`, null, this.context)
                        this.logger.error(e, null, this.context)
                    }
                }))

                return true
            })
            await Promise.all(userTasks)
            return true
        })

        return res
    }

    async getWorldPlots(world: string): Promise<AssetEntity[]> {
        const assets = await this.assetService.findMany({where: {world, recognizedAssetType: RecognizedAssetType.PLOT}})
        return assets
    }

    async createGame(dto: SetGameDto): Promise<GameEntity> {
        const gameTypeEntity = await this.gameTypeService.findOne({id: dto. gameTypeId})

        if (!gameTypeEntity) {
            throw new UnprocessableEntityException('Game type was not found')
        }

        const game = await this.gameService.create({
            ...dto,
            startedAt: Date.now().toString(),
            gameType: gameTypeEntity
        })

        return game
    }

    async updatePlayerScore(dto: SetPlayerScoreDto) {
        const player = await this.userService.findOne({uuid: dto.uuid})

        if (!player) {
            throw new UnprocessableEntityException("User not found")
        }

        const game = await this.gameService.findOne({id: dto.gameId})

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entity = await this.playerScoreService.create({
            player,
            game,
            score: dto.score.toString(),
            updatedAt: dto.updatedAt,
            id: this.playerScoreService.calculateId(dto)
        })

        return entity
    }

    async updateAchievements(dto: SetAchievementsDto) {
        const game = await this.gameService.findOne({id: dto.gameId})

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entity = await this.achievementService.createMultiple(
            dto.achievements.map(ac => {
                return {
                    game,
                    ...ac
                }
            })
        )

        return entity
    }

    async getPlayerAchievements(dto: GetPlayerAchievementDto) {
        const game = await this.gameService.findOne({id: dto.gameId})

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entities = await this.playerAchievementService.findMany({where: {player: {uuid: dto.uuid}, game: {id: dto.gameId}}})

        return entities
    }

    async getPlayerScore(dto: GetPlayerScoreDto) {
        const game = await this.gameService.findOne({id: dto.gameId})

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entity = await this.playerScoreService.findOne({player: {uuid: dto.uuid}, game: {id: dto.gameId}})

        if (!entity) {
            throw new UnprocessableEntityException("Score not found")
        }

        return entity.score
    }

    async updatePlayerAchievements(dto: SetPlayerAchievementsDto) {
        const player = await this.userService.findOne({uuid: dto.uuid})

        if (!player) {
            throw new UnprocessableEntityException("User not found")
        }

        const game = await this.gameService.findOne({id: dto.gameId})

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }


        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entity = await this.playerAchievementService.createMultiple(
            await Promise.all(dto.playerAchievements.map(async pa => {

                const achievement = await this.achievementService.findOne({id: pa.achievementId})

                return {
                    ...pa,
                    player,
                    game,
                    achievement,
                    id: this.playerAchievementService.calculateId({
                        gameId: dto.gameId,
                        uuid: dto.uuid,
                        achievementId: pa.achievementId
                    })
                }
            }))
        )

        return entity
    }
}
