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

config()

const list = [
    'NagyKiki',
    'OldSpiceVendor',
    'Kyilkhor',
]

const gameId = 'minecraft-carnage-2022-03-13'
const targetTime = '2700000'
const msamasOnly = true

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

    let itercounter = 1
    while (true) {

        console.log('starting iteration', itercounter)

        const allUsers = await connection.manager.getRepository(UserEntity).find({ where: {email: Not(IsNull())}, loadEagerRelations: true, relations: ['assets', 'assets.collectionFragment', 'assets.collectionFragment.collection'] })

        for (let i = 0; i < allUsers.length; i++) {

            const user = allUsers[i]
            const assets = user.assets
            let counter = 0
            let allowedToPlay = false

            if (!user.email?.email) {
                continue
            }
            console.log(user.email?.email ?? user.userName)

            assets.map(asset => {
                if (asset.collectionFragment.collection.assetAddress === '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a') {
                    counter += 1
                    allowedToPlay = true
                    return
                }

                if (asset.collectionFragment.collection.assetAddress === '0xdea45e7c6944cb86a268661349e9c013836c79a2') {
                    counter += 1
                    allowedToPlay = true
                    return
                }

                if (asset.collectionFragment.collection.assetAddress === '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a') {
                    counter += 1
                    allowedToPlay = true
                    return
                }

                if (asset.collectionFragment.collection.assetAddress === '0x1974eeaf317ecf792ff307f25a3521c35eecde86' && asset.assetId === '1') {
                    counter += 1
                    allowedToPlay = true
                    return
                }

                if (asset.collectionFragment.collection.assetAddress === '0x0000000000000000000000000000000000000001') {
                    counter += 1
                    allowedToPlay = true
                    return
                }
            })

            user.allowedToPlay = allowedToPlay
            user.numGamePassAsset = counter
            if (user.allowedToPlay && user.role.valueOf() !== UserRole.ADMIN.valueOf()) {
                user.role = UserRole.PLAYER
            } else {
                user.role = user.role.valueOf() === UserRole.ADMIN.valueOf() ? UserRole.ADMIN : UserRole.NONE
            }

            await connection.manager.getRepository(UserEntity).update(user.uuid, { allowedToPlay: user.allowedToPlay, role: user.role, numGamePassAsset: user.numGamePassAsset })
        }

        console.log('sleeping...')
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('woke up...')
        itercounter++
    }
    await connection.close()
}


main()






