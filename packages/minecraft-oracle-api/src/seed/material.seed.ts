import * as fs from 'fs'

import { MaterialEntity } from '../material/material.entity'
import { Connection, createConnection, getConnection} from 'typeorm'

import {config} from 'dotenv'
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity'
import { UserEntity } from '../user/user.entity'
import { TextureEntity } from '../texture/texture.entity'
import { AssetType } from '../common/enums/AssetType'

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
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity],
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const materials = fs.readFileSync(__dirname + '/materials.csv').toString().split("\n").slice(1);

    const jobs = materials.map(async (material) => {
        if (!material) {
            return undefined
        }
        const fragments = material.split(',')
        if (!fragments || fragments.length == 0) {
            return undefined
        }
        const entity: MaterialEntity = {
            name: fragments[0],
            key: fragments[1],
            hashCode: Number.parseInt(fragments[2]),
            ordinal: Number.parseInt(fragments[3]),
            maxStackSize: Number.parseInt(fragments[4]),
            snapshottable: 'true' === fragments[5],
            importable: 'true' === fragments[6],
            exportable: 'true' === fragments[7],
            equippable: 'true' === fragments[8],
            assetId: '0',
            assetType: AssetType.ERC20,
            assetAddress: '0x0000000000000000000000000000000000000000'
        }
        try {
            const e = connection.manager.create<MaterialEntity>(MaterialEntity, entity)
            const success = await connection.manager.save<MaterialEntity>(e)
            console.log(!!success)
        } catch(err) {
            console.log(err)
        }
        return undefined
    })

    await Promise.all(jobs)

    //const entities = await connection.manager.find<MaterialEntity>(MaterialEntity, {relations: ['snapshots']})

    const entities = await connection.manager.getRepository(MaterialEntity).find({snapshottable: true})
    console.log(entities?.[0])
    await connection.close()
}


main()