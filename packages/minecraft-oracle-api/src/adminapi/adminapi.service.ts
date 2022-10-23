import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { MaterialEntity } from '../material/material.entity';
import { TextureEntity } from '../texture/texture.entity';
import { SecretService } from '../secret/secret.service';
import { EventBus } from '@nestjs/cqrs';
import { UserProfileUpdatedEvent } from '../cqrs/events/user-profile-updated.event';
import { AssetService } from '../asset/asset.service';
import { NftApiService } from '../nftapi/nftapi.service';
import { InRequestDto } from '../oracleapi/dtos/index.dto';
import { calculateMetaAssetHash, standardizeValidateAssetInParams, utf8ToKeccak } from '../oracleapi/oracleapi.utils';
import { findRecognizedAsset, stringAssetTypeToAssetType } from '../utils';
import { CALLDATA_EXPIRATION_MS, METAVERSE, MultiverseVersion } from '../config/constants';
import { BridgeAssetType } from '../common/enums/AssetType';
import { TypeRecognizedChainAssetsProvider } from '../provider';
import { ProviderToken } from '../provider/token';

@Injectable()
export class AdminApiService {

    private readonly context: string;
    constructor(
        private readonly eventBus: EventBus,
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly materialService: MaterialService,
        private readonly assetService: AssetService,
        private readonly snapshotService: SnapshotService,
        private readonly secretService: SecretService,
        private readonly nftApiService: NftApiService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @Inject(ProviderToken.RECOGNIZED_CHAIN_ASSETS_CALLBACK) private getRecognizedAsset: TypeRecognizedChainAssetsProvider,

    ) {
        this.context = AdminApiService.name
    }

    public async saveMaterials(materials: MaterialEntity[]): Promise<boolean> {

        if (!materials || materials.length == 0) {
            return false
        }

        const materialEntities = await this.materialService.createMultiple(materials)

        if (!materialEntities || materialEntities.length == 0) {
            this.logger.error(`saveMaterials:: error saving material entities`, this.context)
            return false
        }

        return materialEntities.length == materials.length
    }

    public async deleteMaterials(materials: MaterialEntity[]): Promise<boolean> {

        if (!materials || materials.length == 0) {
            return false
        }

        const materialEntities = await this.materialService.removeMultiple(materials)

        if (!materialEntities || materialEntities.length == 0) {
            this.logger.error(`deleteMaterials:: error saving material entities`, this.context)
            return false
        }

        return materialEntities.length == materials.length
    }

    public async saveTextures(textures: TextureEntity[]): Promise<boolean> {

        if (!textures || textures.length == 0) {
            return false
        }

        const texturesEntities = await this.textureService.createMultiple(textures)

        if (!texturesEntities || texturesEntities.length == 0) {
            this.logger.error(`saveTextures:: error saving texture entities`, this.context)
            return false
        }

        return texturesEntities.length == textures.length
    }

    public async deleteTextures(textures: TextureEntity[]): Promise<boolean> {

        if (!textures || textures.length == 0) {
            return false
        }

        const textureEntities = await this.textureService.removeMultiple(textures)

        if (!textureEntities || textureEntities.length == 0) {
            this.logger.error(`deleteTextures:: error saving texture entities`, this.context)
            return false
        }

        return textureEntities.length == textures.length
    }

    public async setSharedSecret(name: string, secret: string) {
        const entity = await this.secretService.create({
            name,
            secret
        })

        return !!entity
    }

    public async getSharedSecret(name: string) {
        const entity = await this.secretService.findOne({ name })
        return entity
    }

    public async getSharedSecrets() {
        const entities = await this.secretService.all()
        return entities;
    }

    public async setVIP(user: { uuid: string }, vip: boolean) {

        //console.log(user, vip, typeof vip)
        const res = await this.userService.update(user.uuid, { vip })
        //console.log(res)
        this.eventBus.publish(new UserProfileUpdatedEvent(user.uuid))

        return (res.affected ?? 1) > 0
    }

    public async blacklist(user: { uuid: string }, blacklisted: boolean) {
        const res = await this.userService.update(user.uuid, { blacklisted })
        this.eventBus.publish(new UserProfileUpdatedEvent(user.uuid))
        return (res.affected ?? 1) > 0
    }

    public async updateMetadata(hash: string) {

        const asset = await this.assetService.findOne({ hash }, { relations: ["collectionFragment", "collectionFragment.collection"] })

        const collection = asset.collectionFragment.collection

        let metadata = null
        let world = null
        try {
            metadata = (await this.nftApiService.getNFT(collection.chainId.toString(), collection.assetType, collection.assetAddress, [asset.assetId]))?.[0] as any ?? null
            world = metadata?.tokenURI?.plot?.world ?? null
        } catch {
            this.logger.error(`updateMetadata:: couldn't fetch asset metadata: ${hash}`, undefined, this.context)
            throw new BadRequestException(`Couldn't update metadata for hash ${hash}`)
        }
        if (!!metadata) {
            await this.assetService.update({ hash: asset.hash }, { metadata, world })
        }
    }

    public async recoverAsset(hash: string, salt: string, uuid: string, inRequest: InRequestDto) {
        const funcCallPrefix = `[${makeid(5)}] recoverAsset:: uuid: ${uuid}`
        this.logger.debug(`${funcCallPrefix} START ImportDto: ${JSON.stringify(inRequest)}`, this.context)

        let enraptureCollectionFrag = findRecognizedAsset(await this.getRecognizedAsset(inRequest.chainId, BridgeAssetType.ENRAPTURED), { assetAddress: inRequest.assetAddress, assetId: String(inRequest.assetId) });
        let importCollectionFrag = findRecognizedAsset(await this.getRecognizedAsset(inRequest.chainId, BridgeAssetType.IMPORTED), { assetAddress: inRequest.assetAddress, assetId: String(inRequest.assetId) })

        let collectionFragment
        if (inRequest.enrapture) {
            if (!!enraptureCollectionFrag) {
                collectionFragment = enraptureCollectionFrag
            } else if (!!importCollectionFrag) {
                this.logger.error(`${funcCallPrefix} asset permissioned, but enrapture not supported.`, null, this.context)
                throw new UnprocessableEntityException(`Asset permissioned, but enrapture not supported.`)
            }
        } else {
            if (!!importCollectionFrag) {
                collectionFragment = importCollectionFrag
            } else if (!!enraptureCollectionFrag) {
                this.logger.error(`${funcCallPrefix} asset permissioned, but import not supported.`, null, this.context)
                throw new UnprocessableEntityException(`Asset permissioned, but import not supported.`)
            }
        }

        if (!collectionFragment) {
            this.logger.error(`${funcCallPrefix} not an permissioned asset`, null, this.context)
            throw new UnprocessableEntityException(`Not permissioned asset`)
        }

        const standardizedParams = standardizeValidateAssetInParams(inRequest.chainId, stringAssetTypeToAssetType(inRequest.assetType), inRequest.assetAddress, inRequest.assetId, inRequest.amount, inRequest.enrapture, inRequest.owner)
        const requestHash = await utf8ToKeccak(JSON.stringify(standardizedParams))
        const recalculatedHash = await calculateMetaAssetHash(standardizedParams, METAVERSE, salt, collectionFragment.collection.multiverseVersion)
        if (recalculatedHash !== hash) {
            throw new BadRequestException("Recalculated hash doesn't match the one that is already in the metaverse")
        }
        const expiration = Date.now() + CALLDATA_EXPIRATION_MS

        const user = await this.userService.findByUuid(uuid)
        await this.assetService.create({
            assetId: String(standardizedParams.assetId),
            assetOwner: standardizedParams.owner,
            enraptured: inRequest.enrapture,
            hash,
            requestHash,
            pendingIn: true,
            pendingOut: false,
            amount: standardizedParams.amount,
            expiration: expiration.toString(),
            owner: user,
            salt,
            recognizedAssetType: collectionFragment.recognizedAssetType,
            collectionFragment,
            createdAt: new Date(),
            modifiedAt: new Date()
        })
    }
}
function makeid(length: number): string {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}