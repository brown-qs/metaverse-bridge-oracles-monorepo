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

const list = [
    'UnicFb910'
]

const gameId = 'minecraft-carnage-2022-03-20'

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

        for(let j=0; j<gganbus.length; j++) {
            
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

                const x = await connection.manager.getRepository(InventoryEntity).save(ent)

                /**/
                console.log('    success:', !!x)
                console.log('new num', gganbu.amount)
            } else {
                const newNum = (Number.parseFloat(inv.amount) + (Number.parseFloat(gganbu.amount) * gganbu.material.multiplier )).toString()
                console.log(`   old nums`, inv.amount, newNum)
                const x = await connection.manager.getRepository(InventoryEntity).update(inv.id, {amount: newNum})
                console.log('    success:', x?.affected > 0)
            }
        }
    }
    await connection.close()
}


main()