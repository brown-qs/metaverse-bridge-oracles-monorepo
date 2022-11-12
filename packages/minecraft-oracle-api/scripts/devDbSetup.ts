import { config } from 'dotenv'
import { getDatabaseConnection } from './common'

import { ChainEntity } from '../src/chain/chain.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { StringAssetType } from '../src/common/enums/AssetType'
import { ChainId, MultiverseVersion, RecognizedAssetType } from '../src/config/constants'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { Chain } from 'fp-ts/lib/ReadonlyNonEmptyArray'

//import distance from "sharp-phash/distance"
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("devdbsetup")

    //add test indexer
    await connection.manager.update<ChainEntity>(ChainEntity, { chainId: 1285 }, { multiverseV2Address: "0x1ff3097f4a82913d690d2a59de613378ae2b3c05" })

    //add $SFT collection
    try {
        const chain = await connection.manager.findOne<ChainEntity>(ChainEntity, { chainId: 1285 })

        await connection.manager.insert<CollectionEntity>(CollectionEntity, { chain, "assetAddress": "0x2f82471dccf85d3f6cb498d4e792cfa9e875ab0a", assetType: StringAssetType.ERC20, name: "$SFT", chainId: 1285, multiverseVersion: MultiverseVersion.V2 })
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

    //add grimagromlins
    try {
        const chain = await connection.manager.findOne<ChainEntity>(ChainEntity, { chainId: 1285 })

        await connection.manager.insert<CollectionEntity>(CollectionEntity, { chain, "assetAddress": "0xe4bf451271d8d1b9d2a7531aa551b7c45ec95048", assetType: StringAssetType.ERC721, name: "Grimagromlins", chainId: 1285, multiverseVersion: MultiverseVersion.V2 })
    } catch (e) { }

    const grimagromlinsCollection = await connection.manager.findOne<CollectionEntity>(CollectionEntity, { "assetAddress": "0xe4bf451271d8d1b9d2a7531aa551b7c45ec95048" })

    for (let i = 0; i < 1000; i++) {
        try {
            await connection.manager.insert<CollectionFragmentEntity>(CollectionFragmentEntity, { treatAsFungible: false, migratable: true, decimals: 1, collection: grimagromlinsCollection, recognizedAssetType: RecognizedAssetType.GROMLIN, enrapturable: false, importable: true, exportable: true, summonable: false, gamepass: false, name: "Grimagromlins", idRange: null })
            break;
        } catch (e) {
            if (!JSON.stringify(e).includes(`"detail":"Key (id)=`)) {
                break
            }
        }
    }


    //add liquid shit
    try {
        const chain = await connection.manager.findOne<ChainEntity>(ChainEntity, { chainId: 2109 })
        await connection.manager.insert<CollectionEntity>(CollectionEntity, { chain, "assetAddress": "0x17098f04db67fdcf216f488f4aec0da71c0fc132", assetType: StringAssetType.ERC20, name: "LIQUID SHIT", chainId: 2109, multiverseVersion: MultiverseVersion.V2 })
    } catch (e) { }

    //add liquid shit

    const liquidShit = await connection.manager.findOne<CollectionEntity>(CollectionEntity, { "assetAddress": "0x17098f04db67fdcf216f488f4aec0da71c0fc132" })


    for (let i = 0; i < 1000; i++) {
        try {
            await connection.manager.insert<CollectionFragmentEntity>(CollectionFragmentEntity, { treatAsFungible: true, migratable: true, decimals: 18, collection: liquidShit, recognizedAssetType: RecognizedAssetType.RESOURCE, enrapturable: false, importable: true, exportable: true, summonable: true, gamepass: false, name: "LIQUID SHIT", idRange: null })
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