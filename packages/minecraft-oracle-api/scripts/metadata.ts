import * as fs from 'fs'

import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

import { config } from 'dotenv'
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity'
import { UserEntity } from '../src/user/user.entity'
import { TextureEntity } from '../src/texture/texture.entity'
import { AssetEntity } from '../src/asset/asset.entity'
import { SummonEntity } from '../src/summon/summon.entity'
import { InventoryEntity } from '../src/inventory/inventory.entity'
import { PlaySessionEntity } from '../src/playsession/playsession.entity'
import { PlaySessionStatEntity } from '../src/playsession/playsessionstat.entity'
import { SkinEntity } from '../src/skin/skin.entity'
import uriToHttp, { getTokenStaticCalldata, processTokenStaticCallResults, stringToStringAssetType, fetchUrlCallback } from '../src/nft/nft.utils'
import { Asset, TokenMeta } from '../src/nft/nft.types'
import { fromStream } from 'file-type'
import { Contract, ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { MULTICALL_ADDRESSES } from '../src/config/constants'
import { MULTICALL_ABI } from '../src/common/contracts/Multicall'
import fetch from 'node-fetch'

config()

async function tryMultiCallCore (
        multi: Contract | undefined,
        calls: [any, string, string, any[]][], // list of lists: [abi fragment, target address, function name, [data]]
        requireSuccess = false,
        options?: Object
    ) {
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
                        call[1]?.toLowerCase(),
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

    async function useFetchTokenUri(
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

    const fetchMediaType = async (url: string) => {
        const res = url ? await fetch(url) : undefined;
        if (res?.body) {
            const type = await fromStream(res.body as any);
            return type
        }
        return undefined
    }


async function getNft(chainId: any, tokenType: string, address: any, tokenId: any) {
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

        const client = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const oracle = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, client);
        const multicall = new Contract(MULTICALL_ADDRESSES[chainId], MULTICALL_ABI, oracle)

        const results = await tryMultiCallCore(multicall, calls, false);

        if (!results) {
            return undefined
        }
        //console.log('yolo tryMultiCallCore res', results);
        let x = processTokenStaticCallResults(assets, results);
        const tokenUris = await useFetchTokenUri(x)
        let result: any = x?.[0]
        if(!!tokenUris) {
            result['tokenURI'] = tokenUris?.[0] as TokenMeta
            
            const imageurl = uriToHttp(result.tokenURI.image, false)
            result.tokenURI.image = {
                url: imageurl,
                ...await fetchMediaType(imageurl)
            }
        }
        return result
}

async function main() {

    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: 'skinmigration',
            type: process.env.TYPEORM_CONNECTION as any,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            host: process.env.TYPEORM_HOST,
            port: Number.parseInt(process.env.TYPEORM_PORT),
            database: process.env.TYPEORM_DATABASE,
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, SkinEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('skinmigration')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    try {
        const assets = await connection.manager.find<AssetEntity>(AssetEntity, {})

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i]

            console.log(i, !!asset.metadata)
            if (!asset.metadata) {
                asset.metadata = await getNft('1285', asset.assetType.valueOf(), asset.assetAddress, asset.assetId)
                console.log('...updated')
            }

            await connection.manager.update<AssetEntity>(AssetEntity, { hash: asset.hash }, { metadata: asset.metadata})
        }

    } catch (err) {
        console.log(err)
    }
    await connection.close()
    process.exit(0);
}


main()
