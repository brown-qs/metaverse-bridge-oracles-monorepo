import * as fs from 'fs'

import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

import { config } from 'dotenv'
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity'
import { MinecraftUserEntity } from '../src/user/minecraft-user/minecraft-user.entity'
import { TextureEntity } from '../src/texture/texture.entity'
import { AssetEntity } from '../src/asset/asset.entity'
import { SummonEntity } from '../src/summon/summon.entity'
import { InventoryEntity } from '../src/playerinventory/inventory.entity'
import { PlaySessionEntity } from '../src/playsession/playsession.entity'
import { PlaySessionStatEntity } from '../src/playsession/playsessionstat.entity'
import { SkinEntity } from '../src/skin/skin.entity'
import uriToHttp, { getTokenStaticCalldata, processTokenStaticCallResults, stringToStringAssetType, fetchUrlCallback } from '../src/nftapi/nftapi.utils'
import { Asset, TokenMeta } from '../src/nftapi/nftapi.types'
import { fromStream } from 'file-type'
import { ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts';
import { Interface } from 'ethers/lib/utils'
import { MULTICALL_ADDRESSES } from '../src/config/constants'
import { MULTICALL_ABI } from '../src/common/contracts/Multicall'
import fetch from 'node-fetch'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { ChainEntity } from '../src/chain/chain.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { GameEntity } from '../src/game/game.entity'
import { GameItemTypeEntity } from '../src/gameitemtype/gameitemtype.entity'
import { GameScoreTypeEntity } from '../src/gamescoretype/gamescoretype.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerGameItemEntity } from '../src/playergameitem/playergameitem.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'

config()

async function tryMultiCallCore(
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

    const client = new ethers.providers.JsonRpcProvider('https://moonriver-rpc.moonsama.com');
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
    if (!!tokenUris) {
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
            entities: [
                MinecraftUserEntity,
                SnapshotItemEntity,
                InventoryEntity,
                TextureEntity,
                SkinEntity,
                PlayerScoreEntity,
                MaterialEntity,
                GameEntity,
                GameTypeEntity,
                AchievementEntity,
                PlayerAchievementEntity,
                SecretEntity,
                AssetEntity,
                SummonEntity,
                PlaySessionEntity,
                PlaySessionStatEntity,
                GganbuEntity,
                SnaplogEntity,
                GameItemTypeEntity,
                PlayerGameItemEntity,
                GameScoreTypeEntity,
                ChainEntity,
                CollectionEntity,
                CollectionFragmentEntity,
                CompositeCollectionFragmentEntity,
                CompositeAssetEntity,
                CompositePartEntity,
                SyntheticPartEntity,
                SyntheticItemEntity,
                ResourceInventoryEntity,
                ResourceInventoryOffsetEntity
            ],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('skinmigration')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    try {
        const assets = await connection.manager.find<AssetEntity>(AssetEntity, { loadEagerRelations: true, relations: ['collectionFragment', 'collectionFragment.collection'] })

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i]

            console.log(i, !!asset.metadata)
            if (!asset.metadata || Object.keys(asset.metadata).length === 0) {
                asset.metadata = await getNft('1285', asset.collectionFragment.collection.assetType.valueOf(), asset.collectionFragment.collection.assetAddress, asset.assetId)
                console.log('...updated')
            }

            await connection.manager.update<AssetEntity>(AssetEntity, { hash: asset.hash }, { metadata: asset.metadata })
        }

    } catch (err) {
        console.log(err)
    }
    await connection.close()
    process.exit(0);
}


main()
