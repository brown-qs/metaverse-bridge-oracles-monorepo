import { config } from 'dotenv'
import { BigNumber } from 'ethers'
import { AssetEntity } from '../src/asset/asset.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'

import { getDatabaseConnection } from './common'

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("verifyfungibilebalance")
    const assets = await connection.manager.find<AssetEntity>(AssetEntity, { relations: ["resourceInventory"] })

    const resourceGroups: any = {}

    for (const asset of assets) {
        if (!asset.resourceInventory) {
            continue
        }
        const resourceInventoryId = asset.resourceInventory.id
        if (!resourceGroups.hasOwnProperty(resourceInventoryId)) {
            resourceGroups[resourceInventoryId] = []
        }
        resourceGroups[resourceInventoryId].push(asset.amount)
    }
    const tsvRows = []

    for (const [resourceInvId, amounts] of Object.entries(resourceGroups)) {
        let bn = BigNumber.from("0")
        for (const amount of amounts as any) {
            bn = bn.add(amount)
        }
        //   console.log(`resourceInvId: ${resourceInvId} calculated total: ${bn.toString()}`)
        const resourceInventory = await connection.manager.findOne<ResourceInventoryEntity>(ResourceInventoryEntity, { id: resourceInvId })
        if (resourceInventory.amount === bn.toString()) {
            console.log(`✅ resourceInvId: ${resourceInvId} calculated total: ${resourceInventory.amount} db total: ${bn.toString()}`)
        } else {
            console.log(`❌ FUCK UP resourceInvId: ${resourceInvId} calculated total: ${resourceInventory.amount} db total: ${bn.toString()}`)
            let name = resourceInvId.endsWith("-14") ? "Bait" : "Poop"

            const diffWei = bn.sub(BigNumber.from(resourceInventory.amount))
            const dbValEthers = BigNumber.from(resourceInventory.amount).div(BigNumber.from(10).pow(18))

            const calculatedSumEthers = bn.div(BigNumber.from(10).pow(18))
            const diffEthers = diffWei.div(BigNumber.from(10).pow(18))
            //,${resourceInventory.amount},${bn.toString()},${diffWei.toString()}
            tsvRows.push(`${resourceInvId},${name},${dbValEthers},${calculatedSumEthers},${diffEthers}`)
        }
    }
    console.log("CSV\n\n\n\n")
    console.log(tsvRows.join("\n"))


}

main()