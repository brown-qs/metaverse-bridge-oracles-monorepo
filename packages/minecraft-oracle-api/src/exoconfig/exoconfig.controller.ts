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
import { plainToClass } from "class-transformer";
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SharedSecretGuard } from '../authapi/secret.guard';
import { MoonsamaApiService } from './exoconfig.service';
import { ProcessedStaticTokenData, StaticTokenData } from './exoconfig.types';
import { ConfigDto } from './dtos/config.dto'
import { ConfigEntity } from './config.entity';
import { AttributeDto } from 'src/attribute/dtos/attribute.dto';
import { AttributeService } from 'src/attribute/attribute.service';
import { AttributeEntity } from 'src/attribute/attribute.entity';

@ApiTags('moonsama')
@Controller('moonsama')
export class MoonsamaAPIController {

    private readonly context: string;

    constructor(
        private readonly moonsamaApiService: MoonsamaApiService,
        private readonly attributeService: AttributeService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = MoonsamaAPIController.name;
    }

    @Post('configs')
    @HttpCode(200)
    @ApiOperation({ summary: 'Add config' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    async addConfig(
        @Body() config: ConfigDto,
    ): Promise<ConfigEntity> {
        console.log('config', config)
        const entity = await this.moonsamaApiService.addConfig(config)
        console.log('entity', entity)
        if (entity) {
            config.attributes.forEach((attr) => attr.configId = entity.id);
            console.log('attributes', config.attributes);
            const attributes = await this.attributeService.addAttributes(config.attributes)
            entity.attributes = attributes;
            console.log('attributes-created', attributes);
        }
        return entity;
    }
    
    @Get('configs/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get config' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    async getConfigByID(
        @Param('id') id: string,
    ): Promise<ConfigEntity> {
        const data = await this.moonsamaApiService.findOne({ id: id })
        return data 
    }

    @Get('configs')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all config' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    async getConfigAll(
    ) {
        const data = await this.moonsamaApiService.find({})
        return data
    }

    @Put('configs/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Update config' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
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
