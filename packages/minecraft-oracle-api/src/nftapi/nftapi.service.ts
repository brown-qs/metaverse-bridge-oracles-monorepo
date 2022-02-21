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


@Injectable()
export class NftApiService {

    private readonly context: string;

    constructor(
        @Inject(ProviderToken.MULTICALL_CONTRACT) private multicall: Contract,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = NftApiService.name
    }

    public async getNFTCollection(chainId: string, tokenType: string, address: string): Promise<ProcessedStaticTokenData[] | StaticTokenData[]> {
        const recognizedCollection = (collections.collections.filter((x) => x.chainId === Number(chainId)) ?? []).find(coll => coll.address.toLowerCase() === address.toLowerCase());
        let assets: Asset[] = [];
        for (let i=recognizedCollection.minId; i<recognizedCollection.maxId; i++) {
            assets.push({
                assetAddress: address,
                assetId: i.toString(),
                assetType: stringToStringAssetType(tokenType),
                id: '1',
            })
        }

        let calls: any[] = [];
        assets.map((asset, i) => {
            calls = [...calls, ...getTokenStaticCalldata(asset)];
        });

        const call_results = await this.tryMultiCallCore(this.multicall, calls, false);

        if (!call_results) {
            return undefined
        }
        //console.log('yolo tryMultiCallCore res', results);
        let x = processTokenStaticCallResults(assets, call_results);
        const tokenUris = await this.useFetchTokenUri(x)
        let results: any[] = [];
        if(!!tokenUris) { 
            results = await Promise.all(x.map(async (xi, ind) => {
                let result: any = xi;
                result['tokenURI'] = tokenUris[ind] as TokenMeta
            
                const imageurl = uriToHttp(result.tokenURI.image, false)
                result.tokenURI.image = {
                    url: imageurl,
                    ...await this.fetchMediaType(imageurl)
                }
                console.log('hmm', result);
                return result;
            }))
        }
        return results;

    }

    public async getNFT(chainId: string, tokenType: string, address: string, tokenId: string): Promise<ProcessedStaticTokenData | StaticTokenData> {

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

        const results = await this.tryMultiCallCore(this.multicall, calls, false);

        if (!results) {
            return undefined
        }
        //console.log('yolo tryMultiCallCore res', results);
        let x = processTokenStaticCallResults(assets, results);
        const tokenUris = await this.useFetchTokenUri(x)
        let result: any = x?.[0]
        if(!!tokenUris) {
            result['tokenURI'] = tokenUris?.[0] as TokenMeta
            
            const imageurl = uriToHttp(result.tokenURI.image, false)
            result.tokenURI.image = {
                url: imageurl,
                ...await this.fetchMediaType(imageurl)
            }
        }
        return result
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

    private fetchMediaType = async (url: string) => {
        const res = url ? await fetch(url) : undefined;
        if (res?.body) {
            const type = await fromStream(res.body as any);
            return type
        }
        return undefined
    }
}
