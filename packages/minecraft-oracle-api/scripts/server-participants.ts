import { Connection, createConnection, getConnection, Like} from 'typeorm'

import {config} from 'dotenv'
import { AssetEntity } from '../src/asset/asset.entity'
import { MaterialEntity } from '../src/material/material.entity';
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity';
import { SummonEntity } from '../src/summon/summon.entity';
import { TextureEntity } from '../src/texture/texture.entity';
import { UserEntity } from '../src/user/user.entity';
import { PlaySessionEntity } from '../src/playsession/playsession.entity';
import { PlaySessionStatEntity } from '../src/playsession/playsessionstat.entity';
import { InventoryEntity } from '../src/inventory/inventory.entity';
import fs from 'fs'

config()

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
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, AssetEntity, SummonEntity, PlaySessionEntity, PlaySessionStatEntity, InventoryEntity],
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const serverId = 'stress_test_24_11'
    const timeThreshold = 0

    const assets = await connection.manager.find<AssetEntity>(AssetEntity, { where: {pendingIn: false}, relations: ['owner']})
    const timelogs = await connection.manager.find<PlaySessionStatEntity>(PlaySessionStatEntity, {where: {id: Like(`%${serverId}%`)}})

    //console.log(timelogs.length, assets.length)
    
    let outcome: string = 'name,address\n'
    let missing: string = ''
    
    const users = assets
    //.filter(asset => asset.assetAddress === '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a')
    .map(asset => {
        if (!asset.owner) {
            return undefined
        }
        const uuid = asset.owner.uuid

        const tlog = timelogs.find(tlog => tlog.id == `${uuid}-${serverId}`)

        if (!tlog) {
            return undefined
        }

        if (Number.parseFloat(tlog.timePlayed) > timeThreshold) {
            return [asset.owner.userName, asset.owner.lastUsedAddress ?? 'MISSING']
        } else {
            return undefined
        }
    })
    .filter(x => !!x)
    .map(result => {
        if (result[1] === 'MISSING') {
            missing = missing.concat(`${result[0]},${result[1]}\n`)
        } else {
            outcome = outcome.concat(`${result[0]},${result[1]}\n`)
        }
    })

    outcome = outcome.concat(missing)

    fs.writeFileSync('./list.csv', outcome)

    await connection.close()
}


main()