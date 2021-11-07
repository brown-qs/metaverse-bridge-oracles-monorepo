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
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../utils/decorators';
import { CallparamDto, CallParamsDto } from './dtos/callparams.dto';
import { OracleService } from './oracle.service';
import { ImportDto } from './dtos/import.dto';
import { ConfirmDto } from './dtos/confirm.dto';
import { ExportDto } from './dtos/export.dto';
import { SummonDto } from './dtos/summon.dto';

@ApiTags('oracle')
@Controller('oracle')
export class OracleController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly oracleService: OracleService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = OracleController.name;
    }

    @Put('import')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an import' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async import(
        @User() user: UserEntity,
        @Body() data: ImportDto
    ): Promise<CallparamDto> {
        const params = await this.oracleService.userInRequest(user, data, false)

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
        @User() user: UserEntity,
        @Body() data: ConfirmDto
    ): Promise<boolean> {
        const success = await this.oracleService.userImportConfirm(user, data)
        return success
    }

    @Put('enrapture')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an enrapture' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async enrapture(
        @User() user: UserEntity,
        @Body() data: ImportDto
    ): Promise<CallparamDto> {
        const params = await this.oracleService.userInRequest(user, data, true)
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
        @User() user: UserEntity,
        @Body() data: ConfirmDto
    ): Promise<boolean> {
        const success = await this.oracleService.userEnraptureConfirm(user, data)
        return success
    }

    @Put('export')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an export' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async export(
        @User() user: UserEntity,
        @Body() data: ExportDto
    ): Promise<CallparamDto> {
        const params = await this.oracleService.userOutRequest(user, data)
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
        @User() user: UserEntity,
        @Body() data: ConfirmDto
    ): Promise<boolean> {
        const success = await this.oracleService.userExportConfirm(user, data)
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
        const success = await this.oracleService.userSummonRequest(user, data)
        return success
    }
}
