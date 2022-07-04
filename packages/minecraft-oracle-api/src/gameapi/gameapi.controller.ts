import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    Query,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GameApiService } from './gameapi.service';
import { UserService } from '../user/user/user.service';
import { ProfileDto } from '../profileapi/dtos/profile.dto';
import { SnapshotsDto } from './dtos/snapshot.dto';
import { PlayerSkinDto } from './dtos/texturemap.dto';
import { PermittedMaterials } from './dtos/permitted-material.dto';
import { SharedSecretGuard } from '../authapi/secret.guard';
import { AreGganbusDto, GganbuDto } from './dtos/gganbu.dto';
import { ServerIdDto } from './dtos/serverId.dto';
import { ProfileApiService } from '../profileapi/profileapi.service';
import { SkinRequestDto } from './dtos/skins.dto';
import { TextureEntity } from '../texture/texture.entity';
import { SkinselectDto } from '../profileapi/dtos/skinselect.dto';
import { AssetEntity } from '../asset/asset.entity';
import { SetGameOngoingDto } from './dtos/setgameongoing.dto';
import { GameKindInProgressDto } from './dtos/gamekndinprogress.dto';
import { SetGameTypeDto } from '../gametype/dtos/gametype.dto';
import { GameTypeService } from '../gametype/gametype.service';
import { FetchGameDto, SetGameDto } from '../game/dto/game.dto';
import { QueryPlayerScoresDto, SetPlayerScoresDto } from '../playerscore/dtos/playerscore.dto';
import { SetAchievementsDto } from '../achievement/dtos/achievement.dto';
import { AchievementService } from '../achievement/achievement.service';
import { AchievementEntity } from '../achievement/achievement.entity';
import { SetPlayerAchievementsDto } from '../playerachievement/dtos/playerachievement.dto';
import { PlayerAchievementEntity } from '../playerachievement/playerachievement.entity';
import { UserEntity } from '../user/user/user.entity';
import { SetGameScoreTypeDto } from '../gamescoretype/dtos/gamescoretype.dto';
import { GameItemTypeDto, SetGameItemTypesDto } from '../gameitemtype/dtos/gameitemtype.dto';
import { PlayerGameItemsDto, QueryGameItemsDto, SetPlayerGameItemsDto } from '../playergameitem/dtos/playergameitem.dto';
import { GameService } from '../game/game.service';
import { UserAssetFingerprint, UserAssetFingerprintsResult } from './dtos/fingerprint.dto';
import { ResourceInventoryQueryResult, SetResourceInventoryItems } from './dtos/resourceinventory.dto';
import { SetResourceInventoryOffsetItems } from './dtos/resourceinventoryoffset.dto';
import { GetFungibleBalancesResultDto } from './dtos/fungiblebalances.dto';

@ApiTags('game')
@Controller('game')
export class GameApiController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly achievementService: AchievementService,
        private readonly gameApiService: GameApiService,
        private readonly gameTypeService: GameTypeService,
        private readonly profileService: ProfileApiService,
        private readonly gameService: GameService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = GameApiController.name;
    }
    @Get('player/:minecraftUuid/profileByMinecraftUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile by minecraftUuid' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async profileByMinecraftUuid(@Param('minecraftUuid') minecraftUuid: string): Promise<ProfileDto> {
        let user = await this.userService.findByMinecraftUuid(minecraftUuid)
        if (!user) {
            throw new UnprocessableEntityException('User was not found')
        }
        return this.profileService.userProfile(user)
    }


    @Get('player/:uuid/profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile by uuid' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async profile(@Param('uuid') uuid: string): Promise<ProfileDto> {
        let user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('User was not found')
        }
        return this.profileService.userProfile(user)
    }

    @Get('player/:uuid/skins')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches player skins' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async textures(@Param('uuid') uuid: string): Promise<PlayerSkinDto[]> {
        const user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('User was not found')
        }
        const skins = await this.gameApiService.getUserSkins(user)
        return skins
    }

    @Put('player/:uuid/skin')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets active user skin.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setUserSkin(
        @Param('uuid') uuid: string,
        @Body() dto: SkinselectDto
    ): Promise<boolean> {
        const user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('User was not found')
        }
        const success = await this.profileService.skinSelect(user, dto)
        return success
    }

    @Get('player/:uuid/allowed')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async allowed(@Param('uuid') uuid: string): Promise<boolean> {
        const user = await this.userService.findByUuid(uuid)
        return user?.allowedToPlay ?? false
    }

    @Get('world/:world/plots')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches world plots' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getWorldPlots(@Param('world') world: string): Promise<AssetEntity[]> {
        const plots = await this.gameApiService.getWorldPlots(world)
        return plots
    }

    @Get('player/:uuid/assets')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user assets' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async userAssets(@Param('uuid') uuid: string): Promise<AssetEntity[]> {
        const user = await this.userService.findByUuid(uuid)
        const res = await this.profileService.userAssets(user)
        return res
    }

    @Put('player/:uuid/snapshot')
    @HttpCode(200)
    @ApiOperation({ summary: 'Saves player resources' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async snapshot(
        @Param('uuid') uuid: string,
        @Body() snapshots: SnapshotsDto,
    ): Promise<boolean[]> {
        const user = await this.userService.findByUuid(uuid)

        if (!user) {
            throw new UnprocessableEntityException('No player found')
        }

        const [snapshottedItems, successArray, receivedNum, savedNum] = await this.gameApiService.processSnapshots(user, snapshots)
        return successArray
    }

    @Put('player/:uuid/serverId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets server id for a user' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setServerId(
        @Param('uuid') uuid: string,
        @Body() { serverId }: ServerIdDto
    ): Promise<boolean> {
        const user = await this.userService.findByUuid(uuid)
        await this.userService.update(user.uuid, {
            serverId
        })
        return true
    }

    @Delete('player/:uuid/serverId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Deletes server id of a user' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async deleteServerId(
        @Param('uuid') uuid: string
    ): Promise<ServerIdDto> {
        const user = await this.userService.findByUuid(uuid)
        const oldId = user.serverId
        await this.userService.update(user.uuid, {
            serverId: null
        })
        return {
            serverId: oldId
        }
    }

    @Get('snapshot/materials')
    @HttpCode(200)
    @ApiOperation({ summary: 'Returns the permitted snapshottable in-game materials' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getSnapshottableMaterials(): Promise<PermittedMaterials> {
        const permittedMaterials = await this.gameApiService.getSnapshottableMaterialsList()
        return permittedMaterials
    }

    @Put('ongoing')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets whether there is an active game going on or not' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGameInProgress(
        @Body() dto: SetGameOngoingDto,
    ): Promise<boolean> {
        const success = await this.gameApiService.setGameOngoing(dto)
        return success
    }

    @Get('ongoing')
    @HttpCode(200)
    @ApiOperation({ summary: 'Returns whether there is an active game in progress or not' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getGameInProgress(
        @Query() dto: GameKindInProgressDto,
    ): Promise<boolean> {
        const inprogress = await this.gameApiService.getGameKindInProgress(dto)
        return inprogress
    }

    @Get('skins')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches skin data' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async skins(
        @Query() skinrequest: SkinRequestDto,
    ): Promise<TextureEntity[]> {
        const skins = await this.gameApiService.getTextures(skinrequest)
        return skins
    }

    @Put('game/:gameId/session/:uuid/end')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logs an ongoing game session end' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async endPlayerGameSession(
        @Param('uuid') uuid: string,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const success = await this.gameApiService.setPlayerGameSession(uuid, gameId, true)
        return success
    }

    @Put('game/:gameId/session/:uuid/start')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logs an ongoing game session start' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async startPlayerGameSession(
        @Param('uuid') uuid: string,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const success = await this.gameApiService.setPlayerGameSession(uuid, gameId, false)
        return success
    }

    @Get('gametypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'fetches game types' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async gameTypes() {
        const entities = await this.gameTypeService.find({})
        return (entities ?? [])
    }

    @Get('games')
    @HttpCode(200)
    @ApiOperation({ summary: 'fetch games' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async games(
        @Query() dto: FetchGameDto,
    ) {
        if (!dto?.gameTypeId) {
            const entities = await this.gameService.findMany({ relations: ['gameType'] })
            return (entities ?? [])
        }

        const entities = await this.gameService.findMany({ where: { gameType: { id: dto.gameTypeId } }, relations: ['gameType'] })
        return (entities ?? [])
    }

    @Put('gametype/:typeId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Upserts a game type entry' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGameType(
        @Body() dto: SetGameTypeDto,
        @Param('typeId') typeId: string
    ): Promise<boolean> {
        const entity = await this.gameTypeService.create({
            ...dto,
            id: typeId
        })
        return !!entity
    }

    @Put('game/:gameId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Upserts a game entry' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGame(
        @Body() dto: SetGameDto,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const entity = await this.gameApiService.createGame(gameId, dto)
        return !!entity
    }

    @Get('game/:gameId/scores')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches players scores' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async getScores(
        @Query() dto: QueryPlayerScoresDto,
        @Param('gameId') gameId: string
    ) {
        const entities = await this.gameApiService.getPlayerScores(gameId, dto)
        return entities;
    }

    @Put('game/:gameId/scores')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates player score' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setUserScore(
        @Body() dto: SetPlayerScoresDto,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const entity = await this.gameApiService.putPlayerScores(gameId, dto.playerScores)
        return !!entity
    }

    @Get('game/:gameId/scoretypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches score types of a game' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async getScoreTypes(
        @Param('gameId') gameId: string
    ) {
        const entities = await this.gameApiService.getScoreTypes(gameId);
        return entities;
    }

    @Put('game/:gameId/scoretypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'Create player score types' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGameScoreTypes(
        @Body() dto: SetGameScoreTypeDto[],
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const entity = await this.gameApiService.putGameScoreTypes(gameId, dto)
        return !!entity
    }

    @Put('game/:gameId/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Saves achievemenets for a game' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setAchievements(
        @Body() dto: SetAchievementsDto,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const entity = await this.gameApiService.updateAchievements(gameId, dto)
        return !!entity
    }

    @Get('game/:gameId/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Queries available achievemenets for a game' })
    async getAchievements(
        @Param('gameId') gameId: string
    ): Promise<AchievementEntity[]> {
        const entities = await this.achievementService.findMany({ where: { game: { id: gameId } }, relations: ['game'] })
        return entities
    }

    @Get('game/:gameId/player/:uuid/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Queries all player achievements for a game.' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async getPlayerAchievements(
        @Param('gameId') gameId: string,
        @Param('uuid') uuid: string
    ): Promise<PlayerAchievementEntity[]> {
        const entities = await this.gameApiService.getPlayerAchievements(gameId, uuid)
        return entities
    }

    @Put('game/:gameId/player/:uuid/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates player achievements for a game.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setPlayerAchievements(
        @Body() dto: SetPlayerAchievementsDto,
        @Param('gameId') gameId: string,
        @Param('uuid') uuid: string
    ): Promise<boolean> {
        const entities = await this.gameApiService.updatePlayerAchievements(
            gameId,
            uuid,
            dto
        )
        return !!entities
    }

    @Get('game/:gameId/itemtypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetch item types for a game.' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async getGameItemTypes(
        @Param('gameId') gameId: string
    ): Promise<GameItemTypeDto[]> {
        const entities = await this.gameApiService.getGameItemTypes(gameId)
        return entities
    }

    @Get('game/:gameId/player/:uuid/items')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches all items for given game and player' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async getPlayerGameItems(
        @Param('gameId') gameId: string,
        @Param('uuid') uuid: string
    ): Promise<PlayerGameItemsDto[]> {
        const data = await this.gameApiService.getPlayerGameItems(gameId, uuid)
        return data
    }

    @Get('game/:gameId/items')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches players itmes.' })
    //@ApiBearerAuth('AuthenticationHeader')
    //@UseGuards(SharedSecretGuard)
    async getGameItems(
        @Query() dto: QueryGameItemsDto,
        @Param('gameId') gameId: string
    ): Promise<any> {
        const results = await this.gameApiService.getGameItems(gameId, dto)
        return results
    }

    @Put('game/:gameId/itemtypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates player game item types' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setItemTypes(
        @Body() dto: SetGameItemTypesDto,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const entity = await this.gameApiService.putGameItemTypes(gameId, dto.gameItemTypes)
        return !!entity
    }

    @Put('game/:gameId/items')
    @HttpCode(200)
    @ApiOperation({ summary: 'Upserts player game items' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setPlayerGameItems(
        @Body() dto: SetPlayerGameItemsDto,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const entity = await this.gameApiService.putGameItems(gameId, dto.playerGameItems)
        return !!entity
    }

    @Get('fingerprint/assets/players')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets the fingerprints of all the players assets' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getAssetFingerprints(): Promise<UserAssetFingerprintsResult> {
        const result = await this.gameApiService.getAssetFingerprints()
        return result
    }

    @Get('fingerprint/assets/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets the fingerprints of all the players assets' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getAssetFingerprintForPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<UserAssetFingerprint> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.gameApiService.getAssetFingerprintForPlayer(user)
        return result
    }

    @Get('resourceinventory/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player resource inventory' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getResourceInventoryPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<ResourceInventoryQueryResult[]> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.gameApiService.getResourceInventoryPlayer(user)
        return result
    }

    @Put('resourceinventory/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Create player resource inventory' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setResourceInventoryPlayer(
        @Param('trimmedUuid') uuid: string,
        @Body() dto: SetResourceInventoryItems
    ): Promise<boolean> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.gameApiService.setResourceInventoryPlayer(user, dto)
        return result
    }

    @Get('resourceinventory/offset/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player resource inventory offset' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getResourceInventoryOffsetPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<ResourceInventoryQueryResult[]> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.gameApiService.getResourceInventoryOffsetPlayer(user)
        return result
    }

    @Put('resourceinventory/offset/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Create player resource inventory offset' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setResourceInventoryOffsetPlayer(
        @Param('trimmedUuid') uuid: string,
        @Body() dto: SetResourceInventoryOffsetItems
    ): Promise<boolean> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.gameApiService.setResourceInventoryPlayer(user, dto)
        return result
    }

    @Get('fungible/balances/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player enraptured/imported fungible balances with offsets applied' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getFungibleBalancesForPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<GetFungibleBalancesResultDto> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.gameApiService.getFungibleBalancesForPlayer(user)
        return result
    }
}
