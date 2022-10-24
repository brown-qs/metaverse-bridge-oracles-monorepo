import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'
import { execSync } from "child_process"
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
import { promises as fs } from 'fs';
import path from "path"
import { SyntheticItemLayerEntity } from '../src/syntheticitemlayer/syntheticitemlayer.entity'
import { syntheticPartToDto } from '../src/compositeapi/compositeapi.utils'
import { CompositeConfigDto, CompositeConfigLayer } from '../src/compositeapi/dtos/index.dto'
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("zindexshitshow")
    const result = await connection.manager.findOne<CompositeCollectionFragmentEntity>(CompositeCollectionFragmentEntity, { collection: { chainId: 1, assetAddress: "0xac5c7493036de60e63eb81c5e9a440b42f47ebf5"?.toLowerCase() } }, { relations: ["syntheticParts", "collection", "syntheticParts.items", "syntheticParts.items.layers", "compositeParts"] })
    if (!result) {
        throw new Error("This asset is not permissioned for customization.")
    }

    const resp: CompositeConfigDto = {
        chainId: result.collection.chainId,
        assetAddress: result.collection.assetAddress,
        assetType: result.collection.assetType,
        name: result.collection.name,
        parts: result.syntheticParts.map(p => syntheticPartToDto(p, result.collection.chainId)).filter(p => !!p)
    }
    const exoMeta = await fs.readFile("/Users/me/Desktop/exo_metadata/allmeta.json")
    const exoMetadata = JSON.parse(exoMeta.toString())
    
    let allLayers: CompositeConfigLayer[] = []
    for(const exoMeta of exoMetadata){
        console.log(JSON.stringify(exoMeta))

        for(const trait of exoMeta){
            if(["Eyes", "Gen", "Breed Counter"].includes(trait.trait_type)){
                continue
            }
            if(["Expression", "Vibe"].includes(trait.trait_type)){
                continue
            }
            const matchingPart = resp.parts.find(p=> p.name === trait.trait_type)
            if(!matchingPart){
                console.log(`Couldn't find matching synthetic part for ${trait.trait_type}` )
                process.exit()
            }
            if(!matchingPart.items){
                console.log(JSON.stringify(matchingPart))
            }
            const item = matchingPart.items.find(i => i.attributes[0].value === trait.value)
            allLayers = [...allLayers, ...item.layers]
        }
    }
    console.log(JSON.stringify(allLayers,null,4))


    process.exit(0);
}


main()
