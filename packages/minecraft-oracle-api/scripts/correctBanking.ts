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
import { PlaySessionStatService } from '../src/playsession/playsessionstat.service'
import { GameEntity } from '../src/game/game.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'

config()

const gameId = 'carnage-2022-02-13'

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
            entities: [MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity, SkinEntity, GameEntity, GameTypeEntity, AchievementEntity, PlayerAchievementEntity, PlayerScoreEntity, GganbuEntity, SnaplogEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    // check user valid
    // get playtime if any
    // yes playtime, make sure it has enough
    // no playtime, add new entry

    const snaplogs = await connection.manager.getRepository(SnaplogEntity).find({ where: { game: { id: gameId } }, relations: ['game', 'owner', 'material'] })

    await Promise.all(snaplogs.map(async (snap) => {
        if (!snap.owner) {
            return
        }

        const inv = await connection.manager.getRepository(InventoryEntity).findOne({ where: { owner: { uuid: snap.owner.uuid }, material: { name: snap.material.mapsTo } }, relations: ['owner', 'material'] })

        if (!!inv) {

            const invNum = Number.parseFloat(inv.amount)
            const snapNum = Number.parseFloat(snap.amount)

            const newNum = Math.max(invNum-(snapNum * snap.material.multiplier * 0.8), 0).toString()

            console.log(snap.owner.userName, snap.material.name, inv.material.name, inv.amount, snap.amount, invNum, snapNum, newNum)

            if (newNum === '0') {
                console.log('ZEROOOOOOOOOOOOOOOOOOOOo')
            }

            await connection.manager.getRepository(InventoryEntity).update({ id: inv.id }, { amount: newNum})
        }
    }))
    await connection.close()
}


main()