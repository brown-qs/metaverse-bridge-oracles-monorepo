import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    HttpCode,
    Inject,
    UnprocessableEntityException,
    Param,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SharedSecretGuard } from '../authapi/secret.guard';
import { MoonsamaApiService } from './exoconfig.service';
import { ProcessedStaticTokenData, StaticTokenData } from './exoconfig.types';
import { ConfigDto } from './dtos/config.dto'

@ApiTags('moonsama')
@Controller('moonsama')
export class MoonsamaAPIController {

    private readonly context: string;

    constructor(
        private readonly moonsamaApiService: MoonsamaApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = MoonsamaAPIController.name;
    }

    @Post('configs')
    @HttpCode(200)
    @ApiOperation({ summary: 'Add config' })
    @ApiBearerAuth()
    @UseGuards(SharedSecretGuard)
    async addConfig(
        @Body() config: ConfigDto,
    ): Promise<ConfigDto> {
        const data = await this.moonsamaApiService.addConfig(config)
        return data
    }
    
    @Get('configs/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get config' })
    @ApiBearerAuth()
    @UseGuards(SharedSecretGuard)
    async getConfigByID(
        @Param('id') id: string,
    ): Promise<ConfigDto> {
        const data = await this.moonsamaApiService.findOne({ id: id })
        return data
    }

    @Get('configs')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all config' })
    @ApiBearerAuth()
    @UseGuards(SharedSecretGuard)
    async getConfigAll(
    ) {
        const data = await this.moonsamaApiService.find({})
        return data
    }

    @Put('configs/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Update config' })
    @ApiBearerAuth()
    @UseGuards(SharedSecretGuard)
    async updateConfig(
        @Param('id') id: string,
        @Body() config: ConfigDto,
    ): Promise<boolean> {
        const configData = await this.moonsamaApiService.findOne({id: id})
        if (!configData) {
            throw new UnprocessableEntityException('Config was not found')
        }
        const success = await this.moonsamaApiService.updateConfig(configData, config)
        return success
    }

}
