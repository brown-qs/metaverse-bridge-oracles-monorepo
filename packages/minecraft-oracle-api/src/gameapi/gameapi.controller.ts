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
import { UserService } from '../user/user.service';
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
import { SetGameDto } from '../game/dto/game.dto';
import { SetPlayerScoreDto } from '../playerscore/dtos/setplayerscore.dto';
import { GetAchievementsDto, SetAchievementsDto } from '../achievement/dtos/achievement.dto';
import { AchievementService } from '../achievement/achievement.service';
import { AchievementEntity } from '../achievement/achievement.entity';
import { GetPlayerAchievementDto, SetPlayerAchievementsDto } from '../playerachievement/dtos/playerachievement.dto';
import { PlayerAchievementEntity } from '../playerachievement/playerachievement.entity';
import { UserEntity } from '../user/user.entity';
import { GetGameItemDto, GetGameItemsDto } from './dtos/gameitem.dto';
import { SetGameItemTypeDto } from '../gameitemtype/dtos/gameitemtype.dto';
import { SetPlayerGameItemDto } from '../playergameitem/dtos/playergameitem.dto';
import { GameService } from '../game/game.service';

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

    @Get('player/:uuid/profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async profile(@Param('uuid') uuid: string): Promise<ProfileDto> {
        let user = await this.userService.findByUuid(uuid)
        if ( !user ){
            const userData: UserEntity = {
                uuid: uuid,
                hasGame: false
            }
            let newUser: UserEntity
            try {
                newUser = await this.userService.create(userData)
                user = await this.userService.findByUuid(uuid)
            } catch (err) {
                this.logger.error(`authLogin: error upserting user into database: ${JSON.stringify(userData)}`, err, this.context)
                throw new UnprocessableEntityException(`Error upserting user into database: ${JSON.stringify(userData)}`)
            }
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
            throw new UnprocessableEntityException('Player was not found')
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
            throw new UnprocessableEntityException('Player was not found')
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
        @Body() {serverId}: ServerIdDto
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

    @Put('gganbu')
    @HttpCode(200)
    @ApiOperation({ summary: 'Makes players gganbu' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGganbu(
        @Body() gganbus: GganbuDto,
    ): Promise<boolean> {
        const success = await this.gameApiService.setGganbu(gganbus.player1, gganbus.player2)
        return success
    }

    @Get('gganbu')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets if players are gganbu' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getGganbu(
        @Query() gganbus: GganbuDto,
    ): Promise<AreGganbusDto> {
        const success = await this.gameApiService.getGganbu(gganbus.player1, gganbus.player2)
        return {areGganbus:success}
    }

    @Delete('gganbus')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets if players are gganbu' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async clearGganbus(): Promise<boolean> {
        const success = await this.gameApiService.clearGganbus()
        return success
    }

    @Put('player/:uuid/session/:gameId/end')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logs an ongoing game session end' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async endPlayerGameSession(
        @Param('uuid') uuid: string,
        @Param('gameId') gameId: string
    ): Promise<boolean> {
        const success = await this.gameApiService.setPlayerGameSession(uuid, gameId,true)
        return success
    }

    @Put('player/:uuid/session/:gameId/start')
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
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async gameTypes() {
        const entities = await this.gameTypeService.find({})
        return (entities ?? [])
    }

    @Get('games')
    @HttpCode(200)
    @ApiOperation({ summary: 'fetch games' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async games() {
        const entities = await this.gameService.find({})
        return (entities ?? [])
    }
    
    @Put('gametype')
    @HttpCode(200)
    @ApiOperation({ summary: 'Upserts a game type entry' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGameType(
        @Body() dto: SetGameTypeDto,
    ): Promise<boolean> {
        const entity = await this.gameTypeService.create(dto)
        return !!entity
    }

    @Put('game')
    @HttpCode(200)
    @ApiOperation({ summary: 'Upsers a game entry' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGame(
        @Body() dto: SetGameDto,
    ): Promise<boolean> {
        const entity = await this.gameApiService.createGame(dto)
        return !!entity
    }

    @Put('player/score')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates player score' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setUserScore(
        @Body() dto: SetPlayerScoreDto,
    ): Promise<boolean> {
        const entity = await this.gameApiService.updatePlayerScore(dto)
        return !!entity
    }

    @Put('achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Saves achievemenets for a game' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setAchievements(
        @Body() dto: SetAchievementsDto,
    ): Promise<boolean> {
        const entity = await this.gameApiService.updateAchievements(dto)
        return !!entity
    }

    @Get('achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Queries available achievemenets for a game' })
    async getAchievements(
         @Query() {gameId}: GetAchievementsDto,
    ): Promise<AchievementEntity[]> {
        const entities = await this.achievementService.findMany({where: {game: {id: gameId}}, relations: ['game']})
        return entities
    }

    @Get('player/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Queries all player achievements for a game.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getPlayerAchievements(
        @Query() dto: GetPlayerAchievementDto
    ): Promise<PlayerAchievementEntity[]> {
        const entities = await this.gameApiService.getPlayerAchievements(dto)
        return entities
    }

    @Put('player/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates player achievements for a game.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setPlayerAchievements(
        @Body() dto: SetPlayerAchievementsDto,
    ): Promise<boolean> {
        const entities = await this.gameApiService.updatePlayerAchievements(dto)
        return !!entities
    }

    @Get('itemtypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetch Item Types for a game.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getGameItemTypes(
        @Query() { gameId }: any,
    ): Promise<any[]> {
        const entities = await this.gameApiService.getGameItemTypes(gameId)
        return entities
    }
    
    @Get('items')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetch Items for game and item type.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getGameItems(
        @Query() dto: GetGameItemsDto,
    ): Promise<any> {
        const entities = await this.gameApiService.getGameItems(dto)
        return entities
    }
    
    @Get('item')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetch Items for game and player.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getGameItem(
        @Query() { gameId, uuid }: GetGameItemDto,
    ): Promise<any> {
        const results = await this.gameApiService.getGamePlayerItems(gameId, uuid)
        return results
    }

    @Put('itemtypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'Put Game Item Types as Array' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setItemTypes(
        @Body() dto: SetGameItemTypeDto[],
    ): Promise<boolean> {
        const entity = await this.gameApiService.putGameItemTypes(dto)
        return !!entity
    }

    @Put('items')
    @HttpCode(200)
    @ApiOperation({ summary: 'Put Player Game Items' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setPlayerGameItems(
        @Body() dto: SetPlayerGameItemDto[],
    ): Promise<boolean> {
        const entity = await this.gameApiService.putGameItems(dto)
        return !!entity
    }
}
