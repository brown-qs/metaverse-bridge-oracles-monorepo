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
import { RecognizedAssetType } from '../src/config/constants'

config()

const list = [
    'NagyKiki',
    'OldSpiceVendor',
    'Kyilkhor',
]

const gameId = 'minecraft-carnage-2022-03-13'
const targetTime = '2700000'
const msamasOnly = true

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

        const allUsers = await connection.manager.getRepository(UserEntity).find({})
        console.log(`Communism:: ${allUsers.length} users found`)

        let counter: { [key: string]: number } = {}
        let users: { [key: string]: {exists: boolean, eligible: boolean  } } = {}
        let allDistinct = 0
        let gganbuDistinct = 0

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i]
            
            const statId = PlaySessionStatService.calculateId({ uuid: user.uuid, gameId })
            const playStats = await connection.manager.getRepository(PlaySessionStatEntity).findOne({ where: { id: statId } })

            console.log(`Communism:: ${user.uuid} played ${playStats?.timePlayed}`)

            const tPlayed = playStats?.timePlayed ? Number.parseFloat(playStats?.timePlayed) : 0

            let playedEnough = false
            if (tPlayed >= Number.parseInt(targetTime)) {
                playedEnough = true
            } else {
                console.log(`Communism:: ${user.uuid} not eligible for gganbu`)
            }

            if (!users[user.uuid]) {
                allDistinct += 1
                const hasMoonsama = !!(await connection.manager.getRepository(AssetEntity).findOne({recognizedAssetType: RecognizedAssetType.MOONSAMA, owner: {uuid: user.uuid}, pendingIn: false}))
                users[user.uuid] = {
                    exists: true,
                    eligible: false
                }
                
                if (
                    playedEnough &&
                    (
                        (msamasOnly && hasMoonsama)
                        || !msamasOnly
                    )
                ) {
                    users[user.uuid].eligible = true
                    gganbuDistinct += 1
                }
            }
        }

        console.log(gganbuDistinct)
    await connection.close()
}


main()






