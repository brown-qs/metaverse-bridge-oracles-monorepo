import { Injectable, Inject, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import MutexInterface from "async-mutex/lib/MutexInterface";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";
import { UserEntity } from "../user/user.entity";
import { AssetService } from "../asset/asset.service";
import { CollectionFragmentService } from "../collectionfragment/collectionfragment.service";
import { CompositeCollectionFragmentService } from "../compositecollectionfragment/compositecollectionfragment.service";
import { UserService } from "../user/user.service";
import { CompositeAssetService } from "../compositeasset/compositeasset.service";
import { ChainId } from "../config/constants";
import { NftApiService } from "../nftapi/nftapi.service";
import { CollectionService } from "../collection/collection.service";
import { SaveCompositeConfigDto } from "./dtos/save.dto";
import { AssetEntity } from "../asset/asset.entity";
import { CompositeMetadataType } from "../compositeasset/types";
import { checkIfIdIsRecognized } from "../utils/misc";
import { fetchUrlCallback } from "../nftapi/nftapi.utils";
import { SyntheticPartService } from "../syntheticpart/syntheticpart.service";
import { SyntheticPartEntity } from "../syntheticpart/syntheticpart.entity";
import { CompositeAssetEntity } from "../compositeasset/compositeasset.entity";
import { SyntheticItemService } from "../syntheticitem/syntheticitem.service";
import { remove } from "winston";

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

    constructor(
        private readonly userService: UserService,
        private readonly assetService: AssetService,
        private readonly collectionService: CollectionService,
        private readonly compositeAssetService: CompositeAssetService,
        private readonly compositeCollectionFragmentService: CompositeCollectionFragmentService,
        private readonly collectionFragmentService: CollectionFragmentService,
        private readonly syntheticPartService: SyntheticPartService,
        private readonly syntheticItemService: SyntheticItemService,
        private readonly nftApiService: NftApiService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = CompositeApiService.name
        this.locks = new Map();
        this.oraclePrivateKey = this.configService.get<string>('network.oracle.privateKey');
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')
    }

    public async saveCompositeConfig(dto: SaveCompositeConfigDto, user: UserEntity): Promise<CompositeMetadataType> {
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
                if (!!existingCompositeAsset.syntheticChildren) {
                    await this.syntheticItemService.removeMultiple(existingCompositeAsset.syntheticChildren)
                }
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

        if (!!compositeAsset.syntheticChildren) {
            await this.syntheticItemService.removeMultiple(compositeAsset.syntheticChildren)
        }

        await Promise.all(childrenAssets.map(async (c) => {
            if (!c.synthetic) {
                await this.assetService.update(c.hash, { compositeAsset })
            } else {
                await this.syntheticItemService.create(
                    {
                        compositeAsset,
                        syntheticPart: c.syntheticPart,
                        assetId: c.assetId,
                        id: SyntheticItemService.calculateId({ assetId: c.assetId, chainId: c.collectionFragment.collection.chainId, assetAddress: c.collectionFragment.collection.assetAddress })
                    }
                )
            }
        }))

        // return composite metadata
        return compositeMetadata
    }


    public async getCompositeMetadata(chainId: string, assetAddress: string, assetId: string): Promise<CompositeMetadataType> {

        const sanitizedChainId = chainId ? Number.parseInt(chainId) : ChainId.MOONRIVER.valueOf()
        const sanitizedAssetAddress = assetAddress.toLowerCase()

        const compositeEntry = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })


        if (!compositeEntry || !compositeEntry.compositeMetadata) {
            if (!compositeEntry?.originalMetadata) {
                const collection = await this.collectionService.findOne({ assetAddress: sanitizedAssetAddress, chainId: sanitizedChainId })
                const assetType = collection?.assetType ?? 'ERC721'

                const meta = await this.nftApiService.getRawNFTMetadata(chainId, assetType, sanitizedAssetAddress, assetId)

                if (!!meta) {
                    const compositeEntryId = CompositeAssetService.calculateId({ chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress, assetId })
                    if (!compositeEntry) {
                        const ccf = await this.compositeCollectionFragmentService.findOne({ collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } }, { relations: ['collection'] })
                        if (!!ccf) {
                            await this.compositeAssetService.create({
                                originalMetadata: meta as CompositeMetadataType,
                                assetId,
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
        return compositeEntry.compositeMetadata
    }

    public async getOriginalMetadata(chainId: string, assetAddress: string, assetId: string): Promise<CompositeMetadataType> {

        const sanitizedChainId = chainId ? Number.parseInt(chainId) : ChainId.MOONRIVER.valueOf()
        const sanitizedAssetAddress = assetAddress.toLowerCase()

        const compositeEntry = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })

        if (!compositeEntry || !compositeEntry.originalMetadata) {
            const collection = await this.collectionService.findOne({ assetAddress: sanitizedAssetAddress, chainId: sanitizedChainId })
            const assetType = collection?.assetType ?? 'ERC721'
            const meta = await this.nftApiService.getRawNFTMetadata(chainId, assetType, sanitizedAssetAddress, assetId)

            if (!!meta) {
                const compositeEntryId = CompositeAssetService.calculateId({ chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress, assetId })
                if (!compositeEntry) {
                    const ccf = await this.compositeCollectionFragmentService.findOne({ collection: { chainId: sanitizedChainId, assetAddress: sanitizedAssetAddress } }, { relations: ['collection'] })
                    if (!!ccf) {
                        await this.compositeAssetService.create({
                            originalMetadata: meta as CompositeMetadataType,
                            assetId,
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

        // get parent asset metadata
        // - fetch from saved DB
        // - if not found in saved DB, then fetch from chain -> originalURI -> tokenURI

        const sortedArray = [parentAsset, ...childrenAssets].sort((a, b) => a.zIndex - b.zIndex)

        const layers = sortedArray.map(x => `${x.uriPrefix}/${x.collectionFragment.collection.chainId}/${x.collectionFragment.collection.assetAddress.toLowerCase()}/${x.assetId}${x.uriPostfix}`)

        // TODO
        // print composite image

        // mix attributes
        const parentOriginalMetadata = await this.getOriginalMetadata(parentAsset.collectionFragment.collection.chainId.toString(), parentAsset.collectionFragment.collection.assetAddress, parentAsset.assetId)

        // get children metadata

        let attributes = [...parentOriginalMetadata?.attributes]
        const childrenMetas = await Promise.all(childrenAssets.map(async (x) => {
            const meta = await this.getCompositeMetadata(x.collectionFragment.collection.chainId.toString(), x.collectionFragment.collection.assetAddress, x.assetId)
            //console.log(meta)
            attributes = attributes.concat(meta?.attributes ?? [])
            return meta
        }))

        // TODO -> printed image
        // TODO -> use metadatas instead of just images

        // - merge metadata together -> attributes merged, layers merged, image replaced

        return {
            ...parentOriginalMetadata,
            attributes,
            layers,
            composite: true,
            asset: {
                chainId: parentAsset.collectionFragment.collection.chainId,
                assetAddress: parentAsset.collectionFragment.collection.assetAddress,
                assetId: parentAsset.assetId,
                assetType: parentAsset.collectionFragment.collection.assetType
            }
        }
    }

    public async reevaluate(compositeAsset: CompositeAssetEntity, user: UserEntity) {
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

    private async fetchCompositeMedia(uri: string): Promise<string> {

        const cb = fetchUrlCallback();

        if (!uri) {
            return undefined
        }

        const data = await cb<string>(uri, false);
        return data
    }
}
