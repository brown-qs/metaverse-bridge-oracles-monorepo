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
import { ProfileDto } from '../profile/dtos/profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../utils/decorators';
import { UserEntity } from '../user/user.entity';
import { UserRole } from '../common/enums/UserRole';
import { PlayerTextureMapDto } from '../game/dtos/texturemap.dto';
import { GameService } from '../game/game.service';
import { MaterialsDto } from './dtos/material.dto';
import { AdminService } from './admin.service';
import { TexturesDto } from './dtos/textures.dto';
import { SecretDto, SecretsDto } from './dtos/secret.dto';
import { SnapshotsDto } from '../game/dtos/snapshot.dto';
import { PreferredServersDto } from './dtos/preferredServer.dto';
import { ProfileService } from '../profile/profile.service';
import { AdminConfirmDto, OracleActionTypeDto } from './dtos/confirm.dto';
import { OracleService } from '../oracle/oracle.service';
import { OracleRequestDto } from './dtos/oraclerequest.dto';
import { ExportDto } from 'src/oracle/dtos/export.dto';
import { ImportDto } from 'src/oracle/dtos/import.dto';
import { SummonDto } from 'src/oracle/dtos/summon.dto';
import { CallparamDto } from 'src/oracle/dtos/callparams.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileService,
        private readonly gameService: GameService,
        private readonly adminService: AdminService,
        private readonly oracleService: OracleService,
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
        return this.profileService.userProfile(user)
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
        @Body() snapshots: SnapshotsDto,
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

    @Put('player/:uuid/vip/:vip')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets player vip flag' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async vip(
        @User() caller: UserEntity, 
        @Param('uuid') uuid: string,
        @Param('vip') vip: boolean
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }

        const success = await this.adminService.setVIP({uuid}, typeof vip === 'string' ? vip === 'true' : vip)
        return success
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
        @User() caller: UserEntity,
        @Body() sdto: SecretDto,
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const success = await this.adminService.setSharedSecret(sdto.name, sdto.secret)
        return success
    }

    @Get('secret/:name')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets shared secret value' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getSecret(
        @User() caller: UserEntity,
        @Param('name') name: string
    ): Promise<SecretDto> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
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
    async getSecrets(
        @User() caller: UserEntity,
    ): Promise<SecretsDto> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const secrets = await this.adminService.getSharedSecrets()
        return {secrets}
    }

     @Put('preferredServers')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets preferred server for a user' })
    @ApiBearerAuth('AuthenticationHeader')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async setPerferredServer(
        @User() caller: UserEntity,
        @Body() psDto: PreferredServersDto
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const promises = psDto.preferredServers.map(async(x) => {
            await this.userService.update(x.uuid, { preferredServer: x.preferredServer})
        })

        await Promise.all(promises)
        return true
    }

    @Put('confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Manual trigger of confirmation of a multiverse bridge event' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getConfirmations(
        @User() caller: UserEntity,
        @Body() dto: AdminConfirmDto
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const user = await this.userService.findOne({uuid: dto.uuid})
        if (!user) {
            return false
        }
        let success = false
        if (dto.type.valueOf() === OracleActionTypeDto.ENRAPTURE ) {
            success = await this.oracleService.userEnraptureConfirm(user, dto)
        }  else if (dto.type.valueOf() === OracleActionTypeDto.IMPORT ) {
            success = await this.oracleService.userImportConfirm(user, dto)
        } else if (dto.type.valueOf() === OracleActionTypeDto.EXPORT ) {
            success = await this.oracleService.userExportConfirm(user, dto)
        }
        return success
    }

    @Put('oracle/request')
    @HttpCode(200)
    @ApiOperation({ summary: 'Manual request for a user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async manualRequest(
        @User() caller: UserEntity,
        @Body() dto: OracleRequestDto
    ): Promise<CallparamDto | boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const user = await this.userService.findOne({uuid: dto.uuid})
        if (!user) {
            throw new UnprocessableEntityException('User not found')
        }
        let res
        if (dto.type.valueOf() === OracleActionTypeDto.ENRAPTURE.valueOf() ) {
            res = await this.oracleService.userInRequest(user, dto.data as ImportDto, true)
        }  else if (dto.type.valueOf() === OracleActionTypeDto.IMPORT.valueOf() ) {
            res = await this.oracleService.userInRequest(user, dto.data as ImportDto, false)
        } else if (dto.type.valueOf() === OracleActionTypeDto.EXPORT.valueOf()) {
            res = await this.oracleService.userOutRequest(user, dto.data as ExportDto)
        } else if (dto.type.valueOf() === OracleActionTypeDto.SUMMON.valueOf()) {
            const success = await this.oracleService.userSummonRequest(user, dto.data as SummonDto)
            return success
        } else {
            throw new UnprocessableEntityException('Wrong command type')
        }
        return {
            hash: res[0],
            data: res[1],
            signature: res[2],
            confirmed: res[3]
        }
    }

    @Put('communism')
    @HttpCode(200)
    @ApiOperation({ summary: 'Server wide gganbu snapshot resource distribution' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async communism(
        @User() caller: UserEntity
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        await this.gameService.communism()
        return true
    }
}
