import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProfileDto } from './dtos/profile.dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from '../asset/asset.service';
import { UserEntity } from '../user/user/user.entity';
import { RecognizedAssetType, PlayEligibilityReason, MultiverseVersion } from '../config/constants';
import { ProviderToken } from '../provider/token';
import { AssetDto, TextureDto, ThingsDto } from './dtos/things.dto';
import { InventoryService } from '../playerinventory/inventory.service';
import { UserService } from '../user/user/user.service';
import { SkinselectDto } from './dtos/skinselect.dto';
import { SkinService } from '../skin/skin.service';
import { findRecognizedAsset } from '../utils';
import { TypeContractsCallbackProvider, TypeRecognizedAssetsProvider } from '../provider';
import { ConfigService } from '@nestjs/config';
import { BridgeAssetType } from '../common/enums/AssetType';
import { ResourceInventoryService } from '../resourceinventory/resourceinventory.service';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { EventBus } from '@nestjs/cqrs';
import { SkinSelectedEvent } from '../cqrs/events/skin-selected.event';

@Injectable()
export class ProfileApiService {

    private readonly context: string;
    private readonly defaultChainId: number;

    constructor(
        private readonly eventBus: EventBus,
        private readonly inventoryService: InventoryService,
        private readonly assetService: AssetService,
        private readonly skinService: SkinService,
        private readonly userService: UserService,
        private readonly resourceInventoryService: ResourceInventoryService,
        private configService: ConfigService,
        @Inject(ProviderToken.CONTRACT_CHAIN_CALLBACK) private getContract: TypeContractsCallbackProvider,
        @Inject(ProviderToken.RECOGNIZED_ASSETS_CALLBACK) private getRecognizedAssets: TypeRecognizedAssetsProvider,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = ProfileApiService.name
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')
    }

    async getSkins(user: UserEntity): Promise<TextureDto[]> {
        const userSkins = await this.skinService.findMany({ where: { owner: user.uuid }, relations: ['texture'] })
        const textures: TextureDto[] = userSkins.map(skin => {
            return {
                id: skin.id,
                assetAddress: skin.texture.assetAddress,
                assetId: skin.texture.assetId,
                assetType: skin.texture.assetType,
                equipped: skin.equipped,
                selectable: true,
                textureData: skin.texture.textureData,
                textureSignature: skin.texture.textureSignature,
                name: skin.texture.name
            }
        })
        return textures
    }


    async getInGameItems(user: UserEntity): Promise<AssetDto[]> {
        const userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false }, relations: ['collectionFragment', 'collectionFragment.collection', 'resourceInventory', 'resourceInventory.offsets'], loadEagerRelations: true })
        const assets: AssetDto[] = []
        for (const asset of userAssets) {
            const assetAddress = asset.collectionFragment.collection.assetAddress.toLowerCase()
            const treatAsFungible = asset.collectionFragment.treatAsFungible
            if (!asset.collectionFragment || (!asset.collectionFragment.importable && !asset.collectionFragment.enrapturable)) {
                continue
            }
            //combine fungibles
            if (treatAsFungible) {
                const existingEntry = assets.find(a => a.assetAddress === assetAddress && a.assetId === asset.assetId)
                let balance = BigNumber.from("0")
                if (!!asset.resourceInventory) {
                    balance = BigNumber.from(asset?.resourceInventory?.amount ?? "0")


                    if (!!asset?.resourceInventory?.offsets?.[0]) {
                        let totalOffsets = BigNumber.from("0")
                        for (const offset of asset?.resourceInventory?.offsets) {
                            totalOffsets = totalOffsets.add(offset.amount ?? '0')
                        }
                        balance = balance.sub(totalOffsets)
                    }

                }
                asset.amount = formatUnits(balance, asset?.collectionFragment?.decimals ?? 18)

                if (!!existingEntry) {

                    continue
                }
            }

            assets.push({
                amount: asset.amount,
                assetAddress,
                assetType: asset.collectionFragment.collection.assetType,
                assetId: asset.assetId,
                name: asset.collectionFragment.name,
                exportable: (!asset.enraptured && asset.collectionFragment.exportable),
                treatAsFungible: asset.collectionFragment.treatAsFungible,
                hash: asset.hash,
                summonable: false,
                recognizedAssetType: asset.collectionFragment.recognizedAssetType,
                enraptured: asset.enraptured,
                gamepass: asset.collectionFragment.gamepass,
                chainId: asset.collectionFragment.collection.chainId,
                exportAddress: asset.assetOwner?.toLowerCase(),
                multiverseVersion: asset.collectionFragment.collection.multiverseVersion
            })
        }
        return assets
    }

    async getInGameResources(user: UserEntity): Promise<AssetDto[]> {
        const inventoryItems = await this.inventoryService.findMany({
            relations: [
                'owner',
                'material',
                'material.collectionFragment',
                'material.collectionFragment.collection',
                'material.collectionFragment.collection.chain'
            ], where: { owner: { uuid: user.uuid } }, loadEagerRelations: true
        })

        const resources: AssetDto[] = inventoryItems.filter(i => !!i?.material?.collectionFragment?.collection?.chainId).map(item => {
            return {
                amount: item.amount,
                assetAddress: item.material.collectionFragment.collection.assetAddress,
                assetType: item.material.collectionFragment.collection.assetType,
                assetId: item.material.assetId,
                name: item.material.name,
                exportable: false,
                treatAsFungible: false,
                summonable: true,
                recognizedAssetType: item.material.collectionFragment.recognizedAssetType,
                enraptured: false,
                gamepass: false,
                chainId: item.material.collectionFragment.collection.chainId,
                exportAddress: undefined,
                multiverseVersion: MultiverseVersion.V2
            }
        })
        return resources
    }

    async userProfile(user: UserEntity): Promise<ProfileDto> {
        let allowedToPlayReason: PlayEligibilityReason = PlayEligibilityReason.NONE;
        if (user.allowedToPlay) {
            const userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false } })
            if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.MOONSAMA)) allowedToPlayReason = PlayEligibilityReason.MOONSAMA;
            else if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.EXOSAMA)) allowedToPlayReason = PlayEligibilityReason.EXOSAMA;
            else if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.GROMLIN)) allowedToPlayReason = PlayEligibilityReason.GROMLIN;
            else if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.TICKET)) allowedToPlayReason = PlayEligibilityReason.TICKET;
            else if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.TEMPORARY_TICKET)) allowedToPlayReason = PlayEligibilityReason.TEMPORARY_TICKET;
        }
        return {
            uuid: user.uuid,
            minecraftUuid: user.minecraftUuid,
            email: user?.email?.email ?? null,
            gamerTag: user.gamerTag,
            hasGame: user.hasGame,
            minecraftUserName: user.minecraftUserName,
            role: user.role,
            allowedToPlay: user.allowedToPlay,
            serverId: user.serverId,
            preferredServer: user.preferredServer,
            numGamePassAsset: user.numGamePassAsset,
            vip: user.vip ?? false,
            blacklisted: user.blacklisted,
            allowedToPlayReason
        }
    }

    public async userThings(user: UserEntity) {
        const userfull = await this.userService.findOne({ uuid: user.uuid }, { relations: ['skins', 'assets'] })
        return {
            assets: userfull.assets ?? [],
            skins: userfull.skins ?? []
        }

    }

    public async skinSelect(user: UserEntity, dto: SkinselectDto): Promise<boolean> {
        const skins = await this.skinService.findMany({ where: { owner: { uuid: user.uuid } }, relations: ['texture'] })

        const selectedIndex = skins.findIndex(skin => {
            return skin.texture.assetAddress.toLowerCase() === dto.assetAddress.toLowerCase() && skin.texture.assetId === dto.assetId && skin.texture.assetType.valueOf() === dto.assetType
        })

        if (selectedIndex < 0) {
            this.logger.error('skinSelect:: skin select request params', null, this.context)
            throw new UnprocessableEntityException('Invalid skin select request params')
        }

        await Promise.all(skins.map(async (skin, i) => {
            if (i === selectedIndex) {
                //console.log('selected')
                await this.skinService.update(skin.id, { equipped: true })
            } else {
                //console.log('not selected', skin.equipped)
                if (skin.equipped) {
                    //console.log('equipped')
                    await this.skinService.update(skin.id, { equipped: false })
                }
            }
        }))
        this.eventBus.publish(new SkinSelectedEvent(user.uuid))
        return true
    }

    public async setGamerTag(user: UserEntity, gamerTag: string) {
        await this.userService.setGamerTag(user.uuid, gamerTag)
    }

}
