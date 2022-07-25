

import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection, IsNull, Not } from 'typeorm'

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
import { PlaySessionStatService } from '../src/playsession/playsessionstat.service'
import { GameEntity } from '../src/game/game.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'
import { RecognizedAssetType } from '../src/config/constants'
import { ChainEntity } from '../src/chain/chain.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { GameItemTypeEntity } from '../src/gameitemtype/gameitemtype.entity'
import { GameScoreTypeEntity } from '../src/gamescoretype/gamescoretype.entity'
import { PlayerGameItemEntity } from '../src/playergameitem/playergameitem.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { DidEntity } from '../src/user/did/did.entity'
import { EmailChangeEntity } from '../src/user/email-change/email-change.entity'
import { EmailLoginKeyEntity } from '../src/user/email-login-key/email-login-key.entity'
import { EmailEntity } from '../src/user/email/email.entity'
import { KiltDappEntity } from '../src/user/kilt-dapp/kilt-dapp.entity'
import { KiltSessionEntity } from '../src/user/kilt-session/kilt-session.entity'
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity'
import { MinecraftUserNameEntity } from '../src/user/minecraft-user-name/minecraft-user-name.entity'
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity'
import { UserRole } from '../src/common/enums/UserRole'

import * as fs from 'fs'

config()

async function main() {
    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: 'materialseeder',
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
                ResourceInventoryEntity,
                ResourceInventoryOffsetEntity,
                EmailEntity,
                KiltSessionEntity,
                KiltDappEntity,
                DidEntity,
                EmailChangeEntity,
                EmailLoginKeyEntity,
                MinecraftLinkEntity,
                MinecraftUserNameEntity,
                MinecraftUuidEntity
            ],
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }


    const materials = fs.readFileSync(__dirname + '/skin-list.csv').toString().split("\n").slice(1);

    let itercounter = 1
    const assetAddress = '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a'
    for (const line of materials) {
        const fragments = line.split(',')
        const assetId = fragments[0].split('.png')[0]
        console.log(fragments[0].split('.png')[0])

        const textureData = fragments[3]
        const textureSignature = fragments[4]

        //console.log( textureData, textureSignature)

        const texture = await connection.manager.getRepository(TextureEntity).findOne({ where: {assetAddress, assetId }})

        await connection.manager.getRepository(TextureEntity).update(texture, { textureData, textureSignature})
    }
    await connection.close()
}


main()






