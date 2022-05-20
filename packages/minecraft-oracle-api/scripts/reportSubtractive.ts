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

const reports: any[] = [
    {
        "id": 67,
        "created_at": "2022-05-15T17:33:41.000000Z",
        "updated_at": "2022-05-15T17:33:41.000000Z",
        "player_id": "3c6ae37137b24e758fe58eca26097b6a",
        "name": "AslanHzTicket",
        "ip_address": null,
        "game_id": "minecraft-carnage-2022-05-15",
        "reported_by": "VitruviusBeanie",
        "reason": "Spider mobfarm",
        "state": "done",
        "result": "penalty",
        "evidence": "https:\/\/youtu.be\/_8iRfvy2QHI",
        "game_pass": 1,
        "personal_share": 0,
        "gganbu": 0
    },
    {
        "id": 68,
        "created_at": "2022-05-15T17:33:41.000000Z",
        "updated_at": "2022-05-15T17:33:41.000000Z",
        "player_id": "41037fdf05da4cd39fb0ae88b4cdfe8f",
        "name": "mclend1",
        "ip_address": null,
        "game_id": "minecraft-carnage-2022-05-15",
        "reported_by": "VitruviusBeanie",
        "reason": "Spider mobfarm",
        "state": "done",
        "result": "penalty",
        "evidence": "https:\/\/youtu.be\/gMlv5UGgB78",
        "game_pass": 1,
        "personal_share": 0,
        "gganbu": 0
    }
]
const gameId = 'minecraft-carnage-2022-05-15'

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
                ResourceInventoryEntity
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