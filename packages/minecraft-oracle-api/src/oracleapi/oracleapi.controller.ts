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
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';
import { User } from '../utils/decorators';
import { CallparamDto } from './dtos/callparams.dto';
import { OracleApiService } from './oracleapi.service';
import { ImportDto } from './dtos/import.dto';
import { ConfirmDto } from './dtos/confirm.dto';
import { ExportDto } from './dtos/export.dto';
import { SummonDto } from './dtos/summon.dto';

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

    @Put('import')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an import' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async import(
        @User() user: MinecraftUserEntity,
        @Body() data: ImportDto
    ): Promise<CallparamDto> {
        const params = await this.oracleApiService.userInRequest(user, data, false)

        return {
            hash: params[0],
            data: params[1],
            signature: params[2],
            confirmed: params[3]
        }
    }

    @Put('import/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an import request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async importConfirm(
        @User() user: MinecraftUserEntity,
        @Body() data: ConfirmDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.userImportConfirm(user, data)
        return success
    }

    @Put('enrapture')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an enrapture' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async enrapture(
        @User() user: MinecraftUserEntity,
        @Body() data: ImportDto
    ): Promise<CallparamDto> {
        const params = await this.oracleApiService.userInRequest(user, data, true)
        return {
            hash: params[0],
            data: params[1],
            signature: params[2],
            confirmed: params[3]
        }
    }

    @Put('enrapture/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an enrapture request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async enraptureConfirm(
        @User() user: MinecraftUserEntity,
        @Body() data: ConfirmDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.userEnraptureConfirm(user, data)
        return success
    }

    @Put('export')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an export' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async export(
        @User() user: MinecraftUserEntity,
        @Body() data: ExportDto
    ): Promise<CallparamDto> {
        const params = await this.oracleApiService.userOutRequest(user, data)
        return {
            hash: params[0],
            data: params[1],
            signature: params[2],
            confirmed: params[3]
        }
    }

    @Put('export/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirms an export request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async exportConfirm(
        @User() user: MinecraftUserEntity,
        @Body() data: ConfirmDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.userExportConfirm(user, data)
        return success
    }

    @Put('summon')
    @HttpCode(200)
    @ApiOperation({ summary: 'Summons in game resources for the user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async summon(
        @User() user: MinecraftUserEntity,
        @Body() data: SummonDto
    ): Promise<boolean> {
        const success = await this.oracleApiService.userSummonRequest(user, data)
        return success
    }
}
