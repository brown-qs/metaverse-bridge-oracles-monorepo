import { config } from 'dotenv'
import { getDatabaseConnection } from './common'

import { ChainEntity } from '../src/chain/chain.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { StringAssetType } from '../src/common/enums/AssetType'
import { MultiverseVersion, RecognizedAssetType } from '../src/config/constants'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("devdbsetup")

    //add test indexer
    await connection.manager.update<ChainEntity>(ChainEntity, { chainId: 1285 }, { multiverseV2Address: "0x1ff3097f4a82913d690d2a59de613378ae2b3c05" })

    //add $SFT collection
    try {
        await connection.manager.insert<CollectionEntity>(CollectionEntity, { "assetAddress": "0x2f82471dccf85d3f6cb498d4e792cfa9e875ab0a", assetType: StringAssetType.ERC20, name: "$SFT", chainId: 1285, multiverseVersion: MultiverseVersion.V2 })
    } catch (e) { }

    //add $SFT collection fragment
    const sftCollection = await connection.manager.findOne<CollectionEntity>(CollectionEntity, { "assetAddress": "0x2f82471dccf85d3f6cb498d4e792cfa9e875ab0a", assetType: StringAssetType.ERC20, name: "$SFT", chainId: 1285, multiverseVersion: MultiverseVersion.V2 })


    for (let i = 0; i < 1000; i++) {
        try {
            await connection.manager.insert<CollectionFragmentEntity>(CollectionFragmentEntity, { treatAsFungible: true, migratable: true, decimals: 18, collection: sftCollection, recognizedAssetType: RecognizedAssetType.RESOURCE, enrapturable: false, importable: true, exportable: true, summonable: false, gamepass: false, name: "$SFT", idRange: null })
            break;
        } catch (e) {
            if (!JSON.stringify(e).includes(`"detail":"Key (id)=`)) {
                break
            }
        }
    }


    process.exit(0);
}
main()