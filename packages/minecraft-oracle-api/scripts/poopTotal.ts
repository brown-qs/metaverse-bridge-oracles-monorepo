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
import { formatEther } from 'ethers/lib/utils';

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("pooptotal")
    const result = await connection.manager.find<AssetEntity>(AssetEntity, { pendingIn: false, assetId: "0", collectionFragment: { id: 23 }, })
    // process.exit(0);
    let bn = BigNumber.from("0")

    for (const row of result) {
        bn = bn.add(row.amount)
    }
    console.log(`Poop total:: wei: ${bn.toString()} ether: ${formatEther(bn)}`)
}



main()

