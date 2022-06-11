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

const reports: any[] = [{"id":166,"created_at":null,"updated_at":null,"player_id":"3978b871ec6a4823810e0788874ec204","name":"greenpone","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"BeanieSama","reason":"Possible x-ray","state":"done","result":"penalty","evidence":"no video provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":167,"created_at":null,"updated_at":null,"player_id":"42cb73570a3742a881b5dc4fabcc466f","name":"KillerSama66 ","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Possible player ESP","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=kH9np1Yu9aw","game_pass":1,"personal_share":1,"gganbu":1},{"id":168,"created_at":null,"updated_at":null,"player_id":"9eda2c01ded74ad3b33de57c02646f44","name":"Geforce_Ti","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Possible Hacked Client","state":"done","result":"penalty","evidence":"no video provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":169,"created_at":null,"updated_at":null,"player_id":"b93d99f51fe8464080d202979b46ff62","name":"MattyDuck","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"String Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/JfPEbE9MHgU","game_pass":1,"personal_share":1,"gganbu":1},{"id":170,"created_at":null,"updated_at":null,"player_id":"96549b8878724226abbe2d32893cc375","name":"Pvps1","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Iron Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/EDSs3weyPrQ","game_pass":1,"personal_share":1,"gganbu":1},{"id":171,"created_at":null,"updated_at":null,"player_id":"e9f3edd393fe457a9401830dd9079761","name":"Jlsalcedo1997","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"String Leaderboard (recording sent too late)","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=7hfQmriXQps","game_pass":1,"personal_share":0,"gganbu":1},{"id":172,"created_at":null,"updated_at":null,"player_id":"fc5b3171ada94f778d3c9a856128a9a8","name":"H1ghlighter","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Iron Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=G1rj3BVIkS8","game_pass":1,"personal_share":1,"gganbu":1},{"id":173,"created_at":null,"updated_at":null,"player_id":"dcfcfc83da254e3aac22d46d1a2b9ddb","name":"DominicSpeed","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Gold Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=22KObCdEw5U","game_pass":1,"personal_share":1,"gganbu":1},{"id":174,"created_at":null,"updated_at":null,"player_id":"ada1688b466c45a2927ca3dcbcd57832","name":"RichardBenson69","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Gold Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=XL_ifmIxdzc","game_pass":1,"personal_share":1,"gganbu":1},{"id":175,"created_at":null,"updated_at":null,"player_id":"a27e2506887b4cfca9b59daadf8b7b5f","name":"TicklerSniffler","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Wood Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=7HOFlzc05Mw","game_pass":1,"personal_share":1,"gganbu":1},{"id":176,"created_at":null,"updated_at":null,"player_id":"8bc9d19c2611486caecc65e5b0be1c87","name":"SooperSama","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"String Leaderboard (clear water used)","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=uVUHjDhOgV8&ab_channel=IgnasBrazionis","game_pass":1,"personal_share":0,"gganbu":1},{"id":177,"created_at":null,"updated_at":null,"player_id":"1c95c87da49d4d66a9a864b6f098bce7","name":"Moonsama263","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Gold Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=IZOb1zG36c0","game_pass":1,"personal_share":1,"gganbu":1},{"id":178,"created_at":null,"updated_at":null,"player_id":"973d024dfc1e4e728b95778999012452","name":"DemonRey","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Iron Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=r8RKDeu6Ikc","game_pass":1,"personal_share":1,"gganbu":1},{"id":179,"created_at":null,"updated_at":null,"player_id":"ed45bf1f20f54e9abad9a600065b484f","name":"Eben_Lt","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Last week recording missing x1","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/oQfKPvoSgIM","game_pass":1,"personal_share":1,"gganbu":1},{"id":180,"created_at":null,"updated_at":null,"player_id":"5d8ba9fdf67e45c9b63ece8afe43a493","name":"GameOverMachine","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Last week recording missing x1","state":"done","result":"penalty","evidence":"no video provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":181,"created_at":null,"updated_at":null,"player_id":"6432d40f399b4c7689db4a2ff64332bb","name":"ToxicBirdie999","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Last week recording missing x1","state":"done","result":"penalty","evidence":"no video provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":182,"created_at":null,"updated_at":null,"player_id":"aac6ac643baf4d52948bf18058da09f7","name":"OzOn185Hz","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"VitruviusBeanie","reason":"Last week recording missing x1","state":"done","result":"penalty","evidence":"no video provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":183,"created_at":null,"updated_at":null,"player_id":"b4b21cda8e264571813ad9f4dacc61c4","name":"JohnGalt9","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"System","reason":"Missing recording (video doesnt cover screen)","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=YJrx9cC4TkM","game_pass":1,"personal_share":0,"gganbu":1},{"id":184,"created_at":null,"updated_at":null,"player_id":"15933356a73243f18af46c1f3b9c8d32","name":"Delia987124786","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"System","reason":"Missing recording","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/oPmwdT0AhfY","game_pass":1,"personal_share":1,"gganbu":1},{"id":185,"created_at":null,"updated_at":null,"player_id":"93fb1e8002f849d682779f82374bacb4","name":"AutoBOT404","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"System","reason":"Missing recording","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/FtF10sUd68A","game_pass":1,"personal_share":1,"gganbu":1},{"id":186,"created_at":null,"updated_at":null,"player_id":"34af312703c4456d8799f4cf32c72208","name":"TheFreeOwl","ip_address":null,"game_id":"minecraft-carnage-2022-06-05","reported_by":"System","reason":"Missing recording","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/jAAgsidnz4I","game_pass":1,"personal_share":1,"gganbu":1}]

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

        const blacklist = !result || result === 'ban'

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