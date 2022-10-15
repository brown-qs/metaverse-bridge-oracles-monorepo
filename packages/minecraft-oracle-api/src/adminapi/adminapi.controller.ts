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
import { UserService } from '../user/user/user.service';
import { ProfileDto } from '../profileapi/dtos/profile.dto';
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { User } from '../utils/decorators';
import { UserEntity } from '../user/user/user.entity';
import { UserRole } from '../common/enums/UserRole';
import { PlayerSkinDto } from '../gameapi/dtos/texturemap.dto';
import { GameApiService } from '../gameapi/gameapi.service';
import { MaterialsDto } from './dtos/material.dto';
import { AdminApiService } from './adminapi.service';
import { TexturesDto } from './dtos/textures.dto';
import { SecretDto, SecretsDto } from './dtos/secret.dto';
import { SnapshotsDto } from '../gameapi/dtos/snapshot.dto';
import { PreferredServersDto } from './dtos/preferredServer.dto';
import { ProfileApiService } from '../profileapi/profileapi.service';
import { AdminConfirmDto, OracleActionTypeDto } from './dtos/confirm.dto';
import { OracleApiService } from '../oracleapi/oracleapi.service';
import { SummonDto } from '../oracleapi/dtos/summon.dto';
import { CallparamDto } from '../oracleapi/dtos/callparams.dto';
import { CommunismDto } from './dtos/communism.dto';
import { BlacklistDto } from './dtos/blacklist.dto';
import { GameTypeService } from '../gametype/gametype.service';
import { GameService } from '../game/game.service';
import { BankDto } from '../gameapi/dtos/bank.dto';
import { InDto } from '../oracleapi/dtos/in.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminApiController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileApiService,
        private readonly gameApiService: GameApiService,
        private readonly gameTypeService: GameTypeService,
        private readonly gameService: GameService,
        private readonly adminApiService: AdminApiService,
        private readonly oracleService: OracleApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = AdminApiController.name;
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

    @Get('player/:uuid/skins')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches player skins' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async textures(@User() caller: UserEntity, @Param('uuid') uuid: string): Promise<PlayerSkinDto[]> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('Player was not found')
        }
        const skins = await this.gameApiService.getUserSkins(user)
        return skins
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

        const [snapshottedItems, successArray, receivedNum, savedNum] = await this.gameApiService.processUserSnapshots(user, snapshots)
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

        const success = await this.adminApiService.setVIP({ uuid }, typeof vip === 'string' ? vip === 'true' : vip)
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
        const success = await this.adminApiService.saveMaterials(materials.materials)
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
        const success = await this.adminApiService.deleteMaterials(materials.materials)
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
        const success = await this.adminApiService.saveTextures(textures.textures)
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
        const success = await this.adminApiService.deleteTextures(textures.textures)
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
        const success = await this.adminApiService.setSharedSecret(sdto.name, sdto.secret)
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
        const s = await this.adminApiService.getSharedSecret(name)
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
        const secrets = await this.adminApiService.getSharedSecrets()
        return { secrets }
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
        const promises = psDto.preferredServers.map(async (x) => {
            await this.userService.update(x.uuid, { preferredServer: x.preferredServer })
        })

        await Promise.all(promises)
        return true
    }
    /*
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
            const user = await this.userService.findOne({ uuid: dto.uuid })
            if (!user) {
                return false
            }
            let success = false
            if (dto.type.valueOf() === OracleActionTypeDto.ENRAPTURE) {
                success = await this.oracleService.userInConfirm(user, dto)
            } else if (dto.type.valueOf() === OracleActionTypeDto.IMPORT) {
                success = await this.oracleService.userInConfirm(user, dto)
            } else if (dto.type.valueOf() === OracleActionTypeDto.EXPORT) {
                success = await this.oracleService.userExportConfirm(user, dto)
            }
            return success
        }
    */
    /*
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
        const user = await this.userService.findOne({ uuid: dto.uuid })
        if (!user) {
            throw new UnprocessableEntityException('User not found')
        }
        let res
        if (dto.type.valueOf() === OracleActionTypeDto.ENRAPTURE.valueOf()) {
            res = await this.oracleService.userInRequest(user, dto.data as InDto)
        } else if (dto.type.valueOf() === OracleActionTypeDto.IMPORT.valueOf()) {
            res = await this.oracleService.userInRequest(user, dto.data as InDto)
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
    }*/

    @Put('communism')
    @HttpCode(200)
    @ApiOperation({ summary: 'Server wide gganbu snapshot resource distribution' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async communism(
        @User() caller: UserEntity,
        @Body() dto: CommunismDto
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        await this.gameApiService.communism(dto)
        return true
    }

    @Put('bank')
    @HttpCode(200)
    @ApiOperation({ summary: 'Processes snapshot items and banks them into the user inventory.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async bank(
        @User() caller: UserEntity,
        @Body() dto: BankDto
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const res = await this.gameApiService.bank(dto)
        return res
    }

    @Put('player/:uuid/blacklist')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets blacklist status of a user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async blacklist(
        @User() caller: UserEntity,
        @Param('uuid') uuid: string,
        @Body() dto: BlacklistDto
    ): Promise<boolean> {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const res = await this.adminApiService.blacklist({ uuid }, dto.blacklist)
        return res
    }

    @Get('gametypes')
    @HttpCode(200)
    @ApiOperation({ summary: 'fetches game types' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async gameTypes(
        @User() caller: UserEntity,
    ) {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const entities = await this.gameTypeService.find({})
        return (entities ?? [])
    }

    @Get('games')
    @HttpCode(200)
    @ApiOperation({ summary: 'Upsers a game entry' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async setGame(
        @User() caller: UserEntity,
    ) {
        if (caller.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const entities = await this.gameService.find({})
        return (entities ?? [])
    }
}
