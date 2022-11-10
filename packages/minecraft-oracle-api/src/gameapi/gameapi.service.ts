import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepository, ILike } from 'typeorm';
import { UserService } from '../user/user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user/user.entity';
import { TextureType } from '../texture/texturetype.enum';
import { RecognizedAssetType } from '../config/constants';
import { PlayerSkinDto } from './dtos/texturemap.dto';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { BulkSnapshotRequestDto, SnapshotDto, SnapshotsDto } from './dtos/snapshot.dto';
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
import { CommunismDto } from '../adminapi/dtos/communism.dto';
import { GameKind } from '../game/game.enum';
import { SetGameOngoingDto } from './dtos/setgameongoing.dto';
import { GameKindInProgressDto } from './dtos/gamekndinprogress.dto';
import { SetGameDto } from '../game/dto/game.dto';
import { GameTypeService } from '../gametype/gametype.service';
import { GameEntity } from '../game/game.entity';
import { QueryPlayerScoreDto, QueryPlayerScoresDto, SetPlayerScoreDto } from '../playerscore/dtos/playerscore.dto';
import { PlayerScoreService } from '../playerscore/playerscore.service';
import { SetAchievementsDto } from '../achievement/dtos/achievement.dto';
import { AchievementService } from '../achievement/achievement.service';
import { SetPlayerAchievementsDto } from '../playerachievement/dtos/playerachievement.dto';
import { PlayerAchievementService } from '../playerachievement/playerachievement.service';
import { GganbuEntity } from '../gganbu/gganbu.entity';
import { SnaplogEntity } from '../snaplog/snaplog.entity';
import { SnaplogService } from '../snaplog/snaplog.service';
import { GganbuService } from '../gganbu/gganbu.service';
import { BankDto } from './dtos/bank.dto';
import { GameItemTypeService } from '../gameitemtype/gameitemtype.service';
import { PlayerGameItemService } from '../playergameitem/playergameitem.service';
import { PlayerGameItemEntity } from '../playergameitem/playergameitem.entity';
import { GameItemTypeDto, SetGameItemTypeDto } from '../gameitemtype/dtos/gameitemtype.dto';
import { SetPlayerGameItemDto, QueryGameItemsDto } from '../playergameitem/dtos/playergameitem.dto';
import { SortDirection } from '../common/enums/SortDirection';
import { SetGameScoreTypeDto } from '../gamescoretype/dtos/gamescoretype.dto';
import { PlayerScoreEntity } from '../playerscore/playerscore.entity';
import { GameScoreTypeService } from '../gamescoretype/gamescoretype.service';
import { adjustPower } from '../utils';
import { ResourceInventoryService } from '../resourceinventory/resourceinventory.service';
import { ResourceInventoryOffsetService } from '../resourceinventoryoffset/resourceinventoryoffset.service';
import { parseEther } from 'ethers/lib/utils';

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
        private readonly gameItemTypeService: GameItemTypeService,
        private readonly playerGameItemService: PlayerGameItemService,
        private readonly gameScoreTypeService: GameScoreTypeService,
        private readonly resourceInventoryService: ResourceInventoryService,
        private readonly resourceInventoryOffsetService: ResourceInventoryOffsetService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = GameService.name
        this.locks = new Map();
    }

    public async getUserSkins(user: UserEntity): Promise<PlayerSkinDto[]> {
        const skins = await this.skinService.findMany({ where: { owner: { uuid: user.uuid } }, relations: ['texture'] })

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

    public async processSnapshots(dto: BulkSnapshotRequestDto): Promise<boolean[]> {
        const res = []
        for (const entry of dto.entries) {
            const user = await this.userService.findByUuid(entry.uuid)
            if (!user) {
                res.push(false)
            }
            const [a, b, c, d] = await this.processUserSnapshots(user, entry)
            res.push(c === d)
        }
        return res
    }

    public async processUserSnapshots(user: UserEntity, dto: SnapshotsDto): Promise<[SnapshotItemEntity[], boolean[], number, number]> {

        if (!user || !dto || !dto.snapshots || dto.snapshots.length == 0) {
            return [[], [], 0, 0]
        }

        // get user with gganbu and snapshots
        // if user is alone, add all the items to user
        // if user is gganbu, write half to user, half to gganbu

        const userAll = await this.userService.findOne({ uuid: user.uuid })

        //console.log(userAll)

        if (!userAll) {
            return [[], [], 0, 0]
        }

        const snapshotSuccessArray = Array.from({ length: dto.snapshots.length }, () => false)

        const received = dto.snapshots.length
        let saved = 0

        //let promises: Promise<SnapshotItemEntity | undefined>[]

        const game = !!dto.gameId ? (await this.gameService.findOne({ id: dto.gameId }) ?? null) : null

        // update or create user stats for the session

        const statId = PlaySessionStatService.calculateId({ uuid: user.uuid, gameId: dto.gameId })
        let stat = await this.playSessionStatService.findOne({ id: statId })

        if (!stat || !dto.accumulatePlayTime) {
            stat = await this.playSessionStatService.create({
                id: PlaySessionStatService.calculateId({ uuid: user.uuid, gameId: dto.gameId }),
                power: dto.power ?? 0,
                timePlayed: dto.playTime.toString() ?? '0',
                game
            })
        } else {
            await this.playSessionStatService.update(statId, {
                power: dto.power ?? 0,
                timePlayed: (Number.parseInt(stat.timePlayed) + (dto.playTime ?? 0)).toString(),
                game
            })
        }

        this.ensureLock(userAll.uuid)

        const userlock = this.locks.get(userAll.uuid)

        const promises = await userlock.runExclusive(async () => {
            const promises = await dto.snapshots.map(async (snapshot: SnapshotDto, i) => {
                const savedS = await this.assignSnapshot(userAll, game, snapshot)

                if (!!savedS) {
                    saved += 1
                    snapshotSuccessArray[i] = true
                }

                return savedS
            })
            return promises
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
                name: material.name
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
        return !!(await this.gameService.findOne({ ongoing: true, type: dto?.kind ?? GameKind.CARNAGE }))
    }

    public async getTextures(skinrequest: { auctionOnly: boolean }): Promise<TextureEntity[]> {
        const textures = skinrequest.auctionOnly ? await this.textureService.findMany({ where: { auction: true } }) : await this.textureService.findMany({})
        return textures
    }

    public async setGameOngoing(dto: SetGameOngoingDto): Promise<boolean> {
        const game = await this.gameService.findOne({ id: dto.gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        if (dto.ongoing && game.type === GameKind.CARNAGE) {
            throw new UnprocessableEntityException("Prevent setting of the “ongoing” flag on game_entity entries where “type” is “CARNAGE”")
        }

        if (game.ongoing && !dto.ongoing) {
            await this.gameService.update(game.id, { ongoing: dto.ongoing, endedAt: Date.now().toString() })
        } else {
            await this.gameService.update(game.id, { ongoing: dto.ongoing })
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

        if (validate && (snapshot.amount < 0)) {
            this.logger.error(`processSnapshots-${user.uuid}:: material ${snapshot.materialName} had invalid amount. Received: ${snapshot.amount}. Allowed: [0, inf)`, null, this.context)
            return undefined
        }

        const amount = half ? snapshot.amount / 2 : snapshot.amount

        const itemId = SnapshotService.calculateId({ uuid: user.uuid, materialName: material.name, gameId: game?.id })
        this.ensureLock(itemId)

        const itemlock = this.locks.get(itemId)

        const savedS = await itemlock.runExclusive(async () => {
            const foundItem = await this.snapshotService.findOneNested({ where: { id: itemId }, relations: ['game'] })

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

        const game = await this.gameService.findOne({ id: gameId })

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

    private async updateSnaplogs(snaplogs: SnaplogEntity[]) {

        let createList = []
        for (let i = 0; i < snaplogs.length; i++) {
            const snaplog = snaplogs[i]

            const existing = await this.snaplogService.findOne({ id: snaplog.id })

            if (!existing) {
                createList.push(snaplog)
            } else {
                const newNum = (Number.parseFloat(existing.amount) + Number.parseFloat(snaplog.amount)).toString()
                await this.snaplogService.update(existing.id, { amount: newNum })
            }
        }

        if (!!createList && createList.length > 0) {
            await this.snaplogService.createAll(createList)
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

            const gameFindCondition = dto?.gameId ? { id: dto.gameId } : null
            do {
                batch = await this.snapshotService.findMany({ where: { game: gameFindCondition }, take, skip, relations: ['material', 'owner', 'game'] })
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
                    const materialName = snapshot.material.name
                    const id = InventoryService.calculateId({ uuid: user.uuid, materialName: materialName })
                    if (!inventoryMap[id]) {
                        const material = snapshot.material
                        inventoryMap[id] = {
                            inv: {
                                amount: amount.toString(),
                                material,
                                owner: snapshot.owner,
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
                            const stats = await this.playSessionStatService.findOne({ id: PlaySessionStatService.calculateId({ uuid: user.uuid, gameId: dto?.gameId }) })
                            const logs: SnaplogEntity[] = newItem.snaps.map(snap => {
                                return {
                                    ...snap,
                                    processedAt: Date.now().toString(),
                                    adjustedPower: adjustPower(stats?.power ?? 0)
                                }
                            })
                            await this.updateSnaplogs(logs)
                            await this.snapshotService.removeAll(newItem.snaps)
                        } catch (e) {
                            this.logger.error(`Bank:: error deleting snapshot while banking ${newItem.inv}`, null, this.context)
                            this.logger.error(e, null, this.context)
                        }
                    } catch (e) {
                        this.logger.error(`Bank:: error updating user inventory ${newItem.inv}`, null, this.context)
                        this.logger.error(e, null, this.context)
                    }

                    // FIXME event sourcing
                    // FIXME hardcoding
                    if (newItem.inv.material.name === 'FISH_SPECIMEN') {
                        const _id = `${newItem.inv.owner.uuid}-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14`
                        const offset = await this.resourceInventoryOffsetService.findOne({ id: _id }, { relations: ['resourceInventory', 'resourceInventory.owner'], loadEagerRelations: true })
                        if (!offset) {
                            const resourceInventory = await this.resourceInventoryService.findOne({ id: _id })
                            resourceInventory.owner
                            if (!!resourceInventory) {
                                await this.resourceInventoryOffsetService.create({
                                    id: _id,
                                    amount: parseEther(newItem.inv.amount).toString(),
                                    resourceInventory
                                })
                            }
                        } else {
                            const updatedAmount = parseEther(newItem.inv.amount).add(offset.amount).toString()
                            await this.resourceInventoryOffsetService.update(_id, { amount: updatedAmount })
                        }
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
        const assets = await this.assetService.findMany({ where: { world, recognizedAssetType: RecognizedAssetType.PLOT } })
        return assets
    }

    async createGame(gameId: string, dto: SetGameDto): Promise<GameEntity> {
        const gameTypeEntity = await this.gameTypeService.findOne({ id: dto.gameTypeId })

        if (!gameTypeEntity) {
            throw new UnprocessableEntityException('Game type was not found')
        }

        const game = await this.gameService.create({
            ...dto,
            id: gameId,
            startedAt: Date.now().toString(),
            gameType: gameTypeEntity
        })

        return game
    }

    async putPlayerScores(gameId: string, dtos: SetPlayerScoreDto[]) {
        const uuids: string[] = dtos.map(_dto => _dto.uuid);
        const gameIds: string[] = dtos.map(_dto => gameId);

        const players = await this.userService.findByIds(uuids)

        if (players.find(p => p == undefined)) {
            throw new UnprocessableEntityException("User not found")
        }

        const games = await this.gameService.findByIds(gameIds)

        if (games.find(p => p == undefined)) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entities = await Promise.all(dtos.map(async (dto, i) => {
            const entity = await this.playerScoreService.create({
                player: players[i],
                game: games[i],
                score: dto.score.toString(),
                scoreId: dto.scoreId,
                updatedAt: dto.updatedAt,
                id: this.playerScoreService.calculateId({ uuid: dto.uuid, gameId })
            })
            return entity;
        }))

        return entities;
    }

    async putGameScoreTypes(gameId: string, dtos: SetGameScoreTypeDto[]) {

        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entities = await Promise.all(dtos.map(async (dto, i) => {
            const entity = await this.gameScoreTypeService.create({
                game,
                ...dto,
                id: this.gameScoreTypeService.calculateId({ gameId, scoreId: dto.scoreId }),
            })
            return entity;
        }))

        return entities;
    }

    async updateAchievements(gameId: string, dto: SetAchievementsDto) {
        const game = await this.gameService.findOne({ id: gameId })

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

    async getPlayerAchievements(gameId: string, uuid: string) {
        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entities = await this.playerAchievementService.findMany({ where: { player: { uuid: uuid }, game: { id: gameId } } })

        return entities
    }

    async getPlayerScore(dto: QueryPlayerScoreDto) {
        const game = await this.gameService.findOne({ id: dto.gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entity = await this.playerScoreService.findOne({ player: { uuid: dto.uuid }, game: { id: dto.gameId } })

        if (!entity) {
            throw new UnprocessableEntityException("Score not found")
        }

        return entity.score
    }

    async getScoreTypes(gameId: string) {
        const game = await this.gameService.findOne({ id: gameId })

        //console.log({ gameId, game })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entities = await this.gameScoreTypeService.findMany({ where: { game: { id: gameId } } });
        return entities;
    }

    async getPlayerScores(gameId: string, dto: QueryPlayerScoresDto) {
        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        dto.search = dto.search ?? '';

        const scores: PlayerScoreEntity[] = await this.playerScoreService.findMany({
            where: {
                game: { id: gameId },
                player: { minecraftUserName: ILike(`%${dto.search}%`) }
            },
            relations: ['game', 'player']
        })
        const players = scores.reduce(function (rv: any, x) {
            let r = rv.find((rvo: any) => rvo.playerId == x.player.uuid);
            if (!r) {
                r = {
                    playerId: x.player.uuid,
                    minecraftUserName: x.player.minecraftUserName,
                    scores: [],
                };
                if (dto.sortBy === 'name') r.minecraftUserName = x.player.minecraftUserName;
                else { r.score = 0; r.updatedAt = 0; }
                rv.push(r);
            }
            r.scores.push({
                scoreId: x.scoreId,
                score: x.score,
                updatedAt: x.updatedAt,
            })
            if (dto.sortBy != 'name' && x.scoreId == dto.sortBy) {
                r.score = x.score; r.updatedAt = x.updatedAt;
            }
            return rv;
        }, []);

        dto.limit = dto.limit ?? 50;
        dto.page = dto.page ?? 1;
        const skip = dto.limit * (dto.page - 1);

        const sortDirection = dto.sort == 'ASC' ? 1 : -1;

        if (dto.sortBy === 'name') {
            players.sort((a: any, b: any) => ((a.minecraftUserName < b.minecraftUserName) ? 1 : -1) * sortDirection);
        } else {
            players.sort((a: any, b: any) => {
                let comp = a.score - b.score;
                if (comp != 0) return comp * sortDirection;
                comp = a.updatedAt - b.updatedAt;
                return comp * sortDirection;
            })
        }
        const pages = Math.ceil(players.length / dto.limit);
        const result = await Promise.all(players.slice(skip, skip + dto.limit).map(async (player: any) => {
            const statId = PlaySessionStatService.calculateId({ uuid: player.playerId, gameId: gameId })
            const playStats = await this.playSessionStatService.findOne({ id: statId });
            player.playtime = playStats?.timePlayed ?? '0';
            delete player.minecraftUserName;
            delete player.score; delete player.updatedAt;
            return player;
        }));
        return {
            meta: {
                ...dto,
                pages,
            },
            data: result,
        }
    }

    async updatePlayerAchievements(gameId: string, uuid: string, dto: SetPlayerAchievementsDto) {
        const player = await this.userService.findOne({ uuid })

        if (!player) {
            throw new UnprocessableEntityException("User not found")
        }

        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entity = await this.playerAchievementService.createMultiple(
            await Promise.all(dto.playerAchievements.map(async pa => {

                const achievement = await this.achievementService.findOne({ id: pa.achievementId })

                return {
                    ...pa,
                    player,
                    game,
                    achievement,
                    id: this.playerAchievementService.calculateId({
                        gameId,
                        uuid,
                        achievementId: pa.achievementId
                    })
                }
            }))
        )

        return entity
    }

    async getGameItemTypes(gameId: string) {

        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const gameItems = await this.gameItemTypeService.findMany({ where: { game: { id: gameId } }, relations: ['game'] })
        const results: GameItemTypeDto[] = gameItems.map(item => {
            delete item.game; delete item.id;
            return item
        })
        return results;
    }

    async getPlayerGameItems(gameId: string, uuid: string) {
        const entities: PlayerGameItemEntity[] = await this.playerGameItemService.findMany({ where: { game: { id: gameId }, player: { uuid: uuid } }, relations: ['game', 'player'] });
        return entities.map(entity => {
            delete entity.game
            delete entity.player
            return {
                itemId: entity.itemId,
                amount: entity.amount,
                updatedAt: entity.updatedAt,
            };
        })
    }

    async getGameItems(gameId: string, dto: QueryGameItemsDto) {
        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        dto.limit = dto.limit ?? 50;
        dto.page = dto.page ?? 1;
        dto.search = dto.search ?? '';

        const sortByLabel = dto.sortBy ? dto.sortBy === 'name' ? 'player.name' : dto.sortBy : 'pitem.amount'
        const sortDirection: 'ASC' | 'DESC' = (dto.sortDirection?.valueOf() ?? SortDirection.DESC.valueOf()) as 'ASC' | 'DESC'

        const entities: PlayerGameItemEntity[] = await getRepository(PlayerGameItemEntity)
            .createQueryBuilder('pitem')
            .leftJoinAndSelect(`pitem.player`, `player`)
            .leftJoinAndSelect(`pitem.game`, `game`)
            .where(`pitem.itemId = :itemId AND game.id = :gameId AND player.minecraftUserName ILIKE :userNameSearch`, { itemId: dto.itemId, gameId, userNameSearch: `%${dto.search}%` })
            .orderBy({
                [sortByLabel]: sortDirection
            })
            .take(dto.limit)
            .skip(dto.limit * (dto.page - 1))
            .getMany();

        if (!entities) {
            throw new UnprocessableEntityException("Score not found")
        }

        const results = await Promise.all(entities.map(async (entity) => {
            const statId = PlaySessionStatService.calculateId({ uuid: entity.player.uuid, gameId: entity.game.id })
            const playStats = await this.playSessionStatService.findOne({ id: statId })
            return {
                playerId: entity.player.uuid,
                itemId: entity.itemId,
                amount: entity.amount,
                playtime: parseInt(playStats?.timePlayed ?? '0') / 1000,
                updatedAt: parseInt(entity.updatedAt),
            }
        }));

        const total: number = await this.playerGameItemService.countByGameItem(gameId, dto.itemId);
        return {
            meta: {
                ...dto,
                pages: Math.ceil(total / dto.limit)
            },
            data: results,
        }
    }

    async putGameItemTypes(gameId: string, dtos: SetGameItemTypeDto[]) {
        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const entities = await Promise.all(dtos.map(async (dto, i) => {
            const entity = await this.gameItemTypeService.create({
                game,
                ...dto,
            })
            return entity;
        }))

        return entities;
    }

    async putGameItems(gameId: string, dtos: SetPlayerGameItemDto[]) {
        const game = await this.gameService.findOne({ id: gameId })

        if (!game) {
            throw new UnprocessableEntityException("Game not found")
        }

        const playerIds: string[] = dtos.map(_dto => _dto.playerId);

        if (playerIds.find(p => !p)) {
            throw new UnprocessableEntityException("Player id not passed")
        }

        let entities: PlayerGameItemEntity[] = []

        for (let i = 0; i < dtos.length; i++) {
            const player = await this.userService.findOne({ uuid: playerIds[i] })

            if (!player) {
                throw new UnprocessableEntityException("Player not found.")
            }

            const entity = await this.playerGameItemService.create({
                ...dtos[i],
                game,
                player,
            })
            entities.push(entity)
        }

        return entities;
    }
}
