import { Connection, createConnection, getConnection } from "typeorm";
import { AchievementEntity } from "../src/achievement/achievement.entity";
import { AssetEntity } from "../src/asset/asset.entity";
import { BlacklistLogEntity } from "../src/blacklist-log/blacklist-log.entity";
import { ChainEntity } from "../src/chain/chain.entity";
import { CollectionEntity } from "../src/collection/collection.entity";
import { CollectionFragmentEntity } from "../src/collectionfragment/collectionfragment.entity";
import { CollectionFragmentRoutingEntity } from "../src/collectionfragmentrouting/collectionfragmentrouting.entity";
import { CompositeAssetEntity } from "../src/compositeasset/compositeasset.entity";
import { CompositeCollectionFragmentEntity } from "../src/compositecollectionfragment/compositecollectionfragment.entity";
import { CompositePartEntity } from "../src/compositepart/compositepart.entity";
import { GameEntity } from "../src/game/game.entity";
import { GameItemTypeEntity } from "../src/gameitemtype/gameitemtype.entity";
import { GameScoreTypeEntity } from "../src/gamescoretype/gamescoretype.entity";
import { GameTypeEntity } from "../src/gametype/gametype.entity";
import { GganbuEntity } from "../src/gganbu/gganbu.entity";
import { MaterialEntity } from "../src/material/material.entity";
import { Oauth2ClientEntity } from "../src/oauth2api/oauth2-client/oauth2-client.entity";
import { PlayerAchievementEntity } from "../src/playerachievement/playerachievement.entity";
import { PlayerGameItemEntity } from "../src/playergameitem/playergameitem.entity";
import { InventoryEntity } from "../src/playerinventory/inventory.entity";
import { PlayerScoreEntity } from "../src/playerscore/playerscore.entity";
import { PlaySessionEntity } from "../src/playsession/playsession.entity";
import { PlaySessionStatEntity } from "../src/playsession/playsessionstat.entity";
import { ResourceInventoryEntity } from "../src/resourceinventory/resourceinventory.entity";
import { ResourceInventoryOffsetEntity } from "../src/resourceinventoryoffset/resourceinventoryoffset.entity";
import { SkinEntity } from "../src/skin/skin.entity";
import { SnaplogMergeEntity } from "../src/snaplog-merge/snaplog-merge.entity";
import { SnaplogEntity } from "../src/snaplog/snaplog.entity";
import { SnapshotItemEntity } from "../src/snapshot/snapshotItem.entity";
import { SummonEntity } from "../src/summon/summon.entity";
import { SyntheticItemEntity } from "../src/syntheticitem/syntheticitem.entity";
import { SyntheticItemLayerEntity } from "../src/syntheticitemlayer/syntheticitemlayer.entity";
import { SyntheticPartEntity } from "../src/syntheticpart/syntheticpart.entity";
import { TextureEntity } from "../src/texture/texture.entity";
import { DidEntity } from "../src/user/did/did.entity";
import { EmailChangeEntity } from "../src/user/email-change/email-change.entity";
import { EmailLoginKeyEntity } from "../src/user/email-login-key/email-login-key.entity";
import { EmailEntity } from "../src/user/email/email.entity";
import { KiltDappEntity } from "../src/user/kilt-dapp/kilt-dapp.entity";
import { KiltSessionEntity } from "../src/user/kilt-session/kilt-session.entity";
import { MinecraftLinkEntity } from "../src/user/minecraft-link/minecraft-link.entity";
import { MinecraftUserNameEntity } from "../src/user/minecraft-user-name/minecraft-user-name.entity";
import { MinecraftUuidEntity } from "../src/user/minecraft-uuid/minecraft-uuid.entity";
import { UserEntity } from "../src/user/user/user.entity";

export const getDatabaseConnection = async (connectionName: string): Promise<Connection> => {

    if (typeof connectionName !== "string") {
        throw new Error("connectionName must be a string")
    }

    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: connectionName,
            type: process.env.TYPEORM_CONNECTION as any,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            host: process.env.TYPEORM_HOST,
            port: Number.parseInt(process.env.TYPEORM_PORT),
            database: process.env.TYPEORM_DATABASE,
            entities: [SnaplogMergeEntity, BlacklistLogEntity, SyntheticItemLayerEntity, CollectionFragmentRoutingEntity, MinecraftUuidEntity, MinecraftUserNameEntity, DidEntity, KiltDappEntity, Oauth2ClientEntity, KiltSessionEntity, MinecraftLinkEntity, EmailLoginKeyEntity, EmailChangeEntity, EmailEntity, SyntheticItemEntity, SyntheticPartEntity, CompositeAssetEntity, ResourceInventoryOffsetEntity, ResourceInventoryEntity, CompositeCollectionFragmentEntity, CompositePartEntity, CollectionFragmentEntity, CollectionEntity, GameScoreTypeEntity, PlayerGameItemEntity, GameItemTypeEntity, SnaplogEntity, GganbuEntity, GameTypeEntity, PlayerScoreEntity, PlayerAchievementEntity, AchievementEntity, GameEntity, ChainEntity, MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, SkinEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity],
            synchronize: true
        })
    } catch (err) {
        console.log("Database error: ", err)
        connection = getConnection(connectionName)
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }
    return connection
}