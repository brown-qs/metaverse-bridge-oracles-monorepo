import * as fs from 'fs'

import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

import { config } from 'dotenv'
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity'
import { UserEntity } from '../src/user/user.entity'
import { TextureEntity } from '../src/texture/texture.entity'
import { AssetEntity } from '../src/asset/asset.entity'
import { SummonEntity } from '../src/summon/summon.entity'
import { InventoryEntity } from '../src/playerinventory/inventory.entity'
import { PlaySessionEntity } from '../src/playsession/playsession.entity'
import { PlaySessionStatEntity } from '../src/playsession/playsessionstat.entity'
import { SkinEntity } from '../src/skin/skin.entity'
import { StringAssetType } from '../src/common/enums/AssetType'
import { IMPORTABLE_ASSETS } from '../src/config/constants'

config()

async function main() {
    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: 'skinmigration',
            type: process.env.TYPEORM_CONNECTION as any,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            host: process.env.TYPEORM_HOST,
            port: Number.parseInt(process.env.TYPEORM_PORT),
            database: process.env.TYPEORM_DATABASE,
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, SkinEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('skinmigration')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const IMPORTABLEASSETS = IMPORTABLE_ASSETS.filter(x => x.chainId.valueOf() === 1285)

    try {
        const users = await connection.manager.find<UserEntity>(UserEntity, { relations: ['assets'], loadEagerRelations: true})
        const defaultFemale = await connection.manager.findOne<TextureEntity>(TextureEntity, { where: { assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE } })
        const defaultMale = await connection.manager.findOne<TextureEntity>(TextureEntity, { where: { assetAddress: '0x0', assetId: '1', assetType: StringAssetType.NONE } })

        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            console.log('processing user', user.uuid)
            for (let j = 0; j < user.assets.length; j++) {

                const asset = user.assets[j]
                const assetAddress = asset.collectionFragment.collection.assetAddress.toLowerCase()
                const assetType = asset.collectionFragment.collection.assetType

                const texture = await connection.manager.findOne<TextureEntity>(TextureEntity, { where: { assetId: asset.assetId, assetAddress: assetAddress, assetType: assetType } })
                if (!!texture) {
                    console.log('    found texture', `${assetAddress}`, `${asset.assetId}`)
                    const entity = await connection.manager.create<SkinEntity>(SkinEntity, { id: SkinEntity.toId(user.uuid, assetAddress, asset.assetId), owner: user, texture })
                    await connection.manager.save<SkinEntity>(entity)
                    console.log('        added')
                }
                const found = IMPORTABLEASSETS.find(x => x.address.toLowerCase() == assetAddress.toLowerCase())
                if (!!found && found.gamepass) {
                    user.numGamePassAsset = (user.numGamePassAsset ?? 0) + 1
                }
            }
            if (user.numGamePassAsset > 0) {
                console.log('    default textures')
                const x = await connection.manager.create<SkinEntity>(SkinEntity, {
                    id: SkinEntity.toId(user.uuid, '0x0', '0'),
                    owner: user,
                    texture: defaultFemale
                })
                const y = await connection.manager.create<SkinEntity>(SkinEntity, {
                    id: SkinEntity.toId(user.uuid, '0x0', '1'),
                    owner: user,
                    texture: defaultMale
                })
                await connection.manager.save<SkinEntity[]>([x, y])
                console.log('        added')
            }

            const skinentities = await connection.manager.find<SkinEntity>(SkinEntity, { where: { owner: { uuid: user.uuid } }, relations: ['owner', 'texture'] })

            const equipped = skinentities.find(x => x.equipped)

            if (skinentities.length > 0 && !equipped) {
                const foundmoonsama = skinentities.find(x => x.texture.assetAddress === '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a')
                if (!!foundmoonsama) {
                    await connection.manager.update<SkinEntity>(SkinEntity, { id: foundmoonsama.id }, { equipped: true })
                    console.log('    default set to', foundmoonsama.id)
                } else {
                    await connection.manager.update<SkinEntity>(SkinEntity, { id: SkinEntity.toId(user.uuid, '0x0', '0') }, { equipped: true })
                    console.log('    default set to', SkinEntity.toId(user.uuid, '0x0', '0'))
                }
            }
            await connection.manager.update<UserEntity>(UserEntity, { uuid: user.uuid}, { numGamePassAsset: user.numGamePassAsset })
        }

    } catch (err) {
        console.log(err)
    }
    await connection.close()
}


main()