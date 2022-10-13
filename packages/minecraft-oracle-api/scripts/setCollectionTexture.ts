

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
import { Oauth2AuthorizationEntity } from '../src/oauth2api/oauth2-authorization/oauth2-authorization.entity'
import { Oauth2ClientEntity } from '../src/oauth2api/oauth2-client/oauth2-client.entity'
import { ZUserAssetView, ZUserBaitView } from '../src/views'

import * as fs from 'fs'
import { TextureType } from '../src/texture/texturetype.enum'
import { StringAssetType } from '../src/common/enums/AssetType'

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

    const textureData = 'ewogICJ0aW1lc3RhbXAiIDogMTY2NTI2NzczODMxMSwKICAicHJvZmlsZUlkIiA6ICIwNTkyNTIxZGNjZWE0NzRkYjE0M2NmMDg2MDA1Y2FkNyIsCiAgInByb2ZpbGVOYW1lIiA6ICJwdXIyNCIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS9kODlhMzMxNTYxNDlmMTgwNmQ1ZTljMDdmMTk1NTI5N2YyN2VhMmRiYzA5YzFhZTllOGFmNDM3ODk4NTFhZGNhIgogICAgfQogIH0KfQ=='
    const textureSignature = 'snHainjsdPPaH3UCK/s5WBTCsHlEZMer2DUY22IbEVzWmj5aOzy7aF1ysez4urLCu3nc3T1hgxcRZ5lv5m8WcVPn474v225bgHRlmWlRWdwZ3jNZKuRtWBD+MQtLxvYkgGklHyV8eIJQitxXxt8vVAfanc8gIwGtam67ny4daD0w4hQnQrYE291SGD2pZdLHMUg6jTD52qMTX8OcCO6R0Enf+ZTB2RHV3mrLBErcYKu8HknDgSNPvC0MCfNXK2C/nfCIyGD98KiVWNOn9mW7AOhvhAWr7SZJE+HVJ4C6iCkkv7iA5q0Fom4RBDSzFqVHbRWGga8ibhbf8Mvvo9oJ7ezQx3xesDLC9gv8nEuICJ/7uyKJLH4jfkm5r5YIVRswLbRzg0f+p0BjttPy/agcbAjQRmBe+cx0t5LQ2cs5FT/ZWuG0PEfXAkmMDRg9LcY+4hwkGYOVzMXdVSNCg7i7sokDFEhQaXmnmvwTxaNvjNrslgpMWQU9OJFoIFOdzGUztBBOxgmAlXmNWKW0lO3IJvtOnA4zUF/P1mMWun85SJh4+n1ZZmEbzuKoRk7qgc4gTRBUlVQvztHb5JGx/T2tLkO4PrBONGgpLdKa3aE2zUYZSNlJhYbzIOKs/mYlh7eq5Y+WHQ/47FddKlbB8l9dvDLX84wnfTNpGwrDpGfllF8='
    const name = 'Gromlin'
    const assetType = StringAssetType.ERC721

    const assetAddress = '0xf27a6c72398eb7e25543d19fda370b7083474735'
    for (let i = 1; i <= 3333; i++) {
        console.log(i)
        const assetId = i.toString()

        await connection.manager.getRepository(TextureEntity).save({
            assetType,
            textureData,
            textureSignature,
            assetAddress,
            assetId,
            gamepass: false,
            name,
            type: TextureType.SKIN,
            auction: false
        })
    }
    await connection.close()
}


main()






