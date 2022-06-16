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

const reports: any[] = [{"id":203,"created_at":null,"updated_at":null,"player_id":"8791dca09b9d43e5b9c4066536946a76","name":"FranDancoina","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"FwogXD","reason":"Possible X-Ray","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=V5a8yenPbVk","game_pass":1,"personal_share":1,"gganbu":1},{"id":204,"created_at":null,"updated_at":null,"player_id":"01939f96d0b24a8895610d93d4533582","name":"zCocopops","ip_address":"\/87.11.47.99:52270","game_id":"minecraft-carnage-2022-06-12","reported_by":"FwogXD","reason":"Possible player ESP, sus mining to diamonds","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/RdhtjM0qybg","game_pass":1,"personal_share":1,"gganbu":1},{"id":205,"created_at":null,"updated_at":null,"player_id":"6077feef8b3f47b0bb50b8d8c173527b","name":"viindiesel","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"BeanieSama","reason":"Possible anti knockback","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":206,"created_at":null,"updated_at":null,"player_id":"c04a2ff0050541688fefae9c47120b12","name":"SuperSizeMe212","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Whatafaaak","reason":"Hacked Client","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/36bvPi61j50","game_pass":1,"personal_share":1,"gganbu":1},{"id":207,"created_at":null,"updated_at":null,"player_id":"c4ca440b90b944b49467eae18b34e3e0","name":"craftedsama","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Kartus","reason":"Hacked Client","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":208,"created_at":null,"updated_at":null,"player_id":"4f5179114f154215bb9651c08a95a960","name":"SamaSuccess","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Gold Leaderboard","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":209,"created_at":null,"updated_at":null,"player_id":"42cb73570a3742a881b5dc4fabcc466f","name":"KillerSama66","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Gold Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=rVBpjwGV1rY","game_pass":1,"personal_share":1,"gganbu":1},{"id":210,"created_at":null,"updated_at":null,"player_id":"08c346db77fb455aa10187eb34ed42ec","name":"FL0WC4RN4G3","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Gold Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/J1wSnoKj1I4","game_pass":1,"personal_share":1,"gganbu":1},{"id":211,"created_at":null,"updated_at":null,"player_id":"baa25be8518f489aa53d2c7f510533ec","name":"IgorDubai2","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Gold Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/bHASrQxTM40","game_pass":1,"personal_share":1,"gganbu":1},{"id":212,"created_at":null,"updated_at":null,"player_id":"f932e276e5084eb9adb50ee1b08e71b5","name":"Burgaz","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Iron Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=rUZU6ixLRqk","game_pass":1,"personal_share":1,"gganbu":1},{"id":213,"created_at":null,"updated_at":null,"player_id":"4034b7f449164fd4ad5b5ae3969a1535","name":"_BjornIronside","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Iron Leaderboard","state":"pending","result":null,"evidence":"https:\/\/www.youtube.com\/watch?v=uHGzMEVLxr0","game_pass":null,"personal_share":null,"gganbu":null},{"id":214,"created_at":null,"updated_at":null,"player_id":"ac4fcc50d8ed4c66a1b6d5bf0a6c5f72","name":"Arpman","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"Iron Leaderboard","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":215,"created_at":null,"updated_at":null,"player_id":"56f6246947b642c2a6aceac1865b4424","name":"QuoffWaffles","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"String Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/cmDR-oWMy5g","game_pass":1,"personal_share":1,"gganbu":1},{"id":216,"created_at":null,"updated_at":null,"player_id":"f4c80377e5c045eb991c84e44dad2bfa","name":"Fury4Sama","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"String Leaderboard","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":217,"created_at":null,"updated_at":null,"player_id":"40f2ec94193b4edcbdbf5160e226e146","name":"LiimpNoodle","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"String Leaderboard, https:\/\/www.twitch.tv\/videos\/1504576300","state":"done","result":"clear","evidence":"video redacted because of visible personal information","game_pass":1,"personal_share":1,"gganbu":1},{"id":218,"created_at":null,"updated_at":null,"player_id":"31ce5a2cab82492794c3ac0741e9cc84","name":"Ace556","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"Leaderboard","reason":"XP Leaderboard, missed video deadline","state":"done","result":"penalty","evidence":"https:\/\/youtu.be\/5uTs-Rx7MmQ","game_pass":1,"personal_share":0,"gganbu":1},{"id":219,"created_at":null,"updated_at":null,"player_id":"6432d40f399b4c7689db4a2ff64332bb","name":"ToxicBirdie999","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"System","reason":"No recording 2022-06-05","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/Rrms-JmiEMk","game_pass":1,"personal_share":1,"gganbu":1},{"id":221,"created_at":null,"updated_at":null,"player_id":"9eda2c01ded74ad3b33de57c02646f44","name":"Geforce_Ti","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"System","reason":"No recording 2022-06-05, 2x no video","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":222,"created_at":null,"updated_at":null,"player_id":"b4b21cda8e264571813ad9f4dacc61c4","name":"JohnGalt9","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"System","reason":"Bad recording 2022-06-05, 3x offense","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=p7ZCnw0ORMs","game_pass":1,"personal_share":0,"gganbu":1},{"id":223,"created_at":null,"updated_at":null,"player_id":"8bc9d19c2611486caecc65e5b0be1c87","name":"SooperSama","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"System","reason":"Clear Water 2022-06-05","state":"pending","result":null,"evidence":"https:\/\/youtu.be\/xTF0o740Sr4","game_pass":null,"personal_share":null,"gganbu":null},{"id":224,"created_at":null,"updated_at":null,"player_id":"748c2054a53248f787ca6033a21442d6","name":"Doylerk","ip_address":null,"game_id":"minecraft-carnage-2022-06-12","reported_by":"VitruviusBeanie","reason":"Anti knockback, kill aura","state":"pending","result":null,"evidence":"https:\/\/youtu.be\/KQDSDJzEKS0\r\nhttps:\/\/www.youtube.com\/watch?v=suTetl74JE4","game_pass":null,"personal_share":null,"gganbu":null}]

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