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
import { PlaySessionStatService } from '../src/playsession/playsessionstat.service'
import { GameEntity } from '../src/game/game.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'

config()

const list = [
    'NagyKiki',
    'OldSpiceVendor',
    'Kyilkhor',
]

const gameId = 'minecraft-carnage-2022-03-13'
const targetTime = '2700001'

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


    for (let i = 0; i < list.length; i++) {
        const user = await connection.manager.getRepository(UserEntity).findOne({ userName: list[i] })

        console.log(user)
        if (!user) {
            console.error(`Non existant user: ${list[i]}`)
            continue
        }

        const statId = PlaySessionStatService.calculateId({ uuid: user.uuid, gameId })
        const playSessionStat = await connection.manager.getRepository(PlaySessionStatEntity).findOne({ where: { id: statId } })

        if (!playSessionStat) {
            const ptI = connection.manager.create<PlaySessionStatEntity>(PlaySessionStatEntity, {
                id: statId,
                timePlayed: targetTime
            })
            const pt = await connection.manager.save<PlaySessionStatEntity>(ptI)


            const game = await connection.manager.getRepository(GameEntity).findOne({ where: { id: gameId } })

            const ps = connection.manager.create<PlaySessionEntity>(PlaySessionEntity, {
                player: user,
                identifier: gameId,
                startedAt: Date.now().toString(),
                endedAt: (Date.now() + 2700000).toString(),
                stat: pt,
                game
            })
            await connection.manager.save<PlaySessionEntity>(ps)
        } else {
            await connection.manager.getRepository(PlaySessionStatEntity).update({ id: playSessionStat.id }, { timePlayed: targetTime })
        }
    }
    await connection.close()
}


main()