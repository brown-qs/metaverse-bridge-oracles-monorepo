import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProfileDto } from './dtos/profile.dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from '../asset/asset.service';
import { UserEntity } from '../user/user/user.entity';
import { RecognizedAssetType, PlayEligibilityReason } from '../config/constants';
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
import { formatEther } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

@Injectable()
export class ProfileApiService {

    private readonly context: string;
    private readonly defaultChainId: number;

    constructor(
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

    async userAssets(user: UserEntity) {
        let userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false } })
        return userAssets
    }

    async getPlayerItems(user: UserEntity): Promise<ThingsDto> {
        const snapshots = await this.inventoryService.findMany({ relations: ['material', 'owner'], where: { owner: { uuid: user.uuid } } })

        const resources: AssetDto[] = snapshots.map(snapshot => {
            return {
                amount: snapshot.amount,
                assetAddress: snapshot.material.assetAddress,
                assetType: snapshot.material.assetType,
                assetId: snapshot.material.assetId,
                name: snapshot.material.name,
                exportable: false,
                summonable: true,
                recognizedAssetType: '',
                enraptured: false,
                exportChainId: 1285, // resources are multi chain
                exportAddress: undefined,
            }
        })

        const userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false }, relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })
        const userSkins = await this.skinService.findMany({ where: { owner: user.uuid }, relations: ['texture'] })

        const importableAssets = await this.getRecognizedAssets(BridgeAssetType.IMPORTED)
        const enrapturableAssets = await this.getRecognizedAssets(BridgeAssetType.ENRAPTURED)


        const assets: AssetDto[] = []

        for (let i = 0; i < userAssets.length; i++) {
            const asset = userAssets[i]

            const assetAddress = asset.collectionFragment.collection.assetAddress.toLowerCase()
            const recongizedEnraptureAsset = findRecognizedAsset(enrapturableAssets, { assetAddress, assetId: asset.assetId })

            if (!!recongizedEnraptureAsset && recongizedEnraptureAsset.recognizedAssetType.valueOf() !== RecognizedAssetType.RESOURCE.valueOf()) {
                assets.push({
                    amount: asset.amount,
                    assetAddress,
                    assetType: asset.collectionFragment.collection.assetType,
                    assetId: asset.assetId,
                    name: recongizedEnraptureAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false,
                    recognizedAssetType: recongizedEnraptureAsset.recognizedAssetType.valueOf(),
                    enraptured: asset.enraptured,
                    exportChainId: asset.collectionFragment.collection.chainId,
                    exportAddress: asset.assetOwner?.toLowerCase(),
                })
                continue
            }

            const recongizedImportAsset = findRecognizedAsset(importableAssets, { assetAddress, assetId: asset.assetId })

            if (!!recongizedImportAsset) {
                assets.push({
                    amount: asset.amount,
                    assetAddress: asset.collectionFragment.collection.assetAddress.toLowerCase(),
                    assetType: asset.collectionFragment.collection.assetType,
                    assetId: asset.assetId,
                    name: recongizedImportAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false,
                    recognizedAssetType: recongizedImportAsset.recognizedAssetType.valueOf(),
                    enraptured: asset.enraptured,
                    exportChainId: asset.collectionFragment.collection.chainId,
                    exportAddress: asset.assetOwner?.toLowerCase(),
                })
                continue
            }
        }

        const textures: TextureDto[] = userSkins.map(skin => {
            return {
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


        // TODO fixme
        // James TODO: multiple minecraft accounts can be merged in, find one will hide further merges
        const bait = await this.resourceInventoryService.findOne({ owner: user }, { relations: ['owner', 'offset'] })
        if (!!bait) {
            const baitAsset = userAssets.find(x => x.assetId === bait.assetId && x.collectionFragment.recognizedAssetType.valueOf() === RecognizedAssetType.RESOURCE.valueOf())

            if (!!baitAsset) {
                assets.push(
                    {
                        amount: formatEther(BigNumber.from(bait.amount).sub(bait.offset?.amount ?? '0')),
                        assetAddress: baitAsset.collectionFragment.collection.assetAddress.toLowerCase(),
                        assetType: baitAsset.collectionFragment.collection.assetType,
                        assetId: baitAsset.assetId,
                        name: baitAsset.collectionFragment.name,
                        exportable: !baitAsset.enraptured,
                        hash: baitAsset.hash,
                        summonable: false,
                        recognizedAssetType: baitAsset.recognizedAssetType.valueOf(),
                        enraptured: baitAsset.enraptured,
                        exportChainId: baitAsset.collectionFragment.collection.chainId,
                        exportAddress: baitAsset.assetOwner?.toLowerCase(),
                    }
                )
            }
        }

        return {
            resources,
            assets,
            textures
        }
    }

    async userProfile(user: UserEntity): Promise<ProfileDto> {
        let allowedToPlayReason: PlayEligibilityReason = PlayEligibilityReason.NONE;
        if (user.allowedToPlay) {
            const userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false } })
            if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.MOONSAMA)) allowedToPlayReason = PlayEligibilityReason.MOONSAMA;
            else if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.TICKET)) allowedToPlayReason = PlayEligibilityReason.TICKET;
            else if (userAssets.find(asset => asset.recognizedAssetType == RecognizedAssetType.TEMPORARY_TICKET)) allowedToPlayReason = PlayEligibilityReason.TEMPORARY_TICKET;
        }
        return {
            uuid: user.uuid,
            minecraftUuid: user.minecraftUuid,
            email: user.email,
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

        return true
    }

}
