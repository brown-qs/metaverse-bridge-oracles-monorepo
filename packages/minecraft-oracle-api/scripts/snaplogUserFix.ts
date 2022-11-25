import { config } from 'dotenv'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'

import { getDatabaseConnection } from './common'
import { promises as fs } from 'fs';
import path from "path"
import { SyntheticItemLayerEntity } from '../src/syntheticitemlayer/syntheticitemlayer.entity'
import { syntheticPartToDto } from '../src/compositeapi/compositeapi.utils'
import { CompositeConfigDto, CompositeConfigLayer } from '../src/compositeapi/dtos/index.dto'
import sharp from "sharp"
import axios from "axios"
import Jimp from 'jimp/es';
import { execSync } from "child_process"
import { AssetEntity } from '../src/asset/asset.entity';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity';
import { ILike, IsNull, Like } from 'typeorm';
import { ResourceInventoryOffset } from '../src/assetapi/dtos/resourceinventoryoffset.dto';
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity';
import { of } from 'fp-ts/lib/ReaderT';
import { SnaplogEntity } from '../src/snaplog/snaplog.entity';
import { UserEntity } from '../src/user/user/user.entity';
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity';
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity';

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("snaploguserfix")
    const results = await connection.manager.find<SnaplogEntity>(SnaplogEntity, { where: { user: IsNull() }, relations: ["game"] })

    for (const entry of results) {
        const originalUuid = entry.id.split("-")[0]
        const user = await connection.manager.findOne<UserEntity>(UserEntity, { uuid: originalUuid })
        if (!!user) {
            await connection.manager.update<SnaplogEntity>(SnaplogEntity, { id: entry.id }, { user })
        } else {
            //mc user that has migrated
            const gameTime = parseInt(entry.game.startedAt)
            const mcUuid = await connection.manager.findOne<MinecraftUuidEntity>(MinecraftUuidEntity, { where: { minecraftUuid: originalUuid } })
            const mcLinks = await connection.manager.find<MinecraftLinkEntity>(MinecraftLinkEntity, { where: { minecraftUuid: mcUuid }, order: { linkedAt: "ASC" }, relations: ["user"] })
            const linkTime = mcLinks[0].linkedAt.getTime()

            if (gameTime < linkTime) {
                console.log(`Game happened before first time mc account was linked game time: ${new Date(gameTime).toISOString()} link time: ${new Date(linkTime).toISOString()}`)
                const newId = entry.id.replace(`${originalUuid}-`, `${mcLinks[0].user.uuid}-`)
                console.log(`Changing: ${entry.id} > ${newId}`)
                await connection.manager.update<SnaplogEntity>(SnaplogEntity, { id: entry.id }, { user: mcLinks[0].user, id: newId })
                //violates unique constraint

            } else {
                console.log(`UH OH game happened after first time mc account was linked ${new Date(gameTime).toISOString()} link time: ${new Date(linkTime).toISOString()}`)
            }
        }
    }
    console.log("FINISHED!")
}



main()

