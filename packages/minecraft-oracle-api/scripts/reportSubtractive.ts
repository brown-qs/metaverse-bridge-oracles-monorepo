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
    string: number
}

const KEYMAP: { [key: string]: string } = {
    exp: 'EXP',
    wood: 'OAK_LOG',
    iron: 'IRON_INGOT',
    gold: 'GOLD_INGOT',
    stone: 'COBBLESTONE',
    grain: 'WHEAT',
    string: 'STRING'
}

const reports: any[] = [{"id":38,"created_at":null,"updated_at":null,"player_id":"e15bfa6129784e53a1048569fb438d04","name":"FilthyNiki","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"Xray","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":39,"created_at":null,"updated_at":null,"player_id":"ba5bd825a70b4d0ca7d9d851254b0eb9","name":"FreeMedusa84686","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"Freelook","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/Q-hSvKEnxKw","game_pass":1,"personal_share":1,"gganbu":1},{"id":40,"created_at":"2022-05-08T17:01:47.000000Z","updated_at":"2022-05-08T17:01:47.000000Z","player_id":"9491bd46c2814603ae3c2ac876b6f1e0","name":"MonkeCrypto","ip_address":"\/185.177.126.144:43254","game_id":"minecraft-carnage-2022-05-08","reported_by":"Plugin","reason":"Attempted string duplication glitch using water at -1434,61,-1654","state":"done","result":"clear","evidence":"none required","game_pass":1,"personal_share":1,"gganbu":1},{"id":41,"created_at":null,"updated_at":null,"player_id":"d33ad8c4fe1e429f882afe4c9e1feabf","name":"samachelles","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP (reach)","state":"done","result":"penalty","evidence":"recording is corrupt","game_pass":1,"personal_share":0,"gganbu":1},{"id":42,"created_at":null,"updated_at":null,"player_id":"45e282cfc887432cb4d9da7765b36886","name":"KaliBat","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"Kartus","reason":"PvP (reach)","state":"done","result":"penalty","evidence":"no response","game_pass":1,"personal_share":0,"gganbu":1},{"id":43,"created_at":null,"updated_at":null,"player_id":"0e1bf90bf4c34482a58070ca6d570c01","name":"Ornal_Juice","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"Part 1: https:\/\/youtu.be\/yJ96jpsz6V8\r\nPart 2: https:\/\/youtu.be\/JqjZrgfNmGo\r\nPart 3: https:\/\/youtu.be\/AiOrth42OwM\r\nPart 4: https:\/\/youtu.be\/AhACc0bihqo\r\nPart 5: https:\/\/youtu.be\/h5nwW7WW8lU\r\nPart 6: https:\/\/youtu.be\/LDleBpktBEk\r\nPart 7: https:\/\/youtu.be\/lx2r9PCQGBI\r\nPart 8: https:\/\/youtu.be\/L-WQ8M63IWw\r\nPart 9: https:\/\/youtu.be\/LFRrBseXfIo\r\nPart 10: https:\/\/youtu.be\/lsSarngIVRM\r\nPart 11: https:\/\/youtu.be\/VE6r993TuCs","game_pass":1,"personal_share":1,"gganbu":1},{"id":44,"created_at":null,"updated_at":null,"player_id":"a58b534dcf8d482eb87ace3ba2c7ac32","name":"CordedCape38118","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=Ody_VWbFIA0&ab_channel=SongggPvP\r\nMissing F3 screen","game_pass":1,"personal_share":1,"gganbu":1},{"id":45,"created_at":null,"updated_at":null,"player_id":"d166663b9cb34875a14669f537e43df4","name":"PokyBeatle39573","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP","state":"done","result":"penalty","evidence":"no response","game_pass":1,"personal_share":0,"gganbu":1},{"id":46,"created_at":null,"updated_at":null,"player_id":"94e07f053a5b4e97bc124473ec1ca6a3","name":"zTheDarkAlex","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"Donniebigbags","reason":"PvP","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=2uK1PHA5efU&ab_channel=zTheDarkAlex\r\n\r\n-> invalid footage","game_pass":1,"personal_share":0,"gganbu":1},{"id":47,"created_at":null,"updated_at":null,"player_id":"743249e5-d29c-4c67-a679-52a131a5a14c","name":"HugeStarling654","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=ZSfkkihBMvI&ab_channel=zTheDarkAlex","game_pass":1,"personal_share":1,"gganbu":1},{"id":48,"created_at":null,"updated_at":null,"player_id":"a130814b-4c9f-4668-8a23-2aa2a0186bae","name":"DrierGorilla448","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=ba4tqG9Fy3Y&ab_channel=greaneye","game_pass":1,"personal_share":1,"gganbu":1},{"id":49,"created_at":null,"updated_at":null,"player_id":"8beee69f-5c7e-403f-9efb-88d0c62d60c8","name":"B3NNN3T","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=XuqSihUac3U","game_pass":1,"personal_share":1,"gganbu":1},{"id":50,"created_at":null,"updated_at":null,"player_id":"aec6cea1-c7e1-4c03-bac0-884982c08a45","name":"Leviticus2933","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/trovo.live\/video\/ltv-102834457_102834457_387702300459728072?ltab=videos\r\nMissing F3 screen","game_pass":1,"personal_share":1,"gganbu":1},{"id":51,"created_at":null,"updated_at":null,"player_id":"9491bd46-c281-4603-ae3c-2ac876b6f1e0","name":"MonkeCrypto","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=pszQnka8RKM\r\nMissing F3 screen halfway into the game","game_pass":1,"personal_share":1,"gganbu":1},{"id":52,"created_at":null,"updated_at":null,"player_id":"f0f3b6a6-8c54-4f6b-baa8-c93d697a0096","name":"LunaticHigh12","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=JRO18NOdNV0","game_pass":1,"personal_share":1,"gganbu":1},{"id":54,"created_at":null,"updated_at":null,"player_id":"654e96bf-e722-4d7d-8777-7667b4074d4f","name":"SamaSlayer","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=fd0Y_IOFrkg&ab_channel=BRIGHT","game_pass":1,"personal_share":1,"gganbu":1},{"id":55,"created_at":null,"updated_at":null,"player_id":"aef4fd97-9e7a-4949-92c3-568f23236e5d","name":"UnicFb910","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/km-FjjtFOxo\r\nMissing F3 screen","game_pass":1,"personal_share":1,"gganbu":1},{"id":56,"created_at":null,"updated_at":null,"player_id":"c52b719c-b2c2-4fe2-bc67-9ea8249c9222","name":"_frsh","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.twitch.tv\/videos\/1478541200","game_pass":1,"personal_share":1,"gganbu":1},{"id":57,"created_at":null,"updated_at":null,"player_id":"1cba373bdff94fd983439f05dc382f46","name":"PomFighter","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"Kill Aura","state":"done","result":"ban","evidence":"PoV BeanieSama: https:\/\/youtu.be\/53vVcH37mDw\r\nPoV VitruviusBeanie: https:\/\/youtu.be\/DKJHyTtio84","game_pass":0,"personal_share":0,"gganbu":0},{"id":58,"created_at":null,"updated_at":null,"player_id":"b4e74e2735ba45f5b2a2686eee714cd5","name":"Rigo0","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"High damage","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":59,"created_at":null,"updated_at":null,"player_id":"b3b5ccdc62274a3c963e37b96aa3ff1a","name":"VinkenzFight5","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP (associated with PomFighter)","state":"done","result":"clear","evidence":"none required","game_pass":1,"personal_share":1,"gganbu":1},{"id":60,"created_at":null,"updated_at":null,"player_id":"1484d2559a16457a9bcd1ce95798bf33","name":"PiranhaFight","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP (associated with PomFighter)","state":"done","result":"clear","evidence":"none required","game_pass":1,"personal_share":1,"gganbu":1},{"id":61,"created_at":null,"updated_at":null,"player_id":"e041fbc3cfb9455999b21d17eb8da2d7","name":"MomobeeFight","ip_address":null,"game_id":"minecraft-carnage-2022-05-08","reported_by":"HeaX_MC","reason":"PvP (associated with PomFighter)","state":"done","result":"clear","evidence":"none required","game_pass":1,"personal_share":1,"gganbu":1}]

const gameId = 'minecraft-carnage-2022-05-08'

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