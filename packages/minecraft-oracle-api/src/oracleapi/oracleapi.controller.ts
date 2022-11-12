import {
    BadRequestException,
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
import { SummonDto } from './dtos/summon.dto';
import { HashAndChainIdDto } from './dtos/hashandchainid.dto';
import { InBatchRequestDto, InConfirmRequestDto, InConfirmResponseDto, OutBatchRequestDto, OutConfirmRequestDto, OutConfirmResponseDto, MigrateResponseDto } from './dtos/index.dto';

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



    //enrapture for autoMigrate aka '1 click migrate', user is always null in asset_entity, for one click migrations only 
    //autoMigrate = true, user = null on asset_entity
    @Put('migrate-in')
    @HttpCode(200)
    @ApiOperation({ summary: 'Enrapture assets for auto-migrate' })
    async migrate(
        @Body() data: InBatchRequestDto
    ): Promise<CallparamDto[]> {
        if (data?.requests?.length !== 1) {
            throw new BadRequestException("Only 1 migrate accepted at this time.")
        }
        return await Promise.all(data.requests.map(d => this.oracleApiService.inRequest(d, true)))
    }

    //called after PUT /migrate-in to do summon (will be done by cron job if not called)
    //can be used in the future to summon assets that were enraptured using PUT /in
    @Put('migrate')
    @HttpCode(200)
    @ApiOperation({ summary: 'Summon enraptured assets' })
    async migrateConfirm(
        @Body() dto: InConfirmRequestDto
    ): Promise<MigrateResponseDto> {
        const result = await this.oracleApiService.migrate(dto.hash)

        return result
    }

    @Put('in')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an import' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async inRequest(
        @User() user: UserEntity,
        @Body() data: InBatchRequestDto
    ): Promise<CallparamDto[]> {
        return await Promise.all(data.requests.map(d => this.oracleApiService.inRequest(d, false, user)))
    }

    @Put('in/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an import request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async inConfirm(
        @User() user: UserEntity,
        @Body() dto: InConfirmRequestDto
    ): Promise<InConfirmResponseDto> {
        const success = await this.oracleApiService.inConfirm(dto.hash, user)
        return { confirmed: success }
    }

    @Put('out')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an export' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async outRequest(
        @User() user: UserEntity,
        @Body() data: OutBatchRequestDto
    ): Promise<CallparamDto[]> {
        return await Promise.all(data.requests.map(d => this.oracleApiService.outRequest(d.hash, user)))
    }

    @Put('out/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an export request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async outConfirm(
        @User() user: UserEntity,
        @Body() data: OutConfirmRequestDto
    ): Promise<OutConfirmResponseDto> {
        const success = await this.oracleApiService.outConfirm(data.hash, user)
        return { confirmed: success }
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
