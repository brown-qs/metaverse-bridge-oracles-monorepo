import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

import { config } from 'dotenv'
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity'
import { UserEntity } from '../src/user/user/user.entity'
import { TextureEntity } from '../src/texture/texture.entity'
import { AssetEntity } from '../src/asset/asset.entity'
import { SummonEntity } from '../src/summon/summon.entity'
import { InventoryEntity } from '../src/playerinventory/inventory.entity'
import { PlaySessionEntity } from '../src/playsession/playsession.entity'
import { PlaySessionStatEntity } from '../src/playsession/playsessionstat.entity'
import { SkinEntity } from '../src/skin/skin.entity'
import { MetaAsset } from '../src/oracleapi/oracleapi.types'
import { Contract, ethers } from 'ethers'
import { ChainEntity } from '../src/chain/chain.entity'
import { METAVERSE_ABI } from '../src/common/contracts/Metaverse'
import { GameEntity } from '../src/game/game.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'
import { GameItemTypeEntity } from '../src/gameitemtype/gameitemtype.entity'
import { PlayerGameItemEntity } from '../src/playergameitem/playergameitem.entity'
import { GameScoreTypeEntity } from '../src/gamescoretype/gamescoretype.entity'
import { ApolloClient, InMemoryCache, NormalizedCacheObject, HttpLink, gql, ApolloError } from '@apollo/client';
import fetch from 'cross-fetch';
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { Oauth2ClientEntity } from '../src/oauth2api/oauth2-client/oauth2-client.entity'
import { EmailChangeEntity } from '../src/user/email-change/email-change.entity'
import { EmailLoginKeyEntity } from '../src/user/email-login-key/email-login-key.entity'
import { EmailEntity } from '../src/user/email/email.entity'
import { KiltSessionEntity } from '../src/user/kilt-session/kilt-session.entity'
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity'
import { KiltDappEntity } from '../src/user/kilt-dapp/kilt-dapp.entity'
import { DidEntity } from '../src/user/did/did.entity'
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity'
import { MinecraftUserNameEntity } from '../src/user/minecraft-user-name/minecraft-user-name.entity'
import { getDatabaseConnection } from './common'
import { RecognizedAssetType } from '../src/config/constants'
import dayjs from "dayjs"
import { standardizeValidateAssetInParams } from '../src/oracleapi/oracleapi.utils'
import { METAVERSE_V2_ABI } from '../src/common/contracts/MetaverseV2'
config()
const PAGE_SIZE = 100
async function main() {


    //  console.log(JSON.stringify(process.env))
    //  process.exit()

    const connection = await getDatabaseConnection("indexerComparer")

    /*
https://squid.subsquid.io/moonsama-multiverse/graphql
https://squid.subsquid.io/exosama-squid/graphql
https://squid.subsquid.io/raresama-moonbeam/graphql
    */
    const indexers = [
        //   "https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/multiverse-bridge-v2"
        "https://moonbeam-subgraph.moonsama.com/subgraphs/name/moonsama/multiverse-bridge-v2",
        "https://mainnet-subgraph.moonsama.com/subgraphs/name/moonsama/multiverse-bridge-v2",
    ]
    for (const indexer of indexers) {
        const client = new ApolloClient({
            link: new HttpLink({ uri: indexer, fetch }),
            cache: new InMemoryCache(),
        });

        let metaAssets: any = []
        let page = 0
        while (true) {
            const query = gql`{
                metaAssets(first: ${PAGE_SIZE}, skip: ${page * PAGE_SIZE}, where: {active: true}, orderBy: modifiedAt) {
                  salt
                  owner {
                    id
                  }
                  id
                  burned
                  asset {
                    assetId
                    assetAddress
                    assetType
                  }
                  amount
                  active
                  modifiedAt
                }
              }`
            let result
            try {
                result = await client.query(
                    {
                        query
                    }
                )
                //   console.log(JSON.stringify(result, null, 4))
            } catch (e) {
                const error = e as ApolloError
                console.log(JSON.stringify(error))
                console.log("======= EXITING =======")
                process.exit(-1)
            }
            page++
            const newMetaAssets = result.data.metaAssets
            metaAssets = [...metaAssets, ...newMetaAssets]
            if (newMetaAssets.length < PAGE_SIZE) {
                break
            }
        }
        console.log(`There are ${metaAssets.length} bridged assets according to the indexer, now checking to make sure they are in the database:`)
        const notFoundAssetIds = []
        const notFoundHashes = []
        let count = 0
        for (let i = 0; i < metaAssets.length; i++) {
            const mAsset = metaAssets[i]
            // console.log(JSON.stringify(mAsset, null, 4))
            /*
    {
        "__typename": "MetaAsset",
        "salt": "0x40af29666bf1359f9b9e7fbafd67f92231edc5a93a46874dbf1a03a583cd4d1a",
        "owner": {
            "__typename": "User",
            "id": "0xb3d35f151c87281658671bb7cc34feb107a52ff7"
        },
        "id": "0x007f3bb9f7a87c1bbb3073f1dc7abc9ea00a1248f32ce3f8f92d1567a302b20e",
        "burned": false,
        "asset": {
            "__typename": "Asset",
            "assetId": "2254",
            "assetAddress": "0xf27a6c72398eb7e25543d19fda370b7083474735"
            "assetType": "ERC721"
        },
        "amount": "1",
        "active": true
    }
            */
            // console.log(JSON.stringify(mAsset, null, 4))
            //console.log(`Checking that meta asset #${i} is in database...`)
            const assetTypes = ["UNKNOWN", "NATIVE", "ERC20", "ERC721", "ERC1155"]
            const assetId = mAsset.asset.assetId
            const modifiedAtDate = new Date(mAsset.modifiedAt * 1000)
            const timeDiff = new Date().getTime() - mAsset.modifiedAt * 1000
            const olderThanOneDay = timeDiff > 1000 * 60 * 60 * 24
            const modifiedAtPretty = dayjs(modifiedAtDate).format()
            const assetEntity = await connection.manager.findOne<AssetEntity>(AssetEntity, { hash: mAsset.id })
            const collection = await connection.manager.findOne<CollectionEntity>(CollectionEntity, { assetAddress: mAsset.asset.assetAddress.toLowerCase() }, { relations: ["chain"] })
            // const standardizedAsset = standardizeValidateAssetInParams(collection.chain.chainId, assetTypes.indexOf(mAsset.asset.assetType), mAsset.asset.assetAddress.toLowerCase(), parseInt(assetId), mAsset.amount, mAsset.burned, mAsset.owner.id.toLowerCase())
            if (!collection) {
                throw new Error(`Couldn't find recognized collection for asset ${mAsset.asset.assetAddress.toLowerCase()}`)
            }
            if (!!assetEntity) {
                console.log(`✅\t${collection.name}\t#${assetId}\t${modifiedAtPretty}\tin the datbase`)
            } else {
                notFoundAssetIds.push(assetId)
                notFoundHashes.push(mAsset.id)
                console.log(`❌\t${collection.name}\t#${assetId}\t${modifiedAtPretty}\tNOT in the datbase`)
                if (olderThanOneDay) {
                    console.log("Older than a day and not in the database, unstaking...")
                    console.log(JSON.stringify(collection, null, 4))
                    const client = new ethers.providers.JsonRpcProvider(collection.chain.rpcUrl);

                    const oracle = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, client);
                    const contract = new Contract(collection.chain.multiverseV2Address, METAVERSE_V2_ABI, oracle)
                    //   await contract.unstake([mAsset.id])
                }

            }
        }
        console.log(`Not found asset ids: ${notFoundAssetIds.join(", ")} Hashes: ${notFoundHashes.join(", ")} `)
    }


    process.exit(0);
}

main()
