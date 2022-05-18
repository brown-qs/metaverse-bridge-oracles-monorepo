import {
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
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { CompositeApiService } from './compositeapi.service';
import { SaveCompositeConfigDto } from './dtos/save.dto';

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
    @ApiOperation({ summary: 'Confirms an export request, sealing the deal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async saveCompositeConfig(
        @Body() dto: SaveCompositeConfigDto
    ): Promise<boolean> {
        const success = await this.compositeApiService.saveCompositeConfig(dto)
        return success
    }

    @Get('metadata/:chainId/:assetAddress/:assetId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets the composite metadata of the asset, if any, returns original otherwise.' })
    async getCompositeMetadata(
        @Param('chainId') chainId: string,
        @Param('assetAddress') assetAddress: string,
        @Param('assetId') assetId: string
    ): Promise<unknown> {
        const success = await this.compositeApiService.getCompositeMetadata(chainId, assetAddress, assetId)
        return success
    }
}
