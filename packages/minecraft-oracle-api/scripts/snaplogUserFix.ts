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
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity';
import { ILike, IsNull, Like } from 'typeorm';
import { ResourceInventoryOffset } from '../src/assetapi/dtos/resourceinventoryoffset.dto';
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity';
import { of } from 'fp-ts/lib/ReaderT';
import { SnaplogEntity } from '../src/snaplog/snaplog.entity';
import { UserEntity } from '../src/user/user/user.entity';
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity';
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity';
import { SnaplogMergeEntity } from '../src/snaplog-merge/snaplog-merge.entity';
import { QueryManager } from '@apollo/client/core/QueryManager';

//import distance from "sharp-phash/distance"
config()


async function main() {
    const connection = await getDatabaseConnection("snaploguserfix")

    //fix scientific notation bs
    console.log("fixing scientific notation")
    const snResults = await connection.manager.find<SnaplogEntity>(SnaplogEntity, { amount: ILike("%e-%") })
    console.log(`Removing scientific notation ${snResults.length} from snaplogs`)
    for (const r of snResults) {
        //fix scientific notation bullshit
        if (r.amount.includes("e-")) {
            const noScientificNotation = new Number(r.amount).toFixed(18)
            console.log(`Changing scientific notation bullshit ${r.amount} > ${noScientificNotation}`)
            await connection.manager.update<SnaplogEntity>(SnaplogEntity, { id: r.id, amount: r.amount }, { amount: noScientificNotation })
        } else {
            throw new Error("not scientific notation")
        }
    }
    console.log("done fixing scientific notation")



    const queryRunner = connection.createQueryRunner()

    //do in transaction so everything rolled back if shit fucks up
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
        const results = await queryRunner.manager.find<SnaplogEntity>(SnaplogEntity, { relations: ["game", "material"], order: { processedAt: "ASC" } })
        console.log(`Adjusting ${results.length} snaplogs`)
        let startingTotal = BigNumber.from("0")
        for (const r of results) {
            startingTotal = startingTotal.add(parseEther(r.amount))
        }
        console.log(`Starting amount total across all logs and materials:: wei: ${startingTotal.toString()} ethers: ${formatEther(startingTotal)}`)
        for (const entry of results) {
            const originalUuid = entry.id.split("-")[0]
            const user = await queryRunner.manager.findOne<UserEntity>(UserEntity, { uuid: originalUuid })
            if (!!user) {
                await queryRunner.manager.update<SnaplogEntity>(SnaplogEntity, { id: entry.id }, { user })
            } else {
                //mc user that has migrated
                const gameTime = parseInt(entry.game.startedAt)
                const mcUuid = await queryRunner.manager.findOne<MinecraftUuidEntity>(MinecraftUuidEntity, { where: { minecraftUuid: originalUuid } })
                const mcLinks = await queryRunner.manager.find<MinecraftLinkEntity>(MinecraftLinkEntity, { where: { minecraftUuid: mcUuid }, order: { linkedAt: "DESC" }, relations: ["user"] })
                const userForGame = findUserForGame(mcLinks, gameTime)

                const oldId = entry.id
                const newId = entry.id.replace(`${originalUuid}-`, `${userForGame.uuid}-`)
                console.log(`Changing: ${entry.id} > ${newId}`)

                const moonsamaUserRow = await queryRunner.manager.findOne<SnaplogEntity>(SnaplogEntity, { id: newId })

                if (!!moonsamaUserRow) {
                    const existingAmount = parseEther(moonsamaUserRow.amount)
                    const amountToMerge = parseEther(entry.amount)
                    console.log(`Two users were merged into one because of migration, adding snaplog balances`)
                    await queryRunner.manager.insert<SnaplogMergeEntity>(SnaplogMergeEntity, { id: oldId, amount: formatEther(amountToMerge), processedAt: entry.processedAt, adjustedPower: entry.adjustedPower, material: entry.material, user: mcLinks[0].user })
                    await queryRunner.manager.update<SnaplogEntity>(SnaplogEntity, { id: newId }, { amount: formatEther(existingAmount.add(amountToMerge)) })
                    await queryRunner.manager.remove(entry)
                } else {
                    await queryRunner.manager.update<SnaplogEntity>(SnaplogEntity, { id: oldId }, { user: userForGame, id: newId })
                }


            }
        }

        //check that amounts are equal
        const afterResults = await queryRunner.manager.find<SnaplogEntity>(SnaplogEntity, { relations: [] })
        console.log(`Checking ${afterResults.length} snaplogs that total material amount equals`)
        let endingTotal = BigNumber.from("0")
        for (const r of afterResults) {
            endingTotal = endingTotal.add(parseEther(r.amount))
        }

        console.log(`start total: ${startingTotal.toString()} end total: ${endingTotal.toString()}`)

        if (startingTotal.toString() !== endingTotal.toString()) {
            throw new Error("total mismatch rolling back everything")
        }
        //commit it!
        await queryRunner.commitTransaction();

    } catch (e) {
        console.log(e)

        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
    } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();

    }
    console.log("FINISHED!")
    process.exit()
}

function findUserForGame(mcLinks: MinecraftLinkEntity[], gameTime: number): UserEntity {
    const firstLinkTime = mcLinks[mcLinks.length - 1].linkedAt.getTime()

    if (gameTime < firstLinkTime) {
        console.log(`game happened before first link`)
        return mcLinks[mcLinks.length - 1].user
    } else {
        //will be ordered most recent links first, find link that happened closest to game time
        for (const link of mcLinks) {
            const linkTime = link.linkedAt.getTime()
            if (gameTime > linkTime) {
                console.log(`${mcLinks.indexOf(link)}st link was used in game`)
                return link.user
            }
        }
    }
    throw new Error("couldnt find user for game")
}

main()

