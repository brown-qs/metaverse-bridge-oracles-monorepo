import {
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SharedSecretGuard } from '../authapi/secret.guard';
import { CollectionQueryDto, NftsQueryDto } from './dtos/nft.dto';
import { NftApiService } from './nftapi.service';
import { ProcessedStaticTokenData, StaticTokenData } from './nftapi.types';

@ApiTags('nft')
@Controller('nft')
export class NftApiController {

    private readonly context: string;

    constructor(
        private readonly nftService: NftApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = NftApiController.name;
    }

    @Get('collection-assets')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches collection assets by IDs' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getNFTs(
        @Query() dto: NftsQueryDto,
    ): Promise<(StaticTokenData | ProcessedStaticTokenData)[]> {
        const data = await this.nftService.getNFTs(dto)
        return data
    }

    @Get('collection')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches all collection assets paginated' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getNFTCollection(
        @Query() dto: CollectionQueryDto
    ): Promise<(StaticTokenData | ProcessedStaticTokenData)[]> {
        const data = await this.nftService.getNFTCollection(dto);
        return data
    }
}
