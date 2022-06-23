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
import { ChainEntity } from '../src/chain/chain.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'

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

const reports: any[] = [{"id":227,"created_at":"2022-06-19T16:59:32.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"35fba7eee753485d8c1dea15a3515d84","name":"buchachoss","ip_address":"\/185.237.80.239:40416","game_id":"minecraft-carnage-2022-06-19","reported_by":"Plugin","reason":"Attempted string duplication glitch using water at -473,62,825","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":228,"created_at":"2022-06-19T17:50:18.000000Z","updated_at":"2022-06-19T17:50:18.000000Z","player_id":"4e591dcba4694f3b8baee24869bcbc89","name":"ShineKami","ip_address":"\/176.171.89.109:37446","game_id":"minecraft-carnage-2022-06-19","reported_by":"VitruviusBeanie","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=1p_dmyHO4RQ&amp;ab_channel=nolan","game_pass":1,"personal_share":1,"gganbu":1},{"id":229,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-19T19:08:12.000000Z","player_id":"8bc9d19c2611486caecc65e5b0be1c87","name":"SooperSama","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/suJpANsI5A8","game_pass":1,"personal_share":1,"gganbu":1},{"id":230,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T18:44:09.000000Z","player_id":"b4b21cda8e264571813ad9f4dacc61c4","name":"JohnGalt9","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=I1DU_918Eok","game_pass":1,"personal_share":1,"gganbu":1},{"id":231,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"9eda2c01ded74ad3b33de57c02646f44","name":"Geforce_Ti","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty, none provided 3x","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":0},{"id":232,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T12:44:17.000000Z","player_id":"31ce5a2cab82492794c3ac0741e9cc84","name":"Ace556","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=lOS0wHACII4","game_pass":1,"personal_share":1,"gganbu":1},{"id":233,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T17:17:26.000000Z","player_id":"f4c80377e5c045eb991c84e44dad2bfa","name":"Fury4Sama","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=wi1ubExs6CQ","game_pass":1,"personal_share":1,"gganbu":1},{"id":234,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T21:04:49.000000Z","player_id":"ac4fcc50d8ed4c66a1b6d5bf0a6c5f72","name":"Arpman","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/xwYdRyECLy0","game_pass":1,"personal_share":1,"gganbu":1},{"id":235,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T19:05:40.000000Z","player_id":"4f5179114f154215bb9651c08a95a960","name":"SamaSuccess","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty, none provided 2x","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":0},{"id":236,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"c4ca440b90b944b49467eae18b34e3e0","name":"craftedsama","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":237,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"6077feef8b3f47b0bb50b8d8c173527b","name":"viindiesel","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty, incomplete video","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=QIyEJMla-zg","game_pass":1,"personal_share":0,"gganbu":1},{"id":238,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T04:33:03.000000Z","player_id":"aac6ac643baf4d52948bf18058da09f7","name":"OzOn185Hz","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty, Clear Water Texture Pack","state":"done","result":"penalty","evidence":"https:\/\/youtu.be\/wR29HmU95WY","game_pass":1,"personal_share":0,"gganbu":1},{"id":239,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T20:16:49.000000Z","player_id":"e9f3edd393fe457a9401830dd9079761","name":"Jlsalcedo1997","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=Ccf_DOxSV6g","game_pass":1,"personal_share":1,"gganbu":1},{"id":240,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-19T19:08:12.000000Z","player_id":"3978b871ec6a4823810e0788874ec204","name":"greenpone","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=uYcP7mZ15Oc","game_pass":1,"personal_share":1,"gganbu":1},{"id":241,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"1821def2bb054fa79299e74c56cbb181","name":"Diogaite4win","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":242,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"2241f927482442c9a2c3f03ef6ded56f","name":"Orangenox1","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty, incomplete video, no F3","state":"done","result":"penalty","evidence":"https:\/\/youtu.be\/b7GTZ6kRj4A","game_pass":1,"personal_share":0,"gganbu":1},{"id":243,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T18:43:35.000000Z","player_id":"e15bfa6129784e53a1048569fb438d04","name":"FilthyNiki","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/s-ctTiBNb0I","game_pass":1,"personal_share":1,"gganbu":1},{"id":244,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T10:24:37.000000Z","player_id":"4854c35c2ae0423a973b96784adbf81b","name":"DottyBangsJr","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/7_JR9uNN58w","game_pass":1,"personal_share":1,"gganbu":1},{"id":245,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T11:45:41.000000Z","player_id":"444453b8091a4752a06ed828c107888d","name":"BigSals1","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/2BMjafMKeSc","game_pass":1,"personal_share":1,"gganbu":1},{"id":246,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T20:37:35.000000Z","player_id":"ab83c27c54aa4a14b550464e62a0f87a","name":"axantasama","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/5867yNy_pig_pig","game_pass":1,"personal_share":1,"gganbu":1},{"id":247,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T18:00:02.000000Z","player_id":"0cb377730d884e18aa7e3c129ef71945","name":"polkamendot","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":248,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T18:46:09.000000Z","player_id":"f5d4e5e8807c4e1ba6881604b0b4e075","name":"Msama319","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Previous penalty","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":249,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-19T19:08:12.000000Z","player_id":"2a1e74e078804deda3d1df9fb1996ed1","name":"Bloob_bloo_balls","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (exp)","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":250,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T09:52:38.000000Z","player_id":"9cb8562eef7a4847a4b006d9f37051a3","name":"Spitfire423","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (exp)","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/bVce-hpK67A","game_pass":1,"personal_share":1,"gganbu":1},{"id":251,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-21T02:34:33.000000Z","player_id":"8791dca09b9d43e5b9c4066536946a76","name":"FranDancoina","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (exp)","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=LamOeadNFSg","game_pass":1,"personal_share":1,"gganbu":1},{"id":252,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T16:33:30.000000Z","player_id":"c20a3dd18ae94d2ca4dfaf568188e5d4","name":"OldVikinGG","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (exp), Lava glitch","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=KLsXzUPHW3w","game_pass":1,"personal_share":0,"gganbu":0},{"id":253,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T19:32:37.000000Z","player_id":"be485e5b02ea4cf9a5f88245d883a8c1","name":"DviineBean","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (iron)","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=a5wMVtrSQRo","game_pass":1,"personal_share":1,"gganbu":1},{"id":254,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-19T19:08:12.000000Z","player_id":"8beee69f5c7e403f9efb88d0c62d60c8","name":"B3NNN3T","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (iron)","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=yRNYY6Abi-s","game_pass":1,"personal_share":1,"gganbu":1},{"id":255,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T08:35:46.000000Z","player_id":"f9d6b153af55436e8cc5bf0f27e5fedb","name":"MovrSama88","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (iron)","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/5wk6nVndxZk","game_pass":1,"personal_share":1,"gganbu":1},{"id":256,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T17:46:59.000000Z","player_id":"ada1688b466c45a2927ca3dcbcd57832","name":"RichardBenson69","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (gold)","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/swcEgT7LzFs","game_pass":1,"personal_share":1,"gganbu":1},{"id":257,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T18:51:02.000000Z","player_id":"976b2c88ae9e4f589dcdb1d77d3fb53e","name":"FinalBossSama","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (gold)","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=NN1NmsegYTI&amp;ab_channel=BRIGHT","game_pass":1,"personal_share":1,"gganbu":1},{"id":258,"created_at":"2022-06-19T19:08:12.000000Z","updated_at":"2022-06-20T13:03:57.000000Z","player_id":"baa25be8518f489aa53d2c7f510533ec","name":"IgorDubai2","ip_address":null,"game_id":"minecraft-carnage-2022-06-19","reported_by":"System","reason":"Leaderboard (gold)","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/AW59RtJuJRM","game_pass":1,"personal_share":1,"gganbu":1}]
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
            entities: [
                UserEntity,
                SnapshotItemEntity,
                InventoryEntity,
                TextureEntity,
                SkinEntity,
                PlayerScoreEntity,
                MaterialEntity,
                GameEntity,
                GameTypeEntity,
                AchievementEntity,
                PlayerAchievementEntity,
                SecretEntity,
                AssetEntity,
                SummonEntity,
                PlaySessionEntity,
                PlaySessionStatEntity,
                GganbuEntity,
                SnaplogEntity,
                GameItemTypeEntity,
                PlayerGameItemEntity,
                GameScoreTypeEntity,
                ChainEntity,
                CollectionEntity,
                CollectionFragmentEntity,
                CompositeCollectionFragmentEntity,
                CompositeAssetEntity,
                CompositePartEntity,
                SyntheticPartEntity,
                SyntheticItemEntity,
                ResourceInventoryEntity,
                ResourceInventoryOffsetEntity
            ],
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

        const blacklist = !result || result === 'ban' || result === 'pending'

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
            console.log(`${user?.userName} - blacklisted: ${blacklist}`)
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
                    console.log(`    updating`, snap.material.name, snap.amount, updatedNum)
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
                        console.log(`    updating`, snap.material.name, snap.amount, updatedNum)
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