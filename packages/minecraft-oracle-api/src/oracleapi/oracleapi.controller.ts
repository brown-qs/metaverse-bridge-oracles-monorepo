import {
    Body,
    Controller,
    HttpCode,
    Inject,
    Put,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { UserEntity } from '../user/user/user.entity';
import { User } from '../utils/decorators';
import { CallparamDto } from './dtos/callparams.dto';
import { OracleApiService } from './oracleapi.service';
import { InDto } from './dtos/in.dto';
import { SummonDto } from './dtos/summon.dto';
import { HashAndChainIdDto } from './dtos/hashandchainid.dto';

@ApiTags('oracle')
@Controller('oracle')
export class OracleApiController {

    private readonly context: string;

    constructor(
        private readonly oracleApiService: OracleApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = OracleApiController.name;
    }

    @Put('in')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an import' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async import(
        @User() user: UserEntity,
        @Body() data: InDto[]
    ): Promise<CallparamDto[]> {
        return await Promise.all(data.map(d => this.oracleApiService.inRequest(d, user)))
    }

    @Put('in/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an import request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async importConfirm(
        @User() user: UserEntity,
        @Body() dto: HashAndChainIdDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.inConfirm(dto.hash, user)
        return success
    }

    @Put('out')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an export' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async export(
        @User() user: UserEntity,
        @Body() data: HashAndChainIdDto[]
    ): Promise<CallparamDto[]> {
        return await Promise.all(data.map(d => this.oracleApiService.outRequest(d.hash, user)))
    }

    @Put('out/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an export request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async exportConfirm(
        @User() user: UserEntity,
        @Body() data: HashAndChainIdDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.outConfirm(data.hash, user)
        return success
    }

    @Put('summon')
    @HttpCode(200)
    @ApiOperation({ summary: 'Summons in game resources for the user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async summon(
        @User() user: UserEntity,
        @Body() data: SummonDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.userSummonRequest(user, data)
        return success
    }
}
