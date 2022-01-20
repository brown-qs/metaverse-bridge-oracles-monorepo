

import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProfileDto } from './dtos/profile.dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from '../asset/asset.service';
import { UserEntity } from '../user/user.entity';
import { RecognizedAsset, RecognizedAssetType } from '../config/constants';
import { ProviderToken } from '../provider/token';
import { AssetDto, TextureDto, ThingsDto } from './dtos/things.dto';
import { GameService } from '../game/game.service';
import { InventoryService } from '../playerinventory/inventory.service';
import { UserService } from '../user/user.service';
import { SkinselectDto } from './dtos/skinselect.dto';
import { SkinService } from '../skin/skin.service';
import { findRecognizedAsset } from '../utils';

@Injectable()
export class ProfileApiService {

    private readonly context: string;

    constructor(
        private readonly inventoryService: InventoryService,
        private readonly assetService: AssetService,
        private readonly skinService: SkinService,
        private readonly userService: UserService,
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
                summonable: true
            }
        })

        const userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false } })
        const userSkins = await this.skinService.findMany({ where: { owner: user.uuid }, relations: ['texture'] })

        //console.log(userSkins)

        const assets: AssetDto[] = []

        userAssets.map(asset => {
            const recongizedEnraptureAsset = this.enrapturableAssets.find(x => x.address.toLowerCase() === asset.assetAddress.toLowerCase())

            if (!!recongizedEnraptureAsset && recongizedEnraptureAsset.type.valueOf() === RecognizedAssetType.MOONSAMA.valueOf()) {
                assets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedEnraptureAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false
                })
                return
            }

            if (!!recongizedEnraptureAsset && recongizedEnraptureAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && asset.assetId === recongizedEnraptureAsset.id) {
                assets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedEnraptureAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false
                })
                return
            }

            const recongizedImportAsset = findRecognizedAsset(this.importableAssets, asset)

            if (!!recongizedImportAsset) {
                assets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedImportAsset.name,
                    exportable: !asset.enraptured,
                    hash: asset.hash,
                    summonable: false
                })
                return
            }
        })

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

    public userProfile(user: UserEntity): ProfileDto {
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
            blacklisted: user.blacklisted
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
