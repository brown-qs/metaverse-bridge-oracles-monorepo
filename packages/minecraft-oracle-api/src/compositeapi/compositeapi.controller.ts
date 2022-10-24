import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from '../utils/decorators';
import { CompositeApiService } from './compositeapi.service';
import { SaveCompositeConfigDto } from './dtos/save.dto';
import { UserEntity } from '../user/user/user.entity';
import { CompositeMetadataType } from '../compositeasset/types';
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { CompositeConfigDto } from './dtos/index.dto';

@ApiTags('composite')
@Controller('composite')
export class CompositeApiController {

    private readonly context: string;

    constructor(
        private readonly compositeApiService: CompositeApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = CompositeApiController.name;
    }

    @Put('save')
    @HttpCode(200)
    @ApiOperation({ summary: 'Saves a composite config' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async saveCompositeConfig(
        @User() user: UserEntity,
        @Body() dto: SaveCompositeConfigDto
    ): Promise<CompositeMetadataType> {
        const data = await this.compositeApiService.saveCompositeConfig(dto, user)
        return data
    }

    @Get('metadata/:chainId/:assetAddress/:assetId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches composite URI of a Moonsama 2.0 token' })
    async getCompositeMetadata(
        @Param('chainId') chainId: string,
        @Param('assetAddress') assetAddress: string,
        @Param('assetId') assetId: string
    ): Promise<CompositeMetadataType> {
        const data = await this.compositeApiService.getCompositeMetadata(chainId, assetAddress, assetId)
        return data
    }

    @Get('config/:chainId/:assetAddress')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches composite URI of a Moonsama 2.0 token' })
    async getConfig(
        @Param('chainId') chainId: string,
        @Param('assetAddress') assetAddress: string,
    ): Promise<CompositeConfigDto> {
        if (typeof chainId !== 'string') {
            throw new BadRequestException("chainId must be a string!")
        }
        if (typeof assetAddress !== 'string') {
            throw new BadRequestException("assetAddress must be a string!")
        }
        return await this.compositeApiService.getConfig(parseInt(chainId), assetAddress)
    }
}
