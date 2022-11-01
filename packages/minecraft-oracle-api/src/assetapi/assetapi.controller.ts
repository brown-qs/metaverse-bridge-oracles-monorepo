import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    Query,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from '../user/user/user.service';
import { SharedSecretGuard } from '../authapi/secret.guard';
import { AssetEntity } from '../asset/asset.entity';
import { UserAssetFingerprint, UserAssetFingerprintsResult, UsersAssetFingerprintQuery } from './dtos/fingerprint.dto';
import { ResourceInventoryQueryResult, SetResourceInventoryItems } from './dtos/resourceinventory.dto';
import { SetResourceInventoryOffsetItems } from './dtos/resourceinventoryoffset.dto';
import { FungibleBalanceEntryDto, UsersFungibleBalancesQueryDto, UsersFungibleBalancesResultDto } from './dtos/fungiblebalances.dto';
import { AllUserAssetsQueryDto, AllUserAssetsResultDto } from './dtos/alluserassets.dto';
import { AllAssetsQueryDto, AllAssetsResultDto } from './dtos/allassets.dto';
import { AssetApiService } from './assetapi.service';
import { UserUpdatesDto } from './dtos/userupdates.dto';
import { UserDataDto } from './dtos/userdata.dto';
import { ProfileApiService } from '../profileapi/profileapi.service';
import { GameTypeService } from '../gametype/gametype.service';
import { GameApiService } from '../gameapi/gameapi.service';
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { CollectionFragmentService } from '../collectionfragment/collectionfragment.service';
import { Not, IsNull } from 'typeorm';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { CollectionService } from '../collection/collection.service';
import { RecognizedAssetsDto } from './dtos/recognized-assets.dto';
import axios from "axios"

@ApiTags('asset')
@Controller('asset')
export class AssetApiController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly assetApiService: AssetApiService,
        private readonly profileService: ProfileApiService,
        private readonly gameApiService: GameApiService,
        private readonly collectionService: CollectionService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = AssetApiController.name;
    }

    @Get('players/updates')
    @HttpCode(200)
    @ApiOkResponse({
        description: 'Array of user uuids',
        type: String,
        isArray: true,
    })
    @ApiOperation({ summary: `Fetches an array of user uuids whose profiles, assets, skins, or resources have changed since the provided timestamp` })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async userUpdates(@Query() dto: UserUpdatesDto) {
        let offset: number = 0
        let take: number | undefined = undefined

        if (dto.hasOwnProperty("offset")) {
            offset = Math.abs(parseInt(dto.offset))
        }

        if (dto.hasOwnProperty("take")) {
            take = Math.abs(parseInt(dto.take))
        }

        return await this.userService.userUpdates(offset, dto.t, take)
    }

    @Get('player/:uuid/data')
    @HttpCode(200)
    @ApiOkResponse({
        description: 'Full user data',
        type: UserDataDto,
    })
    @ApiOperation({ summary: `Fetches a user's assets, profile, skins, resources, and resource balances` })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async userData(@Param('uuid') uuid: string): Promise<UserDataDto> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        if (!user) {
            throw new UnprocessableEntityException("User not found")
        }

        const results = await Promise.all([
            this.profileService.userProfile(user),
            this.gameApiService.getUserSkins(user),
            this.assetApiService.userAssets(user),
            this.assetApiService.getFungibleBalancesForPlayer(user)
        ])

        const userData: UserDataDto = {
            uuid: user.uuid,
            minecraftUuid: user.minecraftUuid,
            profile: results[0],
            skins: results[1],
            assets: results[2],
            balances: results[3]
        }
        return userData
    }

    @Get('player/:uuid/assets')
    @HttpCode(200)
    @ApiOperation({ summary: `Fetches a user's assets` })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async userAssets(@Param('uuid') uuid: string): Promise<AssetEntity[]> {
        const user = await this.userService.findByUuid(uuid)
        const res = await this.assetApiService.userAssets(user)
        return res
    }

    @Get('players/assets')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches all active assets grouped by users.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async allUserAssets(@Query() dto: AllUserAssetsQueryDto): Promise<AllUserAssetsResultDto> {
        const res = await this.assetApiService.allUserAssets(dto)
        return res
    }

    @Get('assets')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches all active assets.' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async assets(@Query() dto: AllAssetsQueryDto): Promise<AllAssetsResultDto> {
        const res = await this.assetApiService.allAssets(dto)
        return res
    }


    @Get('fingerprint/assets/players')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets the fingerprints of all the players assets' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getAssetFingerprints(
        @Query() dto: UsersAssetFingerprintQuery
    ): Promise<UserAssetFingerprintsResult> {
        const result = await this.assetApiService.getAssetFingerprints(dto)
        return result
    }

    @Get('fingerprint/assets/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets the fingerprints of all the players assets' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getAssetFingerprintForPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<UserAssetFingerprint> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.assetApiService.getAssetFingerprintForPlayer(user)
        return result
    }

    @Get('resourceinventory/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player resource inventory' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getResourceInventoryPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<ResourceInventoryQueryResult[]> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.assetApiService.getResourceInventoryPlayer(user)
        return result
    }

    @Put('resourceinventory/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Create player resource inventory' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setResourceInventoryPlayer(
        @Param('trimmedUuid') uuid: string,
        @Body() dto: SetResourceInventoryItems
    ): Promise<boolean> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.assetApiService.setResourceInventoryPlayer(user, dto)
        return result
    }

    @Get('resourceinventory/offset/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player resource inventory offset' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getResourceInventoryOffsetPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<ResourceInventoryQueryResult[]> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.assetApiService.getResourceInventoryOffsetPlayer(user)
        return result
    }

    @Put('resourceinventory/offset/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Create player resource inventory offset' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async setResourceInventoryOffsetPlayer(
        @Param('trimmedUuid') uuid: string,
        @Body() dto: SetResourceInventoryOffsetItems
    ): Promise<boolean> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.assetApiService.setResourceInventoryPlayer(user, dto)
        return result
    }

    @Get('fungible/balances/player/:trimmedUuid')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player enraptured/imported fungible balances with offsets applied' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getFungibleBalancesForPlayer(
        @Param('trimmedUuid') uuid: string
    ): Promise<FungibleBalanceEntryDto> {
        const user = await this.userService.findOne({ uuid }, { relations: ['assets'] })
        const result = await this.assetApiService.getFungibleBalancesForPlayer(user)
        return result
    }

    @Get('fungible/balances/players')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets players enraptured/imported fungible balances with offsets applied' })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async getPlayersFungibleBalances(
        @Query() dto: UsersFungibleBalancesQueryDto
    ): Promise<UsersFungibleBalancesResultDto> {
        const result = await this.assetApiService.getPlayersFungibleBalances(dto)
        return result
    }


    @Get('recognized-assets')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets recognized assets' })
    @UseGuards(JwtAuthGuard)
    async getRecognizedAssets(): Promise<RecognizedAssetsDto[]> {
        const data = await this.collectionService.findMany({ where: { chainId: Not(IsNull()) }, relations: ["collectionFragments", "chain"] });
        return data.map(d => this.assetApiService.collectionEntityToDto(d))
    }

    /*
    @Get('exos/:address')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets exos' })
    @UseGuards(JwtAuthGuard)
    async getExos(@Param('address') address: string): Promise<StandardizedOnChainToken[]> {
        if (typeof address !== "string") {
            throw new BadRequestException("No way jose.")
        }
        console.log(`https://api.opensea.io/api/v1/assets?${address.toLowerCase()}&collection_slug=exosama-expect-chaos&limit=30`)
        const res = await axios.get(`https://api.opensea.io/api/v1/assets?owner=${address.toLowerCase()}&collection_slug=exosama-expect-chaos&limit=30`, { headers: { "X-API-Key": "5f63d943b9a648ba904dd9cc81a795c8" } });
        const exos: StandardizedOnChainToken[] = []
        for (const asset of res.data.assets) {
            const exo: StandardizedOnChainToken = {
                id: String(asset.id),
                assetAddress: asset.asset_contract.address.toLowerCase(),
                numericId: parseInt(asset.token_id),
                metadata: {
                    name: asset.name,
                    image: asset.image_thumbnail_url
                }
            }
            exos.push(exo)
        }
        return exos
    }*/
}

/*
//used for getExos
export type GetMarketplaceOnChainTokensQuery = { __typename?: 'Query', erc1155TokenOwners: Array<{ __typename?: 'ERC1155TokenOwner', id: string, balance: any, token: { __typename?: 'ERC1155Token', numericId: any, id: string, metadata?: { __typename?: 'Metadata', image?: string | null, layers?: Array<string> | null, name?: string | null, type?: string | null, description?: string | null, composite?: boolean | null, attributes?: Array<{ __typename?: 'Attribute', displayType?: string | null, traitType: string, value: string }> | null } | null, contract: { __typename?: 'ERC1155Contract', address?: string | null } } }>, erc721Tokens: Array<{ __typename?: 'ERC721Token', numericId: any, id: string, metadata?: { __typename?: 'Metadata', image?: string | null, layers?: Array<string> | null, name?: string | null, type?: string | null, description?: string | null, composite?: boolean | null, attributes?: Array<{ __typename?: 'Attribute', displayType?: string | null, traitType: string, value: string }> | null } | null, contract: { __typename?: 'ERC721Contract', address?: string | null } }> };
type ERC721MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc721Tokens"][0]

export type StandardizedOnChainToken = {
    id: string,
    assetAddress: string,
    numericId: number,
    balance?: string,
    metadata?: NonNullable<ERC721MarketplaceOnChainTokenType["metadata"]>,
}
*/