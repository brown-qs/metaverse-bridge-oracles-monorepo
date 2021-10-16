import {
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GameService } from './game.service';
import { UserService } from '../user/user.service';
import { ProfileDto } from '../user/dtos/profile.dto';
import { Snapshots } from './dtos/snapshot.dto';
import { PlayerTextureMapDto } from './dtos/texturemap.dto';
import { PermittedMaterials } from './dtos/permitted-material.dto';
import { GameInProgressDto } from './dtos/gameinprogress.dto';
import { SharedSecretGuard } from 'src/auth/secret.guard';

@ApiTags('game')
@Controller('game')
export class GameController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
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
        return {
            uuid: user.uuid,
            userName: user.userName,
            allowedToPlay: user.allowedToPlay,
            hasGame: user.hasGame,
            role: user.role
        }
    }

    @Get('player/:uuid/textures')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches player textures' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async textures(@Param('uuid') uuid: string): Promise<PlayerTextureMapDto> {
        const user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('Player was not found')
        }
        const textures = await this.gameService.getTextures(user)
        return textures
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

    @Put('player/:uuid/snapshot')
    @HttpCode(200)
    @ApiOperation({ summary: 'Saves player resources' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async snapshot(
        @Param('uuid') uuid: string,
        @Body() snapshots: Snapshots,
    ): Promise<boolean[]> {
        const user = await this.userService.findByUuid(uuid)
        
        if (!user) {
            throw new UnprocessableEntityException('No player found')
        }

        const [snapshottedItems, successArray, receivedNum, savedNum] = await this.gameService.processSnapshots(user, snapshots)
        return successArray
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
}
