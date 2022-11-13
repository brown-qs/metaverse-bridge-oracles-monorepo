import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

import { config } from 'dotenv'
import { UserEntity } from '../src/user/user/user.entity'
import { TextureEntity } from '../src/texture/texture.entity'
import { AssetEntity } from '../src/asset/asset.entity'
import { SkinEntity } from '../src/skin/skin.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { UserRole } from '../src/common/enums/UserRole'
import { findRecognizedAsset } from '../src/utils/misc'
import { appEntities } from '../src/app.module'

config()

async function main() {
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
            entities: appEntities,
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }
    const users = await connection.manager.getRepository(UserEntity).find({ relations: ['assets', 'assets.collectionFragment', 'assets.collectionFragment.collection'], loadEagerRelations: true })

    const fragments = await connection.manager.getRepository(CollectionFragmentEntity).find({ relations: ['collection', 'collection.chain'], loadEagerRelations: true })

    for (let i = 0; i < users.length; i++) {

        const user = users[i]

        // if (!user.assets || user.assets.length === 0) {
        //     continue
        // }

        const displayname = user?.minecraftUserName ?? user?.gamerTag ?? user?.uuid
        console.log(displayname)
        for (let j = 0; j < user.assets.length; j++) {
            const asset = user.assets[j]
            if (asset.pendingIn) {
                continue
            }
            
            const assetAddress = asset.collectionFragment.collection.assetAddress
            const assetId = asset.assetId

            const recognizedAsset = findRecognizedAsset(fragments, {assetAddress, assetId})

            console.log('    ', assetAddress, assetId, asset.recognizedAssetType)

            const texture = await connection.manager.getRepository(TextureEntity).findOne({ where: { assetAddress, assetId } })
            if (!!texture) {
                await connection.manager.getRepository(SkinEntity).save(
                    { id: SkinEntity.toId(user.uuid, assetAddress, assetId), owner: user, texture }
                )
                console.log('    skin set')
            }
            const rat = recognizedAsset.recognizedAssetType
            const pass = recognizedAsset.gamepass
            await connection.manager.getRepository(AssetEntity).update(asset.hash, {recognizedAssetType: rat})
            console.log('    assset type set', rat)
        }

        const recmap = user.assets.map(asset => findRecognizedAsset(fragments, {assetAddress: asset.collectionFragment.collection.assetAddress, assetId: asset.assetId})) ?? []
        const rec = (recmap.find(cf => cf.gamepass === true))
        const numPassAssets = recmap.reduce((prev, curr) => {return (prev + (curr.gamepass ? 1: 0))}, 0)
        const hasGamePass = rec !== null && rec !== undefined

        const isAdmin = user.role?.valueOf() === UserRole.ADMIN.valueOf() || user.role?.valueOf() === UserRole.BANKER_ADMIN.valueOf()

        console.log('set', displayname, hasGamePass, numPassAssets, isAdmin ? UserRole.ADMIN : (hasGamePass ? UserRole.PLAYER: UserRole.NONE))
        await connection.manager.getRepository(UserEntity).update(user.uuid, {relationsUpdatedAt: new Date(), allowedToPlay: hasGamePass, numGamePassAsset: numPassAssets, role: isAdmin ? UserRole.ADMIN: (hasGamePass ? UserRole.PLAYER: UserRole.NONE)})

        // if (user.allowedToPlay !== hasGamePass || !user.role || user.role.valueOf() === UserRole.NONE.valueOf()) {
        //     console.log('set', displayname, hasGamePass, numPassAssets, hasGamePass ? UserRole.PLAYER: UserRole.NONE)
        //     await connection.manager.getRepository(UserEntity).update(user.uuid, {allowedToPlay: hasGamePass, role: hasGamePass ? UserRole.PLAYER: UserRole.NONE})
        // }
    }
    await connection.close()
}


main()