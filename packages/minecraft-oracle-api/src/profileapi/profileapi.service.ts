import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProfileDto } from './dtos/profile.dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from '../asset/asset.service';
import { UserEntity } from '../user/user.entity';
import { RecognizedAsset, RecognizedAssetType, PlayEligibilityReason } from '../config/constants';
import { ProviderToken } from '../provider/token';
import { AssetDto, TextureDto, ThingsDto } from './dtos/things.dto';
import { InventoryService } from '../playerinventory/inventory.service';
import { UserService } from '../user/user.service';
import { SkinselectDto } from './dtos/skinselect.dto';
import { SkinService } from '../skin/skin.service';
import { findRecognizedAsset } from '../utils';
import { MetaAsset } from '../../src/oracleapi/oracleapi.types';
import { Contract } from 'ethers';

@Injectable()
export class ProfileApiService {

    private readonly context: string;

    constructor(
        private readonly inventoryService: InventoryService,
        private readonly assetService: AssetService,
        private readonly skinService: SkinService,
        private readonly userService: UserService,
        @Inject(ProviderToken.METAVERSE_CONTRACT) private metaverse: Contract,
        @Inject(ProviderToken.IMPORTABLE_ASSETS) private importableAssets: RecognizedAsset[],
        @Inject(ProviderToken.ENRAPTURABLE_ASSETS) private enrapturableAssets: RecognizedAsset[],
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = ProfileApiService.name
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
                exportChainName: 1285,
                exportAddress: undefined,
            }
        })

        const userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false } })
        const userSkins = await this.skinService.findMany({ where: { owner: user.uuid }, relations: ['texture'] })

        //console.log(userSkins)

        const assets: AssetDto[] = []

        for(let i = 0; i < userAssets.length; i++) {
            const asset = userAssets[i]

            const recongizedEnraptureAsset = findRecognizedAsset(this.enrapturableAssets, asset)

            if (!!recongizedEnraptureAsset) {
                let mAsset: MetaAsset
                try {
                    mAsset = await this.metaverse.getEnrapturedMetaAsset(asset.hash)
                } catch {

                }

                assets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedEnraptureAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false,
                    recognizedAssetType: recongizedEnraptureAsset.type.valueOf(),
                    enraptured: asset.enraptured,
                    exportChainName: asset.chain,
                    exportAddress: mAsset?.owner?.toLowerCase() ?? undefined,
                })
                continue
            }

            const recongizedImportAsset = findRecognizedAsset(this.importableAssets, asset)

            if (!!recongizedImportAsset) {
                let mAsset: MetaAsset
                try {
                    mAsset = await this.metaverse.getImportedMetaAsset(asset.hash)
                } catch {

                }
                assets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedImportAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false,
                    recognizedAssetType: recongizedImportAsset.type.valueOf(),
                    enraptured: asset.enraptured,
                    exportChainName: asset.chain,
                    exportAddress: mAsset?.owner?.toLowerCase() ?? undefined,
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
            hasGame: user.hasGame,
            userName: user.userName,
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
