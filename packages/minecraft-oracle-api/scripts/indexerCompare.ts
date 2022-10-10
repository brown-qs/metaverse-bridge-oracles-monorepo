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
config()

async function main() {

    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: 'indexercompare',
            type: process.env.TYPEORM_CONNECTION as any,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            host: process.env.TYPEORM_HOST,
            port: Number.parseInt(process.env.TYPEORM_PORT),
            database: process.env.TYPEORM_DATABASE,
            entities: [GameScoreTypeEntity, PlayerGameItemEntity, GameItemTypeEntity, SnaplogEntity, GganbuEntity, GameTypeEntity, PlayerScoreEntity, PlayerAchievementEntity, AchievementEntity, GameEntity, ChainEntity, MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, SkinEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('indexercompare')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    /*
    const failed = []

    try {
        const assets = await connection.manager.find<AssetEntity>(AssetEntity, { loadEagerRelations: true })

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i]

            if (!asset.assetOwner) {
                const chainEntity = await connection.manager.findOne<ChainEntity>(ChainEntity, { chainId: asset.collectionFragment.collection.chainId })
                const contract = new Contract(chainEntity.multiverseV1Address, METAVERSE_ABI, new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl))
                console.log('hash', asset.hash)
                try {
                    const mAsset: MetaAsset = asset.enraptured ? await contract.getEnrapturedMetaAsset(asset.hash) : await contract.getImportedMetaAsset(asset.hash)
                    console.log('   address', mAsset.owner)
                    await connection.manager.update<AssetEntity>(AssetEntity, { hash: asset.hash }, { assetOwner: mAsset.owner.toLowerCase() })
                } catch (error) {
                    failed.push(asset.hash)
                }
            }
        }

    } catch (err) {
        console.log(err)
    }
    console.log('failed: ', failed)
    await connection.close()*/
    process.exit(0);
}

main()
