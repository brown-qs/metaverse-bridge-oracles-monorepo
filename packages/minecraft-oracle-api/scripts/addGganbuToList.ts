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

const list: { [key: string]: string } = {
    "386c595372bc4258b196a841a1922cf3": "Momsama",
}

const gameId = 'minecraft-carnage-2022-04-17'

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
            entities: [GameScoreTypeEntity, GameItemTypeEntity, PlayerGameItemEntity, MaterialEntity, SnapshotItemEntity, MinecraftUserEntity, TextureEntity, AssetEntity, SummonEntity, InventoryEntity, PlaySessionEntity, PlaySessionStatEntity, SkinEntity, GameEntity, GameTypeEntity, AchievementEntity, PlayerAchievementEntity, PlayerScoreEntity, GganbuEntity, SnaplogEntity],
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
    const game = await connection.manager.getRepository(GameEntity).findOne({ where: { id: gameId} })

    if (!game) {
        console.log('game not found')
        return
    }

    const gganbus = await connection.manager.getRepository(GganbuEntity).find({ where: { game: { id: gameId } }, relations: ['material'] })
    const powerSum = gganbus?.[0]?.powerSum
    console.log('GGANBUS')
    console.log('weight sum:', powerSum)
    const users = Object.keys(list)
    //console.log(gganbus)
    for (let i = 0; i < users.length; i++) {
        console.log('Processing:', list[users[i]])
        const user = await connection.manager.getRepository(MinecraftUserEntity).findOne({ uuid: users[i] })
        if (!user) {
            console.error(`Non existant user: ${list[i]}`)
            continue
        } else {
            console.log(user?.userName)
        }

        let adjustedPower = 0
        
        const stat = await connection.manager.getRepository(PlaySessionStatEntity).findOne({ where: { id: PlaySessionStatService.calculateId({ uuid: user.uuid, gameId: game.id }) } })

        if (!stat) {
            console.error(`No stat for user: ${list[i]}`)
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
                console.log('new amount', mat.name, amount)
                //continue
                const ent = await connection.manager.getRepository(SnapshotItemEntity).create({
                    id: SnapshotService.calculateId({ uuid: user.uuid, materialName: gganbu.material.name, gameId: game.id }),
                    amount,
                    material: mat,
                    owner: user,
                    game,
                })

                const x = await connection.manager.getRepository(SnapshotItemEntity).save(ent)

                /**/
                console.log('    success:', !!x)
                console.log('new num', amount)
            } else {
                const amount = (Number.parseFloat(gganbu.amount) * adjustedPower / powerSum)
                const updatedNum = (Number.parseFloat(snap.amount) + amount).toString()
                console.log('updated amount', updatedNum)
                //continue
                console.log(`   old/new`, snap.amount, updatedNum)
                const x = await connection.manager.getRepository(SnapshotItemEntity).update(snap.id, { amount: updatedNum })
                console.log('    success:', x?.affected > 0)
            }
        }
    }
    await connection.close()
}


main()