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
import { SharedSecretGuard } from '../auth/secret.guard';
import { NftService } from './nft.service';
import { ProcessedStaticTokenData, StaticTokenData } from './nft.types';

@ApiTags('game')
@Controller('game')
export class NftController {

    private readonly context: string;

    constructor(
        private readonly nftService: NftService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = NftController.name;
    }

    @Get('nft/:chainId/:tokenType/:address/:tokenId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches NFT' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async profile(
        @Param('chainId') chainId: string,
        @Param('tokenType') tokenType: string,
        @Param('address') address: string,
        @Param('tokenId') tokenId: string,
    ): Promise<StaticTokenData | ProcessedStaticTokenData> {
        const data = await this.nftService.getNFT(chainId, tokenType, address, tokenId)
        return data
    }
}
