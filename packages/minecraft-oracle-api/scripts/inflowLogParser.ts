import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

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
import { METAVERSE, MultiverseVersion, RecognizedAssetType } from '../src/config/constants'
import dayjs from "dayjs"
import { calculateMetaAssetHash, standardizeValidateAssetInParams, utf8ToKeccak } from '../src/oracleapi/oracleapi.utils'
import { METAVERSE_V2_ABI } from '../src/common/contracts/MetaverseV2'
import { privateKeyToEthereumKeys } from '../src/crypto'
import fs from "fs"
import { stringAssetTypeToAssetType } from '../src/utils'
import axios from 'axios'
import { RecoverAssetDto } from '../src/adminapi/dtos/index.dto'
config()
const PAGE_SIZE = 100
const DRY_RUN = false
async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("inflowLogParser")

    const provider = new ethers.providers.JsonRpcProvider("https://moonriver-rpc.moonsama.com");
    const oracle = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);

    const contract = new Contract("0x59c481548ce7ba13f3288df9f4fcf44a10a589a0", METAVERSE_ABI, oracle)
    const contents = fs.readFileSync("/Users/me/Downloads/james-3.txt").toString()
    const lines = contents.split(`[MSAMA-MC-Oracle]`)
    //[OracleApiService] [eMi78] inRequest:: 
    const filteredLines = lines.filter(l => l.includes("] inRequest:: uuid:"))

    const functionCallIds = filteredLines.map(l => l.split(`[OracleApiService] [`)[1].split(`] inRequest:`)[0])

    const groupedFunctionCallLines: { [key: string]: string[] } = {}
    for (const callId of functionCallIds) {
        if (!groupedFunctionCallLines.hasOwnProperty(callId)) {
            groupedFunctionCallLines[callId] = filteredLines.filter(l => l.includes(`[OracleApiService] [${callId}] inRequest::`))
        }
    }

    for (const [callId, lines] of Object.entries(groupedFunctionCallLines)) {
        let startLine = lines.find(l => l.includes(`START ImportDto:`))
        if (startLine.includes(`\n`)) {
            startLine = startLine.split(`\n`)[0]
        }
        const payloadLine = lines.find(l => (l.includes(`request prepared from NEW salt:`) || l.includes(`returning previously used call data`)))

        if (!startLine) {
            console.log("couldnt find function start line")
            continue
        }

        if (!payloadLine) {
            console.log("couldn't find payload line")
            continue
        }
        let importDto
        try {
            importDto = JSON.parse(startLine.split(`START ImportDto:`)[1])
        } catch (e) {
            console.log("Couldn't parse json")
            console.log(`START LINE: |${startLine}|`)
            continue
        }

        console.log(`=============== ${callId} ===============`)
        console.log(lines.join("\n"))
        console.log('----------------')
        console.log(`import dto ${JSON.stringify(importDto)}`)
        if (importDto.chainId !== 1285) {
            console.log("Not MOVR, skipping")
            continue
        }
        const salt = payloadLine.split(`salt: `)[1].split(` `)[0]
        const payloadLineHash = payloadLine.split(` hash: `)[1].split(` `)[0]
        const payloadLineUuid = payloadLine.split(` uuid: `)[1].split(` `)[0]

        const standardizedParams = standardizeValidateAssetInParams(importDto.chainId, stringAssetTypeToAssetType(importDto.assetType), importDto.assetAddress, importDto.assetId, importDto.amount, importDto.enrapture, importDto.owner)
        const requestHash = await utf8ToKeccak(JSON.stringify(standardizedParams))
        const hash = await calculateMetaAssetHash(standardizedParams, METAVERSE, salt, MultiverseVersion.V1)
        console.log(`Recalculated hash: ${hash} payloadLineHash: ${payloadLineHash} salt: ${salt} uuid: ${payloadLineUuid}`)
        if (hash !== payloadLineHash) {
            console.log("Hash mismatch")
            continue
        }

        let exists: any
        if (importDto.enrapture) {
            exists = await contract.existsEnraptured(payloadLineHash)
        } else {
            exists = await contract.existsImported(payloadLineHash)
        }
        if (exists) {
            console.log("item exists in metaverse, checking if it is the database...")
        } else {
            continue
        }

        const assetEntity = await connection.manager.findOne<AssetEntity>(AssetEntity, { hash: payloadLineHash })
        if (!!assetEntity) {
            continue
        }

        console.log("Item doesn't exist in DB, adding it")

        const postBody: RecoverAssetDto = {
            hash: payloadLineHash,
            salt,
            uuid: payloadLineUuid,
            inData: importDto
        }
        const host = `https://minecraft-metaverse-api.moonsama.com`
        const jwt = ``

        const res = await axios.post(`${host}/api/v1/admin/recover-asset`, postBody, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });
    }


    // const connection = await getDatabaseConnection("indexerComparer")

    process.exit(0);
}

main()
