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
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/utils/decorators';
import { CallParamsDto } from './dtos/callparams.dto';
import { OracleService } from './oracle.service';

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

    @Get('export')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an export' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async export(@User() user: UserEntity): Promise<CallParamsDto> {
        const params = await this.oracleService.userExport(user)
        return {
            params: [
                {
                    data: params[0],
                    signature: params[1]
                }
            ]
        }
    }

    @Get('import')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an import' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async import(@User() user: UserEntity): Promise<CallParamsDto> {
        const params = await this.oracleService.userImport(user)
        return {
            params: [
                {
                    data: params[0],
                    signature: params[1]
                }
            ]
        }
    }

    @Get('enrapture')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for an enrapture' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async enrapture(@User() user: UserEntity): Promise<CallParamsDto> {
        const params = await this.oracleService.userEnrapture(user)
        return {
            params: [
                {
                    data: params[0],
                    signature: params[1]
                }
            ]
        }
    }

    @Get('summon')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches oracle data for a summon' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async summon(@User() user: UserEntity): Promise<CallParamsDto> {
        const params = await this.oracleService.userSummon(user)
        return {
            params: [
                {
                    data: params[0],
                    signature: params[1]
                }
            ]
        }
    }
}
