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
import { InventoryEntity } from '../src/playerinventory/inventory.entity';
import { SnapshotService } from '../src/snapshot/snapshot.service';

//import distance from "sharp-phash/distance"
config()

async function main() {
    const connDontUse = await getDatabaseConnection("fixpoopbalances")
    const queryRunner = connDontUse.createQueryRunner()

    //do in transaction so everything rolled back if shit fucks up
    await queryRunner.connect();

    await queryRunner.startTransaction();



    try {
        const results = await queryRunner.manager.find<ResourceInventoryEntity>(ResourceInventoryEntity, { where: { id: ILike("%-1284-0xfffffffecb45afd30a637967995394cc88c0c194-0") }, relations: ["offsets", "owner"] })
        console.log(`${results.length} users with poop balances`)
        let startingTotal = BigNumber.from("0")
        for (const r of results) {
            if (r?.offsets?.length > 1) {
                throw new Error("User should only have one poop offset")
            }
            for (const offset of r.offsets) {
                startingTotal = startingTotal.add(offset.amount)
            }
        }
        console.log(`Starting amount offset across all poop:: wei: ${startingTotal.toString()} ethers: ${formatEther(startingTotal)}`)

        for (const userBaitBalance of results) {
            const owner = userBaitBalance.owner

            for (const offset of (userBaitBalance?.offsets ?? [])) {
                if (!userBaitBalance.id.includes("-1284-0xfffffffecb45afd30a637967995394cc88c0c194-0")) {
                    throw new Error("offset is not poop")
                }
                const samaInventory = await queryRunner.manager.findOne<InventoryEntity>(InventoryEntity, { id: `${owner.uuid}-SAMA` })

                const oldOffset = BigNumber.from(offset.amount)
                const newOffset = oldOffset.mul(10)
                await queryRunner.manager.update<ResourceInventoryOffsetEntity>(ResourceInventoryOffsetEntity, { id: offset.id }, { amount: newOffset.toString() })
            }
        }
        const endingResults = await queryRunner.manager.find<ResourceInventoryEntity>(ResourceInventoryEntity, { where: { id: ILike("%-1284-0xfffffffecb45afd30a637967995394cc88c0c194-0") }, relations: ["offsets", "owner"] })
        console.log(`${results.length} users with poop balances`)
        let endingTotal = BigNumber.from("0")
        for (const r of endingResults) {
            for (const offset of r.offsets) {
                endingTotal = endingTotal.add(offset.amount)
            }
        }



        const startTotalTimesTen = startingTotal.mul(10)
        console.log(`startTotalTimesTen: ${startTotalTimesTen.toString()} end total: ${endingTotal.toString()}`)
        console.log(`Ending amount offset across all poop:: wei: ${endingTotal.toString()} ethers: ${formatEther(endingTotal)}`)

        if (startTotalTimesTen.toString() !== endingTotal.toString()) {
            throw new Error("total mismatch rolling back everything")
        }
        //997e0cf0e79697f324746b0bc849a4d2
        //sanity test
        const kyilkhorBalance = await queryRunner.manager.findOne<ResourceInventoryOffsetEntity>(ResourceInventoryOffsetEntity, { where: { resourceInventory: ILike("997e0cf0e79697f324746b0bc849a4d2-1284-0xfffffffecb45afd30a637967995394cc88c0c194-0") } })

        if (kyilkhorBalance.amount !== "4116000000000000000000000") {
            throw new Error("failed to pass sanity check, maybe script has already been run?")
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

