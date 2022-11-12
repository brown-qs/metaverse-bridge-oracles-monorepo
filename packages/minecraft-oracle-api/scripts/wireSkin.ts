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
import { UserRole } from '../src/common/enums/UserRole'
import { findRecognizedAsset } from '../src/utils/misc'
import { CollectionFragmentRoutingEntity } from '../src/collectionfragmentrouting/collectionfragmentrouting.entity'
import { SyntheticItemLayerEntity } from '../src/syntheticitemlayer/syntheticitemlayer.entity'

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
                    SyntheticItemLayerEntity,
                    CollectionFragmentRoutingEntity,
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

    const fragments = await connection.manager.getRepository(CollectionFragmentEntity).find({ relations: ['collection', 'collection.chain'], loadEagerRelations: true })

    for (let i = 0; i < users.length; i++) {

        const user = users[i]

        // if (!user.assets || user.assets.length === 0) {
        //     continue
        // }

        const displayname = user?.minecraftUserName ?? user?.gamerTag ?? user?.uuid
        console.log(displayname)
        for (let j = 0; j < user.assets.length; j++) {
            const asset = user.assets[j]
            if (asset.pendingIn) {
                continue
            }
            
            const assetAddress = asset.collectionFragment.collection.assetAddress
            const assetId = asset.assetId

            const recognizedAsset = findRecognizedAsset(fragments, {assetAddress, assetId})

            console.log('    ', assetAddress, assetId, asset.recognizedAssetType)

            const texture = await connection.manager.getRepository(TextureEntity).findOne({ where: { assetAddress, assetId } })
            if (!!texture) {
                await connection.manager.getRepository(SkinEntity).save(
                    { id: SkinEntity.toId(user.uuid, assetAddress, assetId), owner: user, texture }
                )
                console.log('    skin set')
            }
            const rat = recognizedAsset.recognizedAssetType
            const pass = recognizedAsset.gamepass
            if (!asset.recognizedAssetType || (asset.recognizedAssetType.valueOf() !== rat && !!rat)) {
                await connection.manager.getRepository(AssetEntity).update(asset.hash, {recognizedAssetType: rat})
                console.log('    assset type set', rat)
            }
        }

        const recmap = user.assets.map(asset => findRecognizedAsset(fragments, {assetAddress: asset.collectionFragment.collection.assetAddress, assetId: asset.assetId})) ?? []
        const rec = (recmap.find(cf => cf.gamepass === true))
        const numPassAssets = recmap.reduce((prev, curr) => {return (prev + (curr.gamepass ? 1: 0))}, 0)
        const hasGamePass = rec !== null && rec !== undefined

        const isAdmin = user.role?.valueOf() === UserRole.ADMIN.valueOf()

        console.log('set', displayname, hasGamePass, numPassAssets, isAdmin ? UserRole.ADMIN : (hasGamePass ? UserRole.PLAYER: UserRole.NONE))
        await connection.manager.getRepository(UserEntity).update(user.uuid, {relationsUpdatedAt: new Date(), allowedToPlay: hasGamePass, numGamePassAsset: numPassAssets, role: isAdmin ? UserRole.ADMIN: (hasGamePass ? UserRole.PLAYER: UserRole.NONE)})

        // if (user.allowedToPlay !== hasGamePass || !user.role || user.role.valueOf() === UserRole.NONE.valueOf()) {
        //     console.log('set', displayname, hasGamePass, numPassAssets, hasGamePass ? UserRole.PLAYER: UserRole.NONE)
        //     await connection.manager.getRepository(UserEntity).update(user.uuid, {allowedToPlay: hasGamePass, role: hasGamePass ? UserRole.PLAYER: UserRole.NONE})
        // }
    }
    await connection.close()
}


main()