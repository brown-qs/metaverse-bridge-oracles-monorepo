import {Inject, Injectable, UnprocessableEntityException} from '@nestjs/common';
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
import { Snapshot, Snapshots } from './dtos/snapshot.dto';
import { PermittedMaterial, PermittedMaterials } from './dtos/permitted-material.dto';
import { GameSessionService } from 'src/gamesession/gamesession.service';

@Injectable()
export class GameService {

    private readonly context: string;
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
    }

    public async getTextures(user: UserEntity): Promise<PlayerTextureMapDto> {
        const textures = user.textures ?? []
        
        const textureMap: PlayerTextureMapDto = {}
        
        textures.map(texture => {
            textureMap[texture.type] = {
                textureData: texture.textureData,
                textureSignature: texture.textureSignature,
                type: texture.type
            }
        })

        // at least we need to get the default skin
        if (!textureMap[TextureType.SKIN]) {
            textureMap[TextureType.SKIN] = DEFAULT_SKIN
        }

        return textureMap
    }

    public async processSnapshots(user: UserEntity, snapshots: Snapshots): Promise<[SnapshotItemEntity[], boolean[], number, number]> {

        if (!snapshots || !snapshots.snapshots || snapshots.snapshots.length == 0) {
            return [[], [], 0, 0]
        }

        const snapshotSuccessArray = Array.from({length: snapshots.snapshots.length}, () => false)

        const received = snapshots.snapshots.length
        let saved = 0
        
        const promises: Promise<SnapshotItemEntity | undefined>[] = snapshots.snapshots.map(async (snapshot: Snapshot, i) => {
            const material = await this.materialService.findByName(snapshot.materialName)

            if (!material || !material.snapshottable) {
                this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} is not permitted for snapshot`, null, this.context)
                return undefined
            }

            if (snapshot.amount > material.maxStackSize) {
                this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} had invalid amount. Received: ${snapshot.amount}. Allowed: [0, ${material.maxStackSize}]`, null, this.context)
                return undefined
            }

            const entity = new SnapshotItemEntity({
                amount: snapshot.amount,
                owner: user,
                material,
                position: snapshot.position ?? null
            })

            const snap = await this.snapshotService.create(entity)
            if (snap) {
                saved += 1
                snapshotSuccessArray[i] = true
            }
        })

        const snapshotItems = (await Promise.all(promises)).filter(x => !!x)

        return [snapshotItems, snapshotSuccessArray, received, saved]
    }

    public async getSnapshottableMaterialsList(): Promise<PermittedMaterials> {
        const materials = await this.materialService.findMany({where: {snapshottable: true}})

        this.logger.debug(materials, this.context)

        if (!materials || materials.length == 0) {
            this.logger.warn(`No snapshottable materials were fetched. Oopsie.`, this.context)
            return {materials: []}
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

        return {materials: []}
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
}
