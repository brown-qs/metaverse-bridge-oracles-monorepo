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
import { ChainEntity } from '../src/chain/chain.entity'
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
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { ResourceInventoryService } from '../src/resourceinventory/resourceinventory.service'
config()

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
                UserEntity,
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
                ResourceInventoryEntity
            ],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('assetwire')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    try {
        const assets = await connection.manager.find<AssetEntity>(AssetEntity, { relations: ['collectionFragment', 'collectionFragment.collection', 'resourceInventory', 'owner'], loadEagerRelations: true })

        for (let i = 0; i < assets.length; i++) {
            console.log(i)
            const asset = assets[i]

            console.log(i, asset.resourceInventory)

            try {
                if (!asset.resourceInventory) {
                    console.log('    fetching RI...')
                    const ri = await connection.manager.findOne<ResourceInventoryEntity>(ResourceInventoryEntity, {
                        where: {
                            id: ResourceInventoryService.calculateId({
                                assetAddress: asset.collectionFragment.collection.assetAddress,
                                assetId: asset.assetId,
                                uuid: asset.owner.uuid,
                                chainId: asset.collectionFragment.collection.chainId
                            })
                        }
                    })

                    if (!!ri) {
                        console.log('    saving...')
                        asset.resourceInventory = ri
                        const x = await connection.manager.save<AssetEntity>(asset)
                        console.log('    success:', !!x)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    } catch (err) {
        console.log(err)
    }
    await connection.close()
    process.exit(0);
}

main()
