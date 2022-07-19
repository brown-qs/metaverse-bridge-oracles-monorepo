import {
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('asset')
@Controller('asset')
export class AssetApiController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly assetApiService: AssetApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = AssetApiController.name;
    }

    @Get('players/data')
    @HttpCode(200)
    @ApiOperation({ summary: `Fetches an array of user uuids whose profiles, assets, skins, or resources have changed since the provided timestamp` })
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    async userUpdates(@Query() dto: UserUpdatesDto) {
        let offset: number = 0
        let limit: number | undefined = undefined

        if (dto.hasOwnProperty("offset")) {
            offset = Math.abs(parseInt(dto.offset))
        }

        if (dto.hasOwnProperty("limit")) {
            limit = Math.abs(parseInt(dto.limit))
        }

        return await this.userService.userUpdates(offset, dto.t, limit)
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
}
