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
import { GameEntity } from '../src/game/game.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'
import { GameItemTypeEntity } from '../src/gameitemtype/gameitemtype.entity'
import { PlayerGameItemEntity } from '../src/playergameitem/playergameitem.entity'
import { GameScoreTypeEntity } from '../src/gamescoretype/gamescoretype.entity'
import { ChainEntity } from '../src/chain/chain.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { BigNumber } from 'ethers'
import { EmailEntity } from '../src/user/email/email.entity'
import { KiltSessionEntity } from '../src/user/kilt-session/kilt-session.entity'
import { KiltDappEntity } from '../src/user/kilt-dapp/kilt-dapp.entity'
import { DidEntity } from '../src/user/did/did.entity'
import { EmailChangeEntity } from '../src/user/email-change/email-change.entity'
import { EmailLoginKeyEntity } from '../src/user/email-login-key/email-login-key.entity'
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity'
import { MinecraftUserNameEntity } from '../src/user/minecraft-user-name/minecraft-user-name.entity'
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity'
import { Oauth2AuthorizationEntity } from '../src/oauth2api/oauth2-authorization/oauth2-authorization.entity'
import { Oauth2ClientEntity } from '../src/oauth2api/oauth2-client/oauth2-client.entity'
import { ZUserAssetView, ZUserBaitView } from '../src/views'
import { RecognizedAssetType } from '../src/config/constants'

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
                EmailChangeEntity,
                MinecraftLinkEntity,
                KiltSessionEntity,
                EmailLoginKeyEntity,
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
                ZUserAssetView,
                MinecraftUserNameEntity,
                MinecraftUuidEntity,
                EmailEntity,
                DidEntity,
                KiltDappEntity,
                Oauth2ClientEntity,
                Oauth2AuthorizationEntity,
                ZUserBaitView
            ],
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }
    const users = await connection.manager.getRepository(UserEntity).find({ relations: ['assets', 'assets.collectionFragment', 'assets.collectionFragment.collection'], loadEagerRelations: true })

    for (let i = 0; i < users.length; i++) {

        const user = users[i]

        if (!user.assets || user.assets.length === 0) {
            continue
        }

        const MAP: {[key: string]: any} = {
            '0xf27a6c72398eb7e25543d19fda370b7083474735': {
                name: 'Gromlin',
                type: RecognizedAssetType.GROMLIN
            },
            '0xac5c7493036de60e63eb81c5e9a440b42f47ebf5': {
                name: 'Exosama',
                type: RecognizedAssetType.EXOSAMA
            }
        }

        console.log(user?.minecraftUserName ?? user?.gamerTag ?? user?.uuid)
        for (let j = 0; j < user.assets.length; j++) {
            const asset = user.assets[j]
            if (asset.pendingIn) {
                continue
            }
            
            const assetAddress = asset.collectionFragment.collection.assetAddress
            const assetId = asset.assetId

            if (!MAP[assetAddress]) {
                continue
            }

            console.log('    ', assetAddress, assetId, asset.recognizedAssetType)

            const texture = await connection.manager.getRepository(TextureEntity).findOne({ where: { assetAddress, assetId } })
            if (!!texture) {
                await connection.manager.getRepository(SkinEntity).save(
                    { id: SkinEntity.toId(user.uuid, assetAddress, assetId), owner: user, texture }
                )
                console.log('    skin set')
            }
            const rat = MAP[assetAddress.toLowerCase()]?.type.valueOf()
            if (!asset.recognizedAssetType || (asset.recognizedAssetType.valueOf() !== rat && !!rat)) {
                await connection.manager.getRepository(AssetEntity).update({}, {recognizedAssetType: MAP[assetAddress.toLowerCase()].type})
                console.log('    assset type set')
            }
        }
    }
    await connection.close()
}


main()