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
import { GameEntity } from '../src/game/game.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'
import { GameItemTypeEntity } from '../src/gameitemtype/gameitemtype.entity'
import { PlayerGameItemEntity } from '../src/playergameitem/playergameitem.entity'
import { GameScoreTypeEntity } from '../src/gamescoretype/gamescoretype.entity'
import { SnapshotService } from '../src/snapshot/snapshot.service'
import { PlaySessionStatService } from '../src/playsession/playsessionstat.service'
import { adjustPower } from '../src/utils'
import axios from 'axios'

config()
/*
6.793162393162394	DARK_OAK_LOG
64.37948717948719	IRON_INGOT
1036.2358974358974	COBBLESTONE
3.18974358974359	IRON_BLOCK
1.2991452991452992	GOLD_BLOCK
34.68376068376068	BIRCH_LOG
21.446153846153848	JUNGLE_LOG
105.16923076923078	SPRUCE_LOG
103.61709401709402	OAK_LOG



116.6	COBBLESTONE
32.6	OAK_LOG
0.8	    IRON_INGOT
15.4	EXP
2.6	    GOLD_INGOT
*/

type UserPersonalShare = {
    player: string
    exp: number
    wood: number
    iron: number
    gold: number
    stone: number
    grain: number
}

const KEYMAP: { [key: string]: string } = {
    exp: 'EXP',
    wood: 'OAK_LOG',
    iron: 'IRON_INGOT',
    gold: 'GOLD_INGOT',
    stone: 'COBBLESTONE',
    grain: 'WHEAT'
}

const reports: any[] = [{"id":25,"created_at":null,"updated_at":null,"player_id":"4e632dc7da0b4d5fafea7eb4d2ea5994","name":"opositor69","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Auto Clicker","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":26,"created_at":null,"updated_at":null,"player_id":"444453b8091a4752a06ed828c107888d","name":"BigSals1","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Auto Clicker","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":27,"created_at":null,"updated_at":null,"player_id":"4854c35c2ae0423a973b96784adbf81b","name":"DottyBangsJr","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Auto Clicker","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":28,"created_at":null,"updated_at":null,"player_id":"bf8b0f229c25423286c363d4ef0cb9c8","name":"masama003","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/drive.google.com\/drive\/folders\/1q-gpIAKzHm6oIWvhNQYLd3unPfMOGx4B?usp=sharing","game_pass":1,"personal_share":1,"gganbu":1},{"id":29,"created_at":null,"updated_at":null,"player_id":"678dac4349724293ba741ad01c9fdc98","name":"FoxVEE538","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/HxKRJUzAXt4","game_pass":1,"personal_share":1,"gganbu":1},{"id":30,"created_at":null,"updated_at":null,"player_id":"f5436b81497746dfaa577b7cb880f174","name":"TroopZie","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/eCbMRf-SkZs","game_pass":1,"personal_share":1,"gganbu":1},{"id":31,"created_at":null,"updated_at":null,"player_id":"db42bd31881a44d3a9a0345ff41c4c5d","name":"RikkoTroom","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=dOuD1oKjEWg","game_pass":1,"personal_share":1,"gganbu":1},{"id":32,"created_at":null,"updated_at":null,"player_id":"ba5bd825a70b4d0ca7d9d851254b0eb9","name":"FreeMedusa84686","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/_nFLSYCZa00","game_pass":1,"personal_share":1,"gganbu":1},{"id":33,"created_at":null,"updated_at":null,"player_id":"fcb0a204fbe84256b93f8be847c38282","name":"bhazvzbatz1","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=KfVaPSCKsds&ab_channel=greaneye","game_pass":1,"personal_share":1,"gganbu":1},{"id":34,"created_at":null,"updated_at":null,"player_id":"0e1bf90bf4c34482a58070ca6d570c01","name":"Ornal_Juice","ip_address":null,"game_id":"minecraft-carnage-2022-05-01","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"Part 1: https:\/\/youtu.be\/NpZ4jumzkl8Part2: https:\/\/youtu.be\/-8qz8mJzhcsPart 3: https:\/\/youtu.be\/ypNVuP8g36IPart 4: https:\/\/youtu.be\/h6HCcLJXP30Part 5: https:\/\/youtu.be\/eNIDaiS1M10Part 6: https:\/\/youtu.be\/ZhyjoK08pwYPart 7: https:\/\/youtu.be\/_DOyRQ5_1RAPart 8: https:\/\/youtu.be\/BxyfTlUKluUPart 9: https:\/\/youtu.be\/DoSijHvOoaIPart 10: https:\/\/youtu.be\/6BmEW0_1uvY","game_pass":1,"personal_share":1,"gganbu":1}]

const gameId = 'minecraft-carnage-2022-05-01'

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
            entities: [GameScoreTypeEntity, GameItemTypeEntity, PlayerGameItemEntity, MaterialEntity, SnapshotItemEntity, UserEntity, TextureEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity, SkinEntity, GameEntity, GameTypeEntity, AchievementEntity, PlayerAchievementEntity, PlayerScoreEntity, GganbuEntity, SnaplogEntity],
            synchronize: true
        })
    } catch (err) {
        connection = getConnection('materialseeder')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    const assetDeleteList: string[] = []

    for (let i = 0; i < reports.length; i++) {
        const report = reports[i]
        const gameId = report.game_id
        const userId = report.player_id
        const userName = report.name
        const result = report.result
        const gamePassOn = report.game_pass && report.game_pass === 1
        const personalShareOn = report.personal_share && report.personal_share === 1
        const gganbuOn = report.gganbu && report.gganbu === 1
        const game = await connection.manager.getRepository(GameEntity).findOne({ where: { id: gameId } })

        const blacklist = !report.result || report.result === 'ban'

        if (!gamePassOn) {
            assetDeleteList.push(userName)
        }

        if (!game) {
            console.log('game not found')
            continue
        }

        const user = await connection.manager.getRepository(UserEntity).findOne({ uuid: userId })
        if (!user) {
            console.error(`Non existant user: ${userName}-${userId}`)
            continue
        } else {
            console.log(user?.userName)
        }

        if (!gganbuOn) {
            const gganbus = await connection.manager.getRepository(GganbuEntity).find({ where: { game: { id: gameId } }, relations: ['material'] })
            const powerSum = gganbus?.[0]?.powerSum
            let adjustedPower = 0
            const stat = await connection.manager.getRepository(PlaySessionStatEntity).findOne({ where: { id: PlaySessionStatService.calculateId({ uuid: user.uuid, gameId: game.id }) } })

            if (!stat) {
                console.error(`No stat for user: ${userName}`)
                continue
            } else {
                adjustedPower = adjustPower(stat.power ?? 0)
                console.log('played', stat.timePlayed)
                console.log('power', stat.power)
                console.log('adjusted power', adjustedPower)
            }

            for (let j = 0; j < gganbus.length; j++) {

                const gganbu = gganbus[j]

                const snap = await connection.manager.getRepository(SnapshotItemEntity).findOne({ where: { owner: { uuid: user.uuid }, material: { name: gganbu.material.name } }, relations: ['owner', 'material'] })
                if (!snap) {
                    const mat = await connection.manager.getRepository(MaterialEntity).findOne({ where: { name: gganbu.material.name } })
                    const amount = (-1 * Number.parseFloat(gganbu.amount) * adjustedPower / powerSum).toString()
                    console.log('    new amount', mat.name, amount)
                    //continue
                    const ent = await connection.manager.getRepository(SnapshotItemEntity).create({
                        id: SnapshotService.calculateId({ uuid: user.uuid, materialName: gganbu.material.name, gameId: game.id }),
                        amount,
                        material: mat,
                        owner: user,
                        game,
                    })
                    let x: any
                    x = await connection.manager.getRepository(SnapshotItemEntity).save(ent)

                    console.log('    success:', !!x)
                    console.log('    new num', amount)
                } else {
                    const amount = (Number.parseFloat(gganbu.amount) * adjustedPower / powerSum)
                    const updatedNum = (Number.parseFloat(snap.amount) - amount).toString()
                    //continue
                    console.log(`    old/new`, snap.amount, updatedNum)
                    let x: any
                    x = await connection.manager.getRepository(SnapshotItemEntity).update(snap.id, { amount: updatedNum })
                    console.log('    success:', x?.affected > 0)
                }
            }
        }

        if (!personalShareOn) {
            try {
                const resp = await axios.get<any>(`https://mcapi.moonsama.com/game/${gameId}/carnage-stats/result/personal_share?player=${userName}`)
                const data = resp.data

                const fields = Object.keys(KEYMAP)

                for (let j = 0; j < fields.length; j++) {

                    const materialName: string | undefined = KEYMAP[fields[j]]

                    if (!materialName) {
                        continue
                    }

                    const amo: number = data[fields[j]]

                    if (!amo) {
                        continue
                    }

                    //console.log(amo, data, fields[j], materialName)

                    const snap = await connection.manager.getRepository(SnapshotItemEntity).findOne({ where: { owner: { uuid: user.uuid }, material: { name: materialName } }, relations: ['owner', 'material'] })

                    if (!snap) {
                        const mat = await connection.manager.getRepository(MaterialEntity).findOne({ where: { name: materialName } })
                        const amount = (-amo).toString()
                        //continue
                        console.log('    new amount', mat.name, amount)
                        const ent = await connection.manager.getRepository(SnapshotItemEntity).create({
                            id: SnapshotService.calculateId({ uuid: user.uuid, materialName, gameId: game.id }),
                            amount,
                            material: mat,
                            owner: user,
                            game,
                        })
                        let x: any
                        x = await connection.manager.getRepository(SnapshotItemEntity).save(ent)
                        console.log('    success:', !!x)
                    } else {
                        const updatedNum = (Number.parseFloat(snap.amount) - amo).toString()
                        console.log(`    updating. old/new`, snap.amount, updatedNum)
                        let x: any
                        x = await connection.manager.getRepository(SnapshotItemEntity).update(snap.id, { amount: updatedNum })
                        console.log('    success:', x?.affected > 0)
                    }
                }
            } catch (err) {
                console.log(`Personal distr failed for ${userName}`)
                console.log(err)
            }
        }

        await connection.manager.getRepository(UserEntity).update(user.uuid, { blacklisted: blacklist })
    }
    console.log('Getting fucked: ', assetDeleteList)
    await connection.close()
}


main()