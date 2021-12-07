import * as fs from 'fs'

import { MaterialEntity } from '../material/material.entity'
import { Connection, createConnection, getConnection} from 'typeorm'

import {config} from 'dotenv'
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity'
import { UserEntity } from '../user/user.entity'
import { TextureEntity } from '../texture/texture.entity'
import { AssetEntity } from '../asset/asset.entity'
import { SummonEntity } from '../summon/summon.entity'
import { InventoryEntity } from '../inventory/inventory.entity'
import { PlaySessionEntity } from '../playsession/playsession.entity'
import { PlaySessionStatEntity } from '../playsession/playsessionstat.entity'
import { stringToStringAssetType } from '../utils'
import { TextureType } from '../texture/texturetype.enum'

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
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const materials = fs.readFileSync(__dirname + '/skins.csv').toString().split("\n").slice(1);

    const jobs = materials.map(async (material) => {
        if (!material) {
            return undefined
        }
        const fragments = material.split(',')
        if (!fragments || fragments.length == 0) {
            return undefined
        }
        const entity: TextureEntity = {
            assetType: stringToStringAssetType(fragments[0]),
            assetId: fragments[1],
            assetAddress: fragments[2],
            type: TextureType.SKIN,
            textureData: fragments[4],
            textureSignature: fragments[5],
            auction: true
        }
        try {
            const e = connection.manager.create<TextureEntity>(TextureEntity, entity)
            const success = await connection.manager.save<TextureEntity>(e)
            console.log(!!success)
        } catch(err) {
            console.log(err)
        }
        return undefined
    })

    await Promise.all(jobs)

    //const entities = await connection.manager.find<TextureEntity>(TextureEntity, {relations: ['snapshots']})

    const entities = await connection.manager.getRepository(TextureEntity).find({auction: true})
    console.log(entities?.[0])
    await connection.close()
}


main()