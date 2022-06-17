import { Injectable, Inject, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import MutexInterface from "async-mutex/lib/MutexInterface";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";
import { MinecraftUserEntity } from "../user/minecraft-user/minecraft-user.entity";
import { AssetService } from "../asset/asset.service";
import { CollectionFragmentService } from "../collectionfragment/collectionfragment.service";
import { CompositeCollectionFragmentService } from "../compositecollectionfragment/compositecollectionfragment.service";
import { MinecraftUserService } from "../user/minecraft-user/minecraft-user.service";
import { CompositeAssetService } from "../compositeasset/compositeasset.service";
import { ChainId } from "../config/constants";
import { NftApiService } from "../nftapi/nftapi.service";
import { CollectionService } from "../collection/collection.service";
import { SaveCompositeConfigDto } from "./dtos/save.dto";
import { AssetEntity } from "../asset/asset.entity";
import { CompositeMetadataType } from "../compositeasset/types";
import { checkIfIdIsRecognized } from "../utils/misc";
import { SyntheticPartService } from "../syntheticpart/syntheticpart.service";
import { SyntheticPartEntity } from "../syntheticpart/syntheticpart.entity";
import { CompositeAssetEntity } from "../compositeasset/compositeasset.entity";
import { SyntheticItemService } from "../syntheticitem/syntheticitem.service";
import S3 from 'aws-sdk/clients/s3';
import sharp from "sharp";
import { ProviderToken } from "../provider/token";
import { fetchImageBufferCallback } from "./compositeapi.utils";


export type CompositeEnrichedAssetEntity = AssetEntity & {
    zIndex: number
    uriPrefix: string
    uriPostfix: string
    synthetic: boolean
    syntheticPart?: SyntheticPartEntity
}

@Injectable()
export class CompositeApiService {

    private locks: Map<string, MutexInterface>;

    private readonly context: string;
    private readonly oraclePrivateKey: string;
    private readonly defaultChainId: number;

    private readonly compositeMediaKeyPrefix: string;
    private readonly compositeUriPrefix: string;
    private readonly compositeUriPostfix: string;

    private readonly bucket: string;

    private readonly metadataPublicPath: string;

    constructor(
        private readonly userService: MinecraftUserService,
        private readonly assetService: AssetService,
        private readonly collectionService: CollectionService,
        private readonly compositeAssetService: CompositeAssetService,
        private readonly compositeCollectionFragmentService: CompositeCollectionFragmentService,
        private readonly collectionFragmentService: CollectionFragmentService,
        private readonly syntheticPartService: SyntheticPartService,
        private readonly syntheticItemService: SyntheticItemService,
        private readonly nftApiService: NftApiService,
        @Inject(ProviderToken.S3_CLIENT) private readonly s3: S3,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = CompositeApiService.name
        this.locks = new Map();
        this.oraclePrivateKey = this.configService.get<string>('network.oracle.privateKey');
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')

        this.compositeMediaKeyPrefix = this.configService.get<string>('composite.mediaKeyPrefix')
        this.compositeUriPrefix = this.configService.get<string>('composite.uriPrefix')
        this.compositeUriPostfix = this.configService.get<string>('composite.uriPostfix')
        this.bucket = this.configService.get<string>('s3.bucket')

        this.metadataPublicPath = this.configService.get<string>('composite.metadataPublicPath')
    }

    public async saveCompositeConfig(dto: SaveCompositeConfigDto, user: MinecraftUserEntity): Promise<CompositeMetadataType> {
        const compositeParent = dto.compositeParent
        const compositeChildren = dto.compositeChildren

        const parentAssetAddress = compositeParent.assetAddress.toLowerCase()
        const parentChainId = compositeParent.chainId ?? ChainId.MOONRIVER
        const parentAssetId = compositeParent.assetId

        this.logger.log(`saveCompositeConfig:: started for ${parentChainId}-${parentAssetAddress}-${parentAssetId} owned by ${user.userName}`, this.context)
        //console.log(compositeChildren)

        let parentAsset: CompositeEnrichedAssetEntity | AssetEntity = await this.assetService.findOne({
            collectionFragment: { collection: { assetAddress: parentAssetAddress, chainId: parentChainId } },
            assetId: parentAssetId,
            owner: { uuid: user.uuid }
        }, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

        if (!parentAsset) {
            this.logger.error(`saveCompositeConfig:: Parent asset ${parentChainId}-${parentAssetAddress} is not owned by ${user.userName}`, undefined, this.context)

            // we clean up faulty composite asset
            const existingCompositeAsset = await this.compositeAssetService.findOne({ assetId: parentAssetId, compositeCollectionFragment: { collection: { assetAddress: parentAssetAddress, chainId: parentChainId } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection', 'syntheticChildren'], loadEagerRelations: true })

            if (!!existingCompositeAsset) {
                await this.compositeAssetService.remove(existingCompositeAsset)
            }

            throw new UnprocessableEntityException('Parent asset is not owned by user.')
        }

        // check if composite collection fragment exists, throw if now
        const compositeCollectionFragment = await this.compositeCollectionFragmentService.findOne({ collection: { assetAddress: parentAssetAddress } }, { relations: ['collection', 'compositeParts', 'compositeParts.collectionFragment', 'compositeParts.collectionFragment.collection'], loadEagerRelations: true })

        if (!compositeCollectionFragment) {
            this.logger.error(`saveCompositeConfig:: Parent asset ${parentChainId}-${parentAssetAddress} is not composite enabled`, undefined, this.context)
            throw new UnprocessableEntityException('Collection is not a permissioned composite asset')
        }

        parentAsset = {
            ...parentAsset,
            uriPrefix: compositeCollectionFragment.uriPrefix,
            uriPostfix: compositeCollectionFragment.uriPostfix,
            zIndex: 0,
            synthetic: false
        }


        let zIndexMap: { [key: number]: boolean } = {}

        const childrenAssets: CompositeEnrichedAssetEntity[] = await Promise.all(compositeChildren.map(async (child) => {
            const childAssetAddress = child.assetAddress.toLowerCase()
            const childAssetId = child.assetId
            const childChainId = child.chainId ?? ChainId.MOONRIVER


            // check if asset is synthetic

            let syntheticAsset: SyntheticPartEntity = await this.syntheticPartService.findOne({
                assetAddress: childAssetAddress,
                compositeCollectionFragment: { collection: { chainId: childChainId } }
            }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })

            if (!syntheticAsset) {
                const childAsset = await this.assetService.findOne({
                    collectionFragment: { collection: { assetAddress: childAssetAddress, chainId: childChainId } },
                    assetId: child.assetId,
                    owner: { uuid: user.uuid }
                }, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

                if (!childAsset) {
                    this.logger.error(`saveCompositeConfig:: child asset ${childChainId}-${childAssetAddress}-${childAssetId} not owned by ${user.userName}`, undefined, this.context)
                    throw new UnprocessableEntityException('Child asset is not owned by user.')
                }

                // check if child asset is a permissioned composite part
                const part = compositeCollectionFragment.compositeParts.find(part => {
                    return checkIfIdIsRecognized(part.collectionFragment.idRange, { assetAddress: childAssetAddress, assetId: childAssetId })
                        && part.collectionFragment.collection.assetAddress.toLowerCase() === childAssetAddress
                        && part.collectionFragment.collection.chainId === childChainId
                })

                if (!part) {
                    this.logger.error(`saveCompositeConfig:: child asset ${childChainId}-${childAssetAddress}-${childAssetId} is not equippable as a composite part for ${parentChainId}-${parentAssetAddress}-${parentAssetId}`, undefined, this.context)
                    throw new UnprocessableEntityException('Child asset is not equippable as a composite part.')
                }

                if (!zIndexMap[part.zIndex]) {
                    zIndexMap[part.zIndex] = true
                } else {
                    this.logger.error(`saveCompositeConfig:: child asset ${childChainId}-${childAssetAddress}-${childAssetId} zIndex ${part.zIndex} clash`, undefined, this.context)
                    throw new UnprocessableEntityException('Child asset zIndex clash')
                }

                return { ...childAsset, zIndex: part.zIndex, uriPrefix: part.uriPrefix, uriPostfix: part.uriPostfix, synthetic: false }
            }

            if (!zIndexMap[syntheticAsset.zIndex]) {
                zIndexMap[syntheticAsset.zIndex] = true
            } else {
                this.logger.error(`saveCompositeConfig:: synthetic asset ${childChainId}-${childAssetAddress}-${childAssetId} zIndex ${syntheticAsset.zIndex} clash`, undefined, this.context)
                throw new UnprocessableEntityException('Child asset zIndex clash')
            }

            //x.collectionFragment.collection.chainId.toString(), x.collectionFragment.collection.assetAddress,
            // we fake this shit
            return { collectionFragment: { collection: { chainId: childChainId, assetAddress: childAssetAddress } }, syntheticPart: syntheticAsset, assetId: childAssetId, zIndex: syntheticAsset.zIndex, uriPrefix: syntheticAsset.mediaUriPrefix, uriPostfix: syntheticAsset.mediaUriPostfix, synthetic: true } as unknown as CompositeEnrichedAssetEntity


        }))

        // check if children assets are all equippable to the parent

        let compositeAsset = await this.compositeAssetService.findOne({ assetId: parentAsset.assetId, compositeCollectionFragment }, { relations: ['compositeCollectionFragment', 'syntheticChildren'] })
        // check if composite asset exists, crete if not

        const compositeAssetId = CompositeAssetService.calculateId({ chainId: parentChainId ?? ChainId.MOONRIVER, assetAddress: parentAssetAddress, assetId: parentAssetId })

        if (!compositeAsset) {
            compositeAsset = await this.compositeAssetService.create({
                id: compositeAssetId,
                compositeCollectionFragment,
                assetId: parentAssetId
            })
        }

        // create composite metadata, and save

        const compositeMetadata = await this.createCompositeMetadata(parentAsset, childrenAssets)

        await this.compositeAssetService.update(compositeAsset.id, { compositeMetadata })

        await Promise.all(childrenAssets.map(async (c) => {
            if (!c.synthetic) {
                await this.assetService.update(c.hash, { compositeAsset })
            } else {

                const sit = await this.syntheticItemService.findOne({
                    id: SyntheticItemService.calculateId({
                        assetId: c.assetId,
                        chainId: c.collectionFragment.collection.chainId,
                        assetAddress: c.collectionFragment.collection.assetAddress,
                        syntheticPartId: c.syntheticPart.id
                    })
                },
                    { relations: ['compositeAssets'] }
                )

                if (!!sit) {
                    const x = sit.compositeAssets?.find(x => x.id === compositeAsset.id)
                    // relation does not exist yet
                    if (!x) {
                        await this.syntheticItemService.create({
                            ...sit,
                            compositeAssets: [...sit.compositeAssets, compositeAsset]
                        })
                    }
                }
            }
        }))

        // return composite metadata
        return compositeMetadata
    }

    // TODO
    // for now it tries to:
    // 1, return saved composite meta in db
    // 2, return original meta with composite image/layers replaced
    // 3. return original meta
    public async getCompositeMetadata(chainId: string, assetAddress: string, assetId: string): Promise<CompositeMetadataType> {

        this.logger.debug(`getCompositeMetadata:: started for ${chainId}-${assetAddress}-${assetId}`, this.context)

        const sanitizedChainId = chainId ? Number.parseInt(chainId) : ChainId.MOONRIVER.valueOf()
        const sanitizedAssetAddress = assetAddress.toLowerCase()

        const compositeEntry = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })

        if (!compositeEntry || !compositeEntry.compositeMetadata) {

            let meta, metaUri
            let synthetic = false
            // if no original meta was fetched ever
            if (!compositeEntry?.originalMetadata) {
                const collection = await this.collectionService.findOne({ assetAddress: sanitizedAssetAddress, chainId: sanitizedChainId })
                const assetType = collection?.assetType ?? 'ERC721'

                const metaResult = await this.fetchOriginalMetadata(chainId, assetType, sanitizedAssetAddress, assetId)
                meta = metaResult?.metaObject
                metaUri = metaResult?.metaUri
                synthetic = metaResult.synthetic
            } else {
                meta = compositeEntry.originalMetadata
                metaUri = compositeEntry.originalMetadataUri
            }

            if (!!meta && synthetic) {
                return meta
            }

            if (!!meta) {

                const ccf = await this.compositeCollectionFragmentService.findOne({ collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } }, { relations: ['collection'] })
                const compMediaUrl = ccf ? `${ccf.uriPrefix}/${ccf.collection.chainId}/${ccf.collection.assetAddress.toLowerCase()}/${assetId}${ccf.uriPostfix}` : meta?.image

                const compositeMeta: CompositeMetadataType = {
                    ...meta as CompositeMetadataType,
                    composite: false,
                    image: compMediaUrl
                }

                const compositeEntryId = CompositeAssetService.calculateId({ chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress, assetId })

                if (!compositeEntry) {
                    if (!!ccf) {
                        await this.compositeAssetService.create({
                            originalMetadata: meta as CompositeMetadataType,
                            compositeMetadata: compositeMeta,
                            assetId,
                            compositeCollectionFragment: ccf,
                            originalMetadataUri: metaUri,
                            id: compositeEntryId
                        })
                    }
                } else {
                    await this.compositeAssetService.update(compositeEntryId, { originalMetadata: meta, compositeMetadata: compositeMeta })
                }

                return compositeMeta
            }
            throw new UnprocessableEntityException(`Error fetching metadata`)
        }
        return compositeEntry.compositeMetadata
    }

    public async getOriginalMetadata(chainId: string, assetAddress: string, assetId: string): Promise<CompositeMetadataType> {

        const sanitizedChainId = chainId ? Number.parseInt(chainId) : ChainId.MOONRIVER.valueOf()
        const sanitizedAssetAddress = assetAddress.toLowerCase()

        const compositeEntry = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })

        if (!compositeEntry || !compositeEntry.originalMetadata) {
            const collection = await this.collectionService.findOne({ assetAddress: sanitizedAssetAddress, chainId: sanitizedChainId })
            const assetType = collection?.assetType ?? 'ERC721'
            const { metaObject: meta, metaUri } = await this.fetchOriginalMetadata(chainId, assetType, sanitizedAssetAddress, assetId)

            if (!!meta) {
                const compositeEntryId = CompositeAssetService.calculateId({ chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress, assetId })
                if (!compositeEntry) {
                    const ccf = await this.compositeCollectionFragmentService.findOne({ collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } }, { relations: ['collection'] })
                    if (!!ccf) {
                        await this.compositeAssetService.create({
                            originalMetadata: meta as CompositeMetadataType,
                            assetId,
                            originalMetadataUri: metaUri,
                            compositeCollectionFragment: ccf,
                            id: compositeEntryId
                        })
                    }
                } else {
                    await this.compositeAssetService.update(compositeEntryId, { originalMetadata: meta })
                }
            }

            // TODO create composite entry?
            // TODO fetched from imported asset if exists?
            // TODO save fetched originalMetadata?
            return meta as CompositeMetadataType
        }

        return compositeEntry.originalMetadata
    }

    public async createCompositeMetadata(parentAsset: CompositeEnrichedAssetEntity, childrenAssets: CompositeEnrichedAssetEntity[]): Promise<CompositeMetadataType> {

        const parentChainId = parentAsset.collectionFragment.collection.chainId
        const parentAddress = parentAsset.collectionFragment.collection.assetAddress
        const parentId = parentAsset.assetId

        this.logger.debug(`createCompositeMetadata:: started for ${parentChainId}-${parentAddress}-${parentId}`, this.context)

        // sort by z index
        const sortedArray = [parentAsset, ...childrenAssets].sort((a, b) => a.zIndex - b.zIndex)

        // get metadata layers and images ordered by z index
        const imglayers = sortedArray.map(x => `${x.uriPrefix}/${x.collectionFragment.collection.chainId}/${x.collectionFragment.collection.assetAddress.toLowerCase()}/${x.assetId}${x.uriPostfix}`)
        const layers = sortedArray.map(x => `${this.metadataPublicPath}/${x.collectionFragment.collection.chainId}/${x.collectionFragment.collection.assetAddress}/${x.assetId}`)

        // mix attributes
        const parentOriginalMetadata = await this.getOriginalMetadata(parentAsset.collectionFragment.collection.chainId.toString(), parentAsset.collectionFragment.collection.assetAddress, parentAsset.assetId)

        let attributes = [...parentOriginalMetadata?.attributes]
        const attributelists = await Promise.all(childrenAssets.map(async (x) => {
            const meta = await this.fetchOriginalMetadata(x.collectionFragment.collection.chainId.toString(), x.collectionFragment.collection.assetType, x.collectionFragment.collection.assetAddress, x.assetId)
            return meta?.metaObject?.attributes ?? []
        }))

        for (let i = 0; i < attributelists.length; i++) {
            attributes = attributes.concat(attributelists[i])
        }
        console.log(attributes)

        // TODO -> printed image

        let image = ''

        if (imglayers.length > 1) {
            const cb = fetchImageBufferCallback()
            console.log(JSON.stringify(imglayers))
            const imageLayers = (await Promise.all(imglayers.map(async (layer) => cb(layer))) as string[]).map(x => Buffer.from(x))
            console.log(typeof imageLayers[0])

            let data
            try {
                data = await sharp(imageLayers[0]).composite(imageLayers.slice(1).map((x, i) => {
                    //console.log(i)
                    return {
                        input: x,
                        gravity: sharp.gravity.southeast
                    }
                })).toFormat('png').toBuffer()
            } catch (err) {
                this.logger.error(`createCompositeMetadata:: media stacking error`, undefined, this.context)
            }

            //console.log(data)

            const key = `${this.compositeMediaKeyPrefix}/${parentChainId}/${parentAddress}/${parentId}${this.compositeUriPostfix}`
            try {
                const res = await this.s3.upload({ Bucket: this.bucket, Body: data, Key: key, }, {}, (err, data) => {
                    if (err) {
                        this.logger.error(`createCompositeMetadata:: s3 upload error`, JSON.stringify(err.message), this.context)
                    }
                    if (data) {
                        this.logger.debug(`createCompositeMetadata:: upload ${JSON.stringify(data)}`, this.context)
                    }
                })
                this.logger.debug(`createCompositeMetadata:: s3 upload ${key}`, this.context)
                image = `${parentAsset.uriPrefix}/${key}`
            } catch (err) {
                this.logger.error(`createCompositeMetadata:: s3 error`, undefined, this.context)
                //console.log(err)
            }
        } else {
            image = imglayers[0]
        }

        //console.log('image', image)

        return {
            ...parentOriginalMetadata,
            image,
            attributes,
            layers,
            composite: true,
            asset: {
                chainId: parentChainId,
                assetAddress: parentAddress,
                assetId: parentId,
                assetType: parentAsset.collectionFragment.collection.assetType
            }
        }
    }

    public async reevaluate(compositeAsset: CompositeAssetEntity, user: MinecraftUserEntity) {
        const ca = await this.compositeAssetService.findOne(
            { id: compositeAsset.id },
            { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection', 'children', 'children.collectionFragment', 'children.collectionFragment.collection', 'syntheticChildren', 'syntheticChildren.syntheticPart', 'syntheticChildren.syntheticPart.compositeCollectionFragment', 'syntheticChildren.syntheticPart.compositeCollectionFragment.collection'], loadEagerRelations: true })

        if (!ca) {
            return
        }

        console.log('reevaluate', ca)

        await this.saveCompositeConfig({
            compositeParent: {
                assetAddress: ca.compositeCollectionFragment.collection.assetAddress,
                assetId: ca.assetId,
                assetType: ca.compositeCollectionFragment.collection.assetType,
                chainId: ca.compositeCollectionFragment.collection.chainId
            },
            compositeChildren: ca.children.map(x => {
                return {
                    assetAddress: x.collectionFragment.collection.assetAddress,
                    assetId: x.assetId,
                    assetType: x.collectionFragment.collection.assetType,
                    chainId: x.collectionFragment.collection.chainId
                }
            }).concat(ca.syntheticChildren.map(x => {
                return {
                    assetAddress: x.syntheticPart.assetAddress,
                    assetId: x.assetId,
                    assetType: x.syntheticPart.compositeCollectionFragment.collection.assetType,
                    chainId: x.syntheticPart.compositeCollectionFragment.collection.chainId
                }
            }))
        }, user)
    }

    private async fetchOriginalMetadata(chainId: string, assetType: string, assetAddress: string, assetId: string): Promise<{ metaObject: CompositeMetadataType, metaUri: string, synthetic: boolean }> {

        // check if synthetic

        const syntheticPart = await this.syntheticPartService.findOne({ assetAddress })

        if (!!syntheticPart) {

            // check if synthetic item exists
            console.log({ assetAddress, assetId })

            const syntheticItem = await this.syntheticItemService.findOne({ syntheticPart, assetId })

            let attributes
            if (!!syntheticItem) {
                attributes = syntheticItem.attributes ?? []
            }

            console.log('attributes', attributes)

            const path = `${chainId}/${assetAddress}/${assetId}`
            return {
                metaObject: {
                    image: `${syntheticPart.mediaUriPrefix}/${path}${syntheticPart.mediaUriPostfix}`,
                    external_url: 'https://moonsama.com',
                    attributes,
                    asset: {
                        assetAddress: assetAddress.toLowerCase(),
                        assetId,
                        assetType,
                        chainId: Number.parseInt(chainId)
                    },
                    name: `Synthetic Asset`,
                    description: `This is Moonsama synthetic asset ${path}. It is not on the blockchain.`,
                    composite: false
                },
                metaUri: `${this.metadataPublicPath}/${path}`,
                synthetic: true
            }
        }

        const res = await this.nftApiService.getRawNFTMetadata(chainId, assetType, assetAddress, assetId)
        return {
            metaObject: {
                ...(res.metaObject as any),
                asset: {
                    assetAddress: assetAddress.toLowerCase(),
                    assetId,
                    assetType,
                    chainId: Number.parseInt(chainId)
                },
                composite: false
            },
            metaUri: res.metaUri,
            synthetic: false
        }
    }
}
