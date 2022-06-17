import {
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SharedSecretGuard } from '../authapi/secret.guard';
import { NftApiService } from './nftapi.service';
import { ProcessedStaticTokenData, StaticTokenData } from './nftapi.types';

@ApiTags('game')
@Controller('game')
export class NftApiController {

    private readonly context: string;

    constructor(
        private readonly nftService: NftApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = NftApiController.name;
    }

    @Get('nft/:chainId/:tokenType/:address/:tokenId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches NFT' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getNFT(
        @Param('chainId') chainId: string,
        @Param('tokenType') tokenType: string,
        @Param('address') address: string,
        @Param('tokenId') tokenId: string,
    ): Promise<StaticTokenData | ProcessedStaticTokenData> {
        const data = await this.nftService.getNFT(chainId, tokenType, address, tokenId)
        return data
    }

    @Get('nft/:chainId/:tokenType/:address')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches NFT Collection' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getNFTCollection(
        @Param('chainId') chainId: string,
        @Param('tokenType') tokenType: string,
        @Param('address') address: string,
    ): Promise<StaticTokenData[] | ProcessedStaticTokenData[]> {
        const data = await this.nftService.getNFTCollection(chainId, tokenType, address);
        return data
    }
}
