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
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { METAVERSE_ADDRESSES, RecognizedAssetType } from '../src/config/constants'
import { checkIfIdIsRecognized } from '../src/utils'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { Oauth2AuthorizationEntity } from '../src/oauth2api/oauth2-authorization/oauth2-authorization.entity'
import { Oauth2ClientEntity } from '../src/oauth2api/oauth2-client/oauth2-client.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { DidEntity } from '../src/user/did/did.entity'
import { EmailChangeEntity } from '../src/user/email-change/email-change.entity'
import { EmailLoginKeyEntity } from '../src/user/email-login-key/email-login-key.entity'
import { EmailEntity } from '../src/user/email/email.entity'
import { KiltDappEntity } from '../src/user/kilt-dapp/kilt-dapp.entity'
import { KiltSessionEntity } from '../src/user/kilt-session/kilt-session.entity'
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity'
import { MinecraftUserNameEntity } from '../src/user/minecraft-user-name/minecraft-user-name.entity'
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity'
import { ZUserAssetView, ZUserBaitView } from '../src/views'
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
        connection = getConnection('skinmigration')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const MAP = {
        //[RecognizedAssetType.MOONSAMA.valueOf()]: '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a',
        [RecognizedAssetType.OFFHAND.valueOf()]: '0x1974eeaf317ecf792ff307f25a3521c35eecde86',
        [RecognizedAssetType.PLOT.valueOf()]: '0xa17a550871e5f5f692a69a3abe26e8dbd5991b75',
        [RecognizedAssetType.TEMPORARY_TICKET.valueOf()]: '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a',
        [RecognizedAssetType.TICKET.valueOf()]: '0x1974eeaf317ecf792ff307f25a3521c35eecde86',
        [RecognizedAssetType.WEAPON_SKIN.valueOf()]: '0x1974eeaf317ecf792ff307f25a3521c35eecde86'
    }

    try {
        const assets = await connection.manager.find<AssetEntity>(AssetEntity, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

        const client = new ethers.providers.JsonRpcProvider('https://moonriver-rpc.moonsama.com');
        const oracle = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, client);
        const m = new Contract(METAVERSE_ADDRESSES[1285], METAVERSE_ABI, oracle)

        const dangling = []

        for (let i = 0; i < assets.length; i++) {
            console.log(i)
            const asset = assets[i]
            try {
                const entry = asset.enraptured ? await m.getEnrapturedMetaAsset(asset.hash) : await m.getImportedMetaAsset(asset.hash)
                const assetAddress = entry.asset.assetAddress.toLowerCase() as string
                const assetId = entry.asset.assetId.toString() as string
                const cfs = await connection.manager.find<CollectionFragmentEntity>(CollectionFragmentEntity, { where: { collection: { chainId: 1285, assetAddress } }, relations: ['collection', 'bridgeAssets'], loadEagerRelations: true })

                const cf = cfs.find(x => {
                    return checkIfIdIsRecognized(x.idRange, { assetAddress, assetId })
                })
                if (cf) {
                    console.log('    FOUND', cf.recognizedAssetType, cf.collection.assetType, cf.collection.assetAddress, assetId)
                    const res = await connection.manager.update<AssetEntity>(AssetEntity, asset.hash, { collectionFragment: cf })
                    console.log('    ', 'update:', res.affected > 0)
                } else {
                    console.log('    DANGLING asset', assetAddress, assetId)
                    dangling.push(`${asset.hash}-${assetAddress}-${assetId}`)
                }

            } catch (error) {
                console.log(error)
            }
        }
        console.log(dangling)

    } catch (err) {
        console.log(err)
    }
    await connection.close()
    process.exit(0);
}

main()
