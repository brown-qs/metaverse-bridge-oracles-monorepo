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
import { InventoryService } from '../src/playerinventory/inventory.service'
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

const KEYMAP: {[key: string]: string} = {
    exp: 'EXP',
    wood: 'OAK_LOG',
    iron: 'IRON_INGOT',
    gold: 'GOLD_INGOT',
    stone: 'COBBLESTONE',
    grain: 'WHEAT'
}

const reports = [{"id":2,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"c20a3dd18ae94d2ca4dfaf568188e5d4","name":"MoonVikinG1","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Suspected Xray","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=FSpddJAZ6IE","game_pass":1,"personal_share":1,"gganbu":1},{"id":3,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"42096bc4e38a4798b102ce75fd6d8ca9","name":"Klinggaard","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Suspected Xray","state":"done","result":"clear","evidence":"https:\/\/www.twitch.tv\/videos\/1465716177","game_pass":1,"personal_share":1,"gganbu":1},{"id":4,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"4034b7f449164fd4ad5b5ae3969a1535","name":"YMSpring1","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Suspected Xray","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":5,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"f5d4e5e8807c4e1ba6881604b0b4e075","name":"Msama319","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":6,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"66160ccf79cd4675a80f0e4e701dd3bc","name":"Gawanava","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=_7UFJFlKlLM","game_pass":1,"personal_share":1,"gganbu":1},{"id":7,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"56f6246947b642c2a6aceac1865b4424","name":"QuoffWaffles","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/mg3libQfmiA","game_pass":1,"personal_share":1,"gganbu":1},{"id":8,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"d33ad8c4fe1e429f882afe4c9e1feabf","name":"samachelles","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/kQ_noSJ0BtI","game_pass":1,"personal_share":1,"gganbu":1},{"id":9,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"f796872f7cd84e77b81bece2791ff8d4","name":"mcbitterr","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/JSwLeRwRNCQ","game_pass":1,"personal_share":1,"gganbu":1},{"id":10,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"24cd52b79b324574896edec4eacfe54d","name":"tempip","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/rQuDUHUHTdc","game_pass":1,"personal_share":1,"gganbu":1},{"id":11,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"0cb377730d884e18aa7e3c129ef71945","name":"polkamendot","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"penalty","evidence":"https:\/\/youtu.be\/NeSFq1VYkco","game_pass":1,"personal_share":0,"gganbu":1},{"id":12,"created_at":"2022-04-26T17:08:47.000000Z","updated_at":"2022-04-26T17:08:47.000000Z","player_id":"f529192cb4184cd9aa7baa95d97f7dcf","name":"_swey","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/www.twitch.tv\/videos\/1465728533","game_pass":1,"personal_share":1,"gganbu":1},{"id":13,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"4506649f3af2423b95143f26647fd5a5","name":"PattayaMonster","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":14,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"db42bd31881a44d3a9a0345ff41c4c5d","name":"RikkoTroom","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":15,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"aec6cea1c7e14c03bac0884982c08a45","name":"Leviticus2933","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/trovo.live\/video\/ltv-102834457_102834457_387702299580049460","game_pass":1,"personal_share":1,"gganbu":1},{"id":16,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"aec6cea1c7e14c03bac0884982c08a45","name":"Leviticus2933","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Suspected ESP","state":"done","result":"clear","evidence":"https:\/\/trovo.live\/video\/ltv-102834457_102834457_387702299580049460","game_pass":1,"personal_share":1,"gganbu":1},{"id":17,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"fc8a704dec684dfca7bff76ad3b57cc6","name":"ilvascio","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/whqJWP-SDiY","game_pass":1,"personal_share":1,"gganbu":1},{"id":18,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"13bef61159194a9f89b580307f361ece","name":"Cr1xtv","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=_hBsfTxeA2E","game_pass":1,"personal_share":1,"gganbu":1},{"id":19,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"1ff92ad8f20545e69bf4c7dc818d8576","name":"masama004","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/D5HnvnZ-08o","game_pass":1,"personal_share":1,"gganbu":1},{"id":20,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"9b52b3472f4e4a1cb20a62f3ae8c6530","name":"kiskiks","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=RSRSxyQi7Wc","game_pass":1,"personal_share":1,"gganbu":1},{"id":21,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"a8b7a38d55d9438f815a7d06666ded46","name":"DSama","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"observed by team member","game_pass":1,"personal_share":1,"gganbu":1},{"id":22,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"9e64f9a326344c9faf3538069de87402","name":"Enryu_____","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/BVtJfypCD6Y","game_pass":1,"personal_share":1,"gganbu":1},{"id":23,"created_at":"2022-04-26T17:08:48.000000Z","updated_at":"2022-04-26T17:08:48.000000Z","player_id":"045e98e94a1a47b29f9376856fa90b63","name":"eunn296","ip_address":"","game_id":"minecraft-carnage-2022-04-24","reported_by":"HeaX_MC","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=LNRBFTQ-ego","game_pass":1,"personal_share":1,"gganbu":1}]
const gameId = 'minecraft-carnage-2022-04-24'

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

        if (gganbuOn) {
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
                    const amount = (Number.parseFloat(gganbu.amount) * adjustedPower / powerSum).toString()
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
                    //DRY const x = await connection.manager.getRepository(SnapshotItemEntity).save(ent)

                    console.log('    success:', !!x)
                    console.log('    new num', amount)
                } else {
                    const amount = (Number.parseFloat(gganbu.amount) * adjustedPower / powerSum)
                    const updatedNum = (Number.parseFloat(snap.amount) + amount).toString()
                    //continue
                    console.log(`    old/new`, snap.amount, updatedNum)
                    let x: any
                    //DRY const x = await connection.manager.getRepository(SnapshotItemEntity).update(snap.id, { amount: updatedNum })
                    console.log('    success:', x?.affected > 0)
                }
            }
        }

        if (personalShareOn) {
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
                        const amount = amo.toString()
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
                        //DRY const x = await connection.manager.getRepository(SnapshotItemEntity).save(ent)
                        console.log('    success:', !!x)
                        
                    } else {
                        const updatedNum = (Number.parseFloat(snap.amount) + amo).toString()
                        console.log(`    updating. old/new`, snap.amount, updatedNum)
                        let x: any
                        //DRY const x = await connection.manager.getRepository(SnapshotItemEntity).update(snap.id, { amount: updatedNum })
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