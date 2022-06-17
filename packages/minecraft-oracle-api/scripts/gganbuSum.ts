import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection, In } from 'typeorm'

import { config } from 'dotenv'
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity'
import { MinecraftUserEntity } from '../src/user/minecraft-user/minecraft-user.entity'
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


const gameId = 'carnage-2022-02-20'

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
            entities: [MaterialEntity, SnapshotItemEntity, MinecraftUserEntity, TextureEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity, SkinEntity, GameEntity, GameTypeEntity, AchievementEntity, PlayerAchievementEntity, PlayerScoreEntity, GganbuEntity, SnaplogEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const snaps = await connection.manager.getRepository(SnapshotItemEntity).find({where: {game: {id: gameId}}, relations: ['material']})




    const stat: {[key: string]: number} = {}

    //console.log(gganbus)

    //const g = await connection.manager.getRepository(GameEntity).findOne({where: {id: 'carnage-2022-02-20'}, relations: ['snapshots']})

    for (let i=0; i< snaps.length; i++) {
        //await connection.manager.getRepository(SnapshotItemEntity).save({...snap, game: g})
        const snap = snaps[i]

        if (!stat[snap.material.name]) {
            stat[snap.material.name] = Number.parseFloat(snap.amount)
            return
        } 

        stat[snap.material.name] += Number.parseFloat(snap.amount)
    }

    console.log(stat)
    await connection.close()
}


main()