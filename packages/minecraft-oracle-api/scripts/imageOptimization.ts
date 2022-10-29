import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'
import { exec, execSync } from "child_process"
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
import PQueue from "p-queue"
import path from "path"
import { SyntheticItemLayerEntity } from '../src/syntheticitemlayer/syntheticitemlayer.entity'
config()

async function main() {
    const q = new PQueue({ concurrency: 100 })
    q.on("idle", () => {
        console.log("Were finished!")
    })
    const images = await getDirRecursive("/Users/me/Downloads/0xac5c7493036de60e63eb81c5e9a440b42f47ebf5")

    for (const img of images) {
        q.add(() => processImage(img.path))
    }
    async function processImage(imagePath: string) {
        if (imagePath.includes("_original.png") || imagePath.includes("_small.png")) {
            throw new Error("nope")
        }
        const originalPath = imagePath.replace(".png", "_original.png")
        const smallPath = imagePath.replace(".png", "_small.png")

        const origExists = await fs.stat(originalPath).then(() => true).catch(() => false);
        const smallExists = await fs.stat(smallPath).then(() => true).catch(() => false);

        if (!origExists) {
            console.log("COPYING ORIG")
            await fs.copyFile(imagePath, originalPath)
        }

        if (!smallExists) {
            console.log("COPYING SMALL")
            await fs.copyFile(originalPath, smallPath)
        }
        await exec(`sips -Z 128 ${smallPath}`)

    }

    //  process.exit(0);
}

var getDirRecursive = async (dir: any) => {
    try {
        const items = await fs.readdir(dir);
        let files: any = [];
        for (const item of items) {
            if ((await fs.lstat(`${dir}/${item}`)).isDirectory()) files = [...files, ...(await getDirRecursive(`${dir}/${item}`))];
            else files.push({ file: item, path: `${dir}/${item}`, parents: dir.split("/") });
        }
        return files;
    } catch (e) {
        return e
    }
};

var snakeCase = (string: string) => {
    return string
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join('_');
};



main()
