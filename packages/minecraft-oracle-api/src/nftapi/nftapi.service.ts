import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import uriToHttp, { fetchUrlCallback, getTokenStaticCalldata, processTokenStaticCallResults, stringToStringAssetType } from './nftapi.utils';
import { Asset, ProcessedStaticTokenData, StaticTokenData, TokenMeta } from './nftapi.types';
import { ProviderToken } from '../provider/token';
import { Interface } from 'ethers/lib/utils';
import { Contract } from '@ethersproject/contracts';
import { fromStream } from 'file-type/core';
import fetch from 'node-fetch'
import { collections } from '../common/collections';
import { TypeContractsCallbackProvider } from '../provider/contract';
import { ContractType } from '../common/enums/ContractType';
import { CollectionQueryDto, NftsQueryDto } from './dtos/nft.dto';


@Injectable()
export class NftApiService {

    private readonly context: string;
    private readonly defaultChainId: number;

    constructor(
        @Inject(ProviderToken.CONTRACT_CHAIN_CALLBACK) private getContract: TypeContractsCallbackProvider,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = NftApiService.name
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')
    }

    public async getNFTCollection(dto: CollectionQueryDto): Promise<(ProcessedStaticTokenData | StaticTokenData)[]> {
        const chainId = Number.parseInt(dto.chainId ?? '1285')
        const take = dto.take ?? 100
        const offset = Number.parseInt(dto.offset as any)
        const assetIds: string[] = Array.from({ length: take }, (_, i) => (i + 1 + offset).toString())
        const results = await this.getNFT(chainId.toString(), dto.assetType, dto.assetAddress, assetIds)
        return results
    }

    public async getNFTs(dto: NftsQueryDto) {
        const res = []
        const x = await this.getNFT(dto.chainId, dto.assetType, dto.assetAddress, dto.assetIds)
        return x
    }

    public async getNFT(chainId: string, tokenType: string, address: string, tokenIds: string[]): Promise<(ProcessedStaticTokenData | StaticTokenData)[]> {

        this.logger.debug(`Fetching NFT metadata: ${chainId}-${tokenType}-${address}-${tokenIds}`, this.context)

        const assets: Asset[] = tokenIds.map(tokenId => {
            return {
                assetAddress: address,
                assetId: tokenId,
                assetType: stringToStringAssetType(tokenType),
                chainId: Number.parseInt(chainId ?? '1285'),
                id: '1'
            }
        })

        let calls: any[] = [];
        assets.map((asset, i) => {
            calls = [...calls, ...getTokenStaticCalldata(asset)];
        });

        const multicall = await this.getContract(!!chainId ? Number.parseInt(chainId) : this.defaultChainId, ContractType.MULTICALL)
        const call_results = await this.tryMultiCallCore(multicall, calls, false);

        if (!call_results) {
            this.logger.error(`Fetching NFT metadata: ${chainId}-${tokenType}-${address}-${tokenIds}`, undefined, this.context)
            return undefined
        }
        //console.log('yolo tryMultiCallCore res', results);
        let statics = processTokenStaticCallResults(assets, call_results);
        const tokenUris = await this.useFetchTokenUri(statics)
        let results: any[] = [];

        if (!!tokenUris) {
            results = await Promise.all(statics.map(async (stat, ind) => {
                let result: any = stat;

                if (!tokenUris?.[ind]) {
                    return undefined
                }
                result['tokenURI'] = tokenUris?.[ind] as TokenMeta

                const imageurl = uriToHttp(result.tokenURI?.image, false)
                result.tokenURI.image = imageurl
                result.tokenURI['image_meta'] = {
                    url: imageurl,
                    ...await this.fetchMediaType(imageurl)
                }
                result['asset'] = {
                    assetAddress: assets[ind].assetAddress,
                    assetId: assets[ind].assetId,
                    assetType: assets[ind].assetType,
                    chainId: assets[ind].chainId,
                }
                return result
            }))
        }
        return results
    }

    public async getRawNFTMetadata(chainId: string, tokenType: string, address: string, tokenId: string): Promise<{ metaObject?: unknown, metaUri?: string } | undefined> {

        this.logger.debug(`Fetching NFT metadata: ${chainId}-${tokenType}-${address}-${tokenId}`, this.context)

        const assets: Asset[] = [
            {
                assetAddress: address,
                assetId: tokenId,
                assetType: stringToStringAssetType(tokenType),
                id: '1'
            }
        ]

        let calls: any[] = [];
        assets.map((asset, i) => {
            calls = [...calls, ...getTokenStaticCalldata(asset)];
        });

        const multicall = await this.getContract(!!chainId ? Number.parseInt(chainId) : this.defaultChainId, ContractType.MULTICALL)
        const results = await this.tryMultiCallCore(multicall, calls, false);

        if (!results) {
            this.logger.error(`Fetching NFT metadata: ${chainId}-${tokenType}-${address}-${tokenId}`, undefined, this.context)
            return undefined
        }
        //console.log('yolo tryMultiCallCore res', results);
        let x = processTokenStaticCallResults(assets, results);
        const tokenMetaUris = x.map(x => x.tokenURI)
        const tokenMetas = await this.useFetchRawTokenUri(x)


        return {
            metaObject: tokenMetas?.[0] as TokenMeta,
            metaUri: tokenMetaUris?.[0]
        }
    }

    private tryMultiCallCore = async (
        multi: Contract | undefined,
        calls: [any, string, string, any[]][], // list of lists: [abi fragment, target address, function name, [data]]
        requireSuccess = false,
        options?: Object
    ) => {
        if (!multi) {
            console.error('Multicall contract could not be accessed');
            return undefined;
        }
        try {
            //console.log('YOLO calls', { calls });

            const retarray = await multi.callStatic.tryAggregate(
                requireSuccess,
                calls.map((call, i: number) => {
                    const itf = new Interface(call[0]);
                    return [
                        call[1].toLowerCase(),
                        itf.encodeFunctionData(call[2], call[3]),
                    ];
                }),
                options || {}
            );
            const retval: any[] = retarray.map((resfrag: any, i: number) => {
                if (!resfrag[0]) {
                    return undefined;
                }
                const itfinnter = new Interface(calls[i][0]);
                return itfinnter.decodeFunctionResult(calls[i][2], resfrag[1]);
            });
            return retval;
        } catch (e) {
            console.error('Error calling multicall 2', e);
            return undefined;
        }
    };

    private async useFetchTokenUri(
        uris: ({ tokenURI?: string } | undefined)[] | undefined
    ): Promise<(TokenMeta | undefined)[]> {

        const cb = fetchUrlCallback();

        if (!uris) {
            return []
        }

        //console.log(uris)
        const promises = uris.map(async (uri) => {
            //const rawmeta = await cb<TokenMeta>(uri?.tokenURI, false);
            // FIXME fucking black token
            const rawmeta = await cb<TokenMeta>(uri?.tokenURI === 'https://ipfs.io/ipfs/QmcuV7UqedmTKVzQ9yD2QNm3dhiaN5JXdqRtJTFKqTJEL3' ? 'ipfs://QmcN86vmnTrYaRjtPn3fP98rfAE7BUEkaoVLGHKhUtAurJ' : uri?.tokenURI, false);


            let meta;
            if (typeof rawmeta === 'string' || rawmeta instanceof String) {
                meta = JSON.parse(rawmeta as string);
            } else {
                meta = rawmeta;
            }

            //console.log('ONE META', {meta, rawmeta})

            if (meta) {
                meta.external_url = meta.external_url
                    ? uriToHttp(meta.external_url, false)
                    : undefined;
                meta.image = meta.image ? uriToHttp(meta.image, false) : undefined;
                meta.animation_url = meta.animation_url
                    ? uriToHttp(meta.animation_url, false)
                    : undefined;
                meta.youtube_url = meta.youtube_url
                    ? uriToHttp(meta.youtube_url, false)
                    : undefined;
            }
            return meta;
        });

        const metas = await Promise.all(promises);
        return metas;
    }

    private async useFetchRawTokenUri(
        uris: ({ tokenURI?: string } | undefined)[] | undefined
    ): Promise<(TokenMeta | undefined)[]> {

        const cb = fetchUrlCallback();

        if (!uris) {
            return []
        }

        //console.log(uris)
        const promises = uris.map(async (uri) => {
            //const rawmeta = await cb<TokenMeta>(uri?.tokenURI, false);
            // FIXME fucking black token
            const rawmeta = await cb<TokenMeta>(uri?.tokenURI === 'https://ipfs.io/ipfs/QmcuV7UqedmTKVzQ9yD2QNm3dhiaN5JXdqRtJTFKqTJEL3' ? 'ipfs://QmcN86vmnTrYaRjtPn3fP98rfAE7BUEkaoVLGHKhUtAurJ' : uri?.tokenURI, false);


            let meta;
            if (typeof rawmeta === 'string' || rawmeta instanceof String) {
                meta = JSON.parse(rawmeta as string);
            } else {
                meta = rawmeta;
            }

            return meta;
        });

        const metas = await Promise.all(promises);
        return metas;
    }

    private fetchMediaType = async (url: string) => {
        const res = url ? await fetch(url) : undefined;
        if (res?.body) {
            const type = await fromStream(res.body as any);
            return type
        }
        return undefined
    }
}
