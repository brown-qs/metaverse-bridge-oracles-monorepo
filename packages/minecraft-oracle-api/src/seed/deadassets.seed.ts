import { Connection, createConnection, getConnection} from 'typeorm'

import {config} from 'dotenv'
import { AssetEntity } from '../asset/asset.entity'
import { request, gql } from 'graphql-request';
import { MaterialEntity } from '../material/material.entity';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { SummonEntity } from '../summon/summon.entity';
import { TextureEntity } from '../texture/texture.entity';
import { UserEntity } from '../user/user.entity';
import { map } from 'fp-ts/lib/Functor';

config()

const subgraph = 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/multiverse-bridge'

const QUERY = `
    query get {
        metaAssets(where: {active: true}) {
            id
            active
            asset {
               id
                assetAddress
                assetId
                assetType
            }
            enraptured
            owner {
                id
            }
            beneficiary {
                id
            }
        }
    }
`

async function main () {
    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: 'materialseeder',
            type: process.env.TYPEORM_CONNECTION as any,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            host: process.env.TYPEORM_HOST,
            port: Number.parseInt(process.env.TYPEORM_PORT),
            database: process.env.TYPEORM_DATABASE,
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, AssetEntity, SummonEntity],
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const response = await request(subgraph, QUERY);

    const assets = await connection.manager.find<AssetEntity>(AssetEntity, { where: {pendingIn: false}})
    const ids = response.metaAssets.map((x: any) => x.id)
    const hashes = assets.map(x => x.hash)

    const found: string[] = []

    const found2: string[] = []

    console.log('Check not included')
    response.metaAssets.map((ma: any) => {
        console.log('Checking', ma.id)
        if (!hashes.includes(ma.id)) {
            found.push(ma.id)
        }
    })
    
    console.log('Check dangling')
    console.log(ids)
    hashes.map((hash: any) => {
        console.log('Checking', hash)
        if (!ids.includes(hash)) {
            found2.push(hash)
            console.log('oof')
        }
    })
    console.log('-----Non included in DB-----')
    found.map(x => console.log(x))

    console.log('-----Dangling-----')
    found2.map(x => console.log(x))


    console.log({lenIds: ids.length, lenHashes: hashes.length, lenMissing: found.length, lenDangling: found2.length})
    
    
    
    await connection.close()
}


main()