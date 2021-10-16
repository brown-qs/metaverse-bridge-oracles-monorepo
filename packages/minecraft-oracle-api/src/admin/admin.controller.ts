import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
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
import { UserService } from '../user/user.service';
import { ProfileDto } from '../user/dtos/profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../utils/decorators';
import { UserEntity } from '../user/user.entity';
import { UserRole } from '../common/enums/UserRole';
import { PlayerTextureMapDto } from '../game/dtos/texturemap.dto';
import { PermittedMaterials } from '../game/dtos/permitted-material.dto';
import { Snapshots } from '../game/dtos/snapshot.dto';
import { GameService } from '../game/game.service';
import { MaterialsDto } from './dtos/material.dto';
import { AdminService } from './admin.service';
import { TexturesDto } from './dtos/textures.dto';
import { SecretDto, SecretNameDto, SecretsDto } from './dtos/secret.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly adminService: AdminService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = AdminController.name;
    }

    @Get('player/:uuid/profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async profile(@User() caller: UserEntity, @Param('uuid') uuid: string): Promise<ProfileDto> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
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
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async textures(@User() caller: UserEntity, @Param('uuid') uuid: string): Promise<PlayerTextureMapDto> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('Player was not found')
        }
        const textures = await this.gameService.getTextures(user)
        return textures
    }

    @Put('player/:uuid/snapshot')
    @HttpCode(200)
    @ApiOperation({ summary: 'Saves player resources' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async snapshot(
        @User() caller: UserEntity, 
        @Param('uuid') uuid: string,
        @Body() snapshots: Snapshots,
    ): Promise<boolean[]> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }

        const user = await this.userService.findByUuid(uuid)
        
        if (!user) {
            throw new UnprocessableEntityException('No player found')
        }

        const [snapshottedItems, successArray, receivedNum, savedNum] = await this.gameService.processSnapshots(user, snapshots)
        return successArray
    }

    @Put('materials')
    @HttpCode(200)
    @ApiOperation({ summary: 'Adds or updates recognized materials' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async addMaterials(
        @User() caller: UserEntity,
        @Body() materials: MaterialsDto,
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const success = await this.adminService.saveMaterials(materials.materials)
        return success
    }

    @Delete('materials')
    @HttpCode(200)
    @ApiOperation({ summary: 'Deletes recognized materials' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteMaterials(
        @User() caller: UserEntity,
        @Body() materials: MaterialsDto,
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const success = await this.adminService.deleteMaterials(materials.materials)
        return success
    }

    @Put('textures')
    @HttpCode(200)
    @ApiOperation({ summary: 'Adds or updates recognized textures' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async addTextures(
        @User() caller: UserEntity,
        @Body() textures: TexturesDto,
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const success = await this.adminService.saveTextures(textures.textures)
        return success
    }

    @Delete('textures')
    @HttpCode(200)
    @ApiOperation({ summary: 'Deletes recognized textures' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteTextures(
        @User() caller: UserEntity,
        @Body() textures: TexturesDto,
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const success = await this.adminService.deleteTextures(textures.textures)
        return success
    }

    @Put('secret')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets a shared secret' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async setSecret(
        @Body() sdto: SecretDto,
    ): Promise<boolean> {
        const success = await this.adminService.setSharedSecret(sdto.name, sdto.secret)
        return success
    }

    @Get('secret/:name')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets shared secret value' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getSecret(
        @Param('name') name: string
    ): Promise<SecretDto> {
        const s = await this.adminService.getSharedSecret(name)
        if (!s) {
            throw new UnprocessableEntityException("Shared secret not found")
        }
        return s
    }

    @Get('secrets')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets shared secrets' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getSecrets(): Promise<SecretsDto> {
        const secrets = await this.adminService.getSharedSecrets()
        return {secrets}
    }
}
