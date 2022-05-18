import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import MutexInterface from "async-mutex/lib/MutexInterface";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";
import { ImportDto } from "../oracleapi/dtos/import.dto";
import { TypeOracleWalletProvider, TypeRecognizedChainAssetsProvider } from "../provider";
import { ProviderToken } from "../provider/token";
import { UserEntity } from "../user/user.entity";
import { AssetService } from "../asset/asset.service";
import { CollectionFragmentService } from "../collectionfragment/collectionfragment.service";
import { CompositeCollectionFragmentService } from "../compositecollectionfragment/compositecollectionfragment.service";
import { UserService } from "../user/user.service";
import { CompositeAssetService } from "../compositeasset/compositeasset.service";
import { ChainId } from "../config/constants";
import { NftApiService } from "../nftapi/nftapi.service";
import { CollectionService } from "../collection/collection.service";
import { boolean } from "fp-ts";
import { SaveCompositeConfigDto } from "./dtos/save.dto";

@Injectable()
export class CompositeApiService {

    private locks: Map<string, MutexInterface>;

    private readonly context: string;
    private readonly oraclePrivateKey: string;
    private readonly defaultChainId: number;

    constructor(
        private readonly userService: UserService,
        private readonly AssetService: AssetService,
        private readonly collectionService: CollectionService,
        private readonly compositeAssetService: CompositeAssetService,
        private readonly compositeCollectionFragmentService: CompositeCollectionFragmentService,
        private readonly collectionFragmentService: CollectionFragmentService,
        private readonly nftApiService: NftApiService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = CompositeApiService.name
        this.locks = new Map();
        this.oraclePrivateKey = this.configService.get<string>('network.oracle.privateKey');
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')
    }

    public async saveCompositeConfig(dto: SaveCompositeConfigDto): Promise<boolean> {

        return true
    }


    public async getCompositeMetadata(chainId: string, assetAddress: string, assetId: string): Promise<unknown> {

        const sanitizedChainId = chainId ? Number.parseInt(chainId) : ChainId.MOONRIVER.valueOf()

        const compositeEntry = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { chainId: sanitizedChainId } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })


        if (!compositeEntry || !compositeEntry.compositeMetadata) {

            if (!compositeEntry?.originalMetadata) {
                const collection = await this.collectionService.findOne({ assetAddress, chainId: sanitizedChainId })
                const assetType = collection?.assetType ?? 'ERC721'
                const meta = await this.nftApiService.getRawNFTMetadata(chainId, assetType, assetAddress, assetId)
                
                // TODO create composite entry?
                // TODO fetched from imported asset if exists?
                // TODO save fetched originalMetadata?
                return meta
            }

            return compositeEntry.originalMetadata
        }

        return compositeEntry.compositeMetadata
    }


}