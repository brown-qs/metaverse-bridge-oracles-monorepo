import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection, In } from 'typeorm'

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
import { InventoryService } from '../src/playerinventory/inventory.service'

config()

const list = [
    'CapTK13',
    'SrogiLomot'
]

const gameId = 'carnage-2022-02-06'
const targetTime = 2700001

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

    // Check user exists
    // 


    const gganbus = await connection.manager.getRepository(GganbuEntity).find({ where: {game: {id: gameId}}, relations: ['material']})
    //console.log(gganbus)
    for(let i = 0; i< list.length; i++) {
        const user = await connection.manager.getRepository(UserEntity).findOne({ userName: list[i] })

        
        if (!user) {
            console.error(`Non existant user: ${list[i]}`)
            continue
        } else {
            console.log(user?.userName)
        }

        const statId = PlaySessionStatService.calculateId({uuid: user.uuid, gameId})
        const playSessionStat = await connection.manager.getRepository(PlaySessionStatEntity).findOne({where: {id: statId}})

        if(!!playSessionStat) {
            if (Number.parseInt(playSessionStat.timePlayed) < targetTime) {
                console.log('skip', user.userName)
                continue
            }

            for(let j = 0; j<gganbus.length; j++) {
                const gganbu = gganbus[j]
                const inv = await connection.manager.getRepository(InventoryEntity).findOne({where: {owner: {uuid: user.uuid}, material: {name: gganbu.material.mapsTo}}, relations: ['owner']})
                if (!inv) {
                    const mat = await connection.manager.getRepository(MaterialEntity).findOne({where: {name: gganbu.material.mapsTo}})
                    
                    const ent = await connection.manager.getRepository(InventoryEntity).create({
                        id: InventoryService.calculateId({uuid: user.uuid, materialName: gganbu.material.mapsTo}),
                        amount: (Number.parseFloat(gganbu.amount) * gganbu.material.multiplier).toString(),
                        material: mat,
                        owner: user,
                        summonInProgress: false,
                        summonable: true
                    })

                    await connection.manager.getRepository(InventoryEntity).save(ent)
                    console.log('new num', gganbu.amount)
                } else {
                    const newNum = (Number.parseFloat(inv.amount) + (Number.parseFloat(gganbu.amount) * gganbu.material.multiplier )).toString()
                    console.log(`   old nums`, inv.amount, newNum)
                    await connection.manager.getRepository(InventoryEntity).update(inv.id, {amount: newNum})
                }
            }
        }
    }
    await connection.close()
}


main()