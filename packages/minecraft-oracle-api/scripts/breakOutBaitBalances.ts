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
import { ILike, Like } from 'typeorm';
import { ResourceInventoryOffset } from '../src/assetapi/dtos/resourceinventoryoffset.dto';
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity';
import { of } from 'fp-ts/lib/ReaderT';
import { SnaplogEntity } from '../src/snaplog/snaplog.entity';

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("breakoutbaitbalances")
    const queryRunner = connection.createQueryRunner()

    //do in transaction so everything rolled back if shit fucks up
    await queryRunner.connect();

    await queryRunner.startTransaction();



    try {
        const results = await connection.manager.find<ResourceInventoryEntity>(ResourceInventoryEntity, { where: { id: ILike("%1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14") }, relations: ["offsets", "owner"] })
        console.log(`${results.length} users with bait balances`)
        let startingTotal = BigNumber.from("0")
        for (const r of results) {
            for (const offset of r.offsets) {
                startingTotal = startingTotal.add(offset.amount)
            }
        }
        console.log(`Starting amount offset across all bait:: wei: ${startingTotal.toString()} ethers: ${formatEther(startingTotal)}`)

        for (const userBaitBalance of results) {
            const owner = userBaitBalance.owner
            console.log(`uuid: ${owner.uuid}`)

            const rssInv: ResourceInventoryEntity = await queryRunner.manager.findOne(ResourceInventoryEntity, { where: { id: ILike("%1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14"), owner }, relations: ["offsets", "owner"] })
            const nullNoteOffsets = rssInv.offsets.filter((o: any) => !(!!o.note))
            if (nullNoteOffsets.length === 0) {
                console.log(`uuid: ${owner.uuid} has no old offset doing nothing`)
            } else if (nullNoteOffsets.length === 1) {
                const offset = nullNoteOffsets[0]
                const originalOffsetAmountWei = BigNumber.from(offset.amount)
                //parseEther(newItem.inv.amount)
                //find games
                const snapLogs = await queryRunner.manager.find(SnaplogEntity, { where: { id: ILike("%FISH_SPECIMEN%"), user: owner }, relations: ["game"] })
                console.log(`uuid: ${owner.uuid} has ${snapLogs.length} games with fishing`)

                let snaplogFishTotal = BigNumber.from("0")
                for (const snapLog of snapLogs) {
                    if (["minecraft-carnage-2022-10-16", "minecraft-carnage-2022-10-23"].includes(snapLog.game.id)) {
                        continue
                    }
                    await queryRunner.manager.insert(ResourceInventoryOffsetEntity, {
                        amount: parseEther(snapLog.amount).toString(),
                        resourceInventory: rssInv,
                        at: new Date(parseInt(snapLog.game.startedAt)),
                        note: snapLog.game.id ?? null,
                        game: snapLog.game
                    })

                    snaplogFishTotal = snaplogFishTotal.add(parseEther(snapLog.amount))
                }

                if (originalOffsetAmountWei.toString() === snaplogFishTotal.toString()) {
                    console.log(`uuid: ${owner.uuid} offset matching snap log entries, can proceed`)
                } else {
                    console.log(`uuid: ${owner.uuid} offset DOES NOT MATCH snap log entries, can NOT proceed calculated from snap log: ${snaplogFishTotal.toString()} offset entry: ${originalOffsetAmountWei.toString()}`)
                    throw new Error("Amount mismatch")
                }
                await queryRunner.manager.remove(ResourceInventoryOffsetEntity, offset)
                /*
                */
            } else {
                throw new Error("User has multiple offsets with null field!!!! Not good!!")
            }

        }
        const endingResults = await connection.manager.find<ResourceInventoryEntity>(ResourceInventoryEntity, { where: { id: ILike("%1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14") }, relations: ["offsets", "owner"] })
        console.log(`${results.length} users with bait balances`)
        let endingTotal = BigNumber.from("0")
        for (const r of endingResults) {
            for (const offset of r.offsets) {
                endingTotal = endingTotal.add(offset.amount)
            }
        }
        console.log(`start total: ${startingTotal.toString()} end total: ${endingTotal.toString()}`)

        if (startingTotal.toString() !== endingTotal.toString()) {
            throw new Error("total mismatch rolling back everything")
        }
        await queryRunner.commitTransaction();

    } catch (e) {
        console.log(e)

        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
    } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();

    }

    console.log("FINISHED")
    process.exit()
}



main()

