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
import { GameService } from './game.service';
import { UserService } from '../user/user.service';
import { ProfileDto } from '../profile/dtos/profile.dto';
import { SnapshotsDto } from './dtos/snapshot.dto';
import { PlayerSkinDto } from './dtos/texturemap.dto';
import { PermittedMaterials } from './dtos/permitted-material.dto';
import { GameInProgressDto } from './dtos/gameinprogress.dto';
import { SharedSecretGuard } from '../auth/secret.guard';
import { AreGganbusDto, GganbuDto } from './dtos/gganbu.dto';
import { ServerIdDto } from './dtos/serverId.dto';
import { ProfileService } from '../profile/profile.service';
import { SkinRequestDto } from './dtos/skins.dto';
import { TextureEntity } from '../texture/texture.entity';
import { SkinselectDto } from '../profile/dtos/skinselect.dto';
import { AssetEntity } from '../asset/asset.entity';

@ApiTags('game')
@Controller('game')
export class GameController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly profileService: ProfileService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = GameController.name;
    }

    @Get('player/:uuid/profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async profile(@Param('uuid') uuid: string): Promise<ProfileDto> {
        const user = await this.userService.findByUuid(uuid)
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
        const skins = await this.gameService.getUserSkins(user)
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
        const plots = await this.gameService.getWorldPlots(world)
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

        const [snapshottedItems, successArray, receivedNum, savedNum] = await this.gameService.processSnapshots(user, snapshots)
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
        const permittedMaterials = await this.gameService.getSnapshottableMaterialsList()
        return permittedMaterials
    }

    @Put('inprogress')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets whether there is an active game going on or not' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setGameInProgress(
        @Body() progress: GameInProgressDto,
    ): Promise<boolean> {
        const success = await this.gameService.setGameInProgress(progress.gameInProgress)
        return success
    }

    @Get('inprogress')
    @HttpCode(200)
    @ApiOperation({ summary: 'Returns whether there is an active game in progress or not' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getGameInProgress(): Promise<boolean> {
        const inprogress = await this.gameService.getGameInProgress()
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
        const skins = await this.gameService.getTextures(skinrequest)
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
        const success = await this.gameService.setGganbu(gganbus.player1, gganbus.player2)
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
        const success = await this.gameService.getGganbu(gganbus.player1, gganbus.player2)
        return {areGganbus:success}
    }

    @Delete('gganbus')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets if players are gganbu' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async clearGganbus(): Promise<boolean> {
        const success = await this.gameService.clearGganbus()
        return success
    }

    @Put('player/:uuid/session/:identifier/end')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logs an ongoing game session end' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async endPlayerGameSession(
        @Param('uuid') uuid: string,
        @Param('identifier') identifier: string
    ): Promise<boolean> {
        const success = await this.gameService.setPlayerGameSession(uuid, identifier,true)
        return success
    }

    @Put('player/:uuid/session/:identifier/start')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logs an ongoing game session start' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async startPlayerGameSession(
        @Param('uuid') uuid: string,
        @Param('identifier') identifier: string
    ): Promise<boolean> {
        const success = await this.gameService.setPlayerGameSession(uuid, identifier, false)
        return success
    }
}
