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

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connDontUse = await getDatabaseConnection("fixpoopbalances")
    const queryRunner = connDontUse.createQueryRunner()

    console.log("FINISHED")
    process.exit()
}



main()

