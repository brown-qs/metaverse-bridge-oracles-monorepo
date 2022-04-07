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
    "a32c892fc3c9455c87e95fa7c1a184f6": "gnooee",
    "944cadaca5d84223bd2090d74b1d3911": "Daggi5",
    "0b25ee2756c14cce834e92bb45bcae24": "insulindia",
    "34b414556c604ad08441801a4cde48a0": "Msama4_Didaw",
    "294271ba0298495d874499ad263e0615": "Rochester_Snitch",
    "efcff06ac13c4b73a565bfc857f0fe70": "Skarlex99",
    "c7e0eb0ce1ce440cbdd2f37f980acdfe": "Somsin_",
    "da060495592e4d33a1d896d288f1b17c": "theMoonsama414",
    "9042eb49422d4f319693d5bc8d077487": "angrynanons",
    "e677d9d6ac6943c4a448f8e3dffbf9f6": "HoLeeChow",
    "057fa52af2654e43a1d22bda93e036a3": "meld169",
    "605eb22413de4715a20848463fd5ba11": "abundalakeke",
    "ab072cb9ed3a4b15bd8b4a3ba5270d08": "Mrcrymountain",
    "444453b8091a4752a06ed828c107888d": "BigSals1",
    "149acdac8bde4468956a336691007001": "MoonBarmer",
    "045e98e94a1a47b29f9376856fa90b63": "eunn296",
    "feca43cc5d3c4e1994341137f2c226b1": "moonsama90",
    "f5c8df2175c7445fb5946ba881ee04bf": "w124eth",
    "4b11488a5d434af8bea8a966de7f369e": "Ciel_Marcheur",
    "9a05e2ea58094880b6fc81bcd6802270": "ddc_23",
    "ec87e63022aa4927bc872ea208a65c76": "SrogiLomot",
    "da2997372d904c03806b079b89d4dfd8": "samamamster",
    "9ea5f60a3b6b45a48a258ca0dfbc0e9e": "SnakesNTornadoes",
    "aefaa3ab573a4566924ba41eb71a7081": "wangdoodle",
    "3a715de9596f4654811a01498e22a446": "romerassso",
    "f558ee1f49e8478a8bc69b5f9613fdf9": "mihassassin",
    "eeca7c67040e4b7f8b562f683cd44cf3": "Spinkicks360",
    "1abc06a358fe46e4949d4521406cdea4": "LilianLondon",
    "e3b3c1347e5c49748eca147c1218e8dc": "BREAMoonsama",
    "6601c42063d24665a69b0e053b93db8c": "viyillo",
    "ae8e59ce474d4d838d780db10110afa5": "tannerreed31",
    "d44825cd183a4cbfbfe1d80c57940567": "samasamajef",
    "f062e368782a46e7a459fd2b63a1d483": "NautilusMoonSama",
    "a802164b02324f22b1da39abce64b96b": "yellowvirus",
    "d18cb6d862d44c94be9030bf667ae670": "Lauren_Didaw",
    "a024de33700c4fb9a04178e98539c2fe": "sansutopies"
}

const gameId = 'minecraft-carnage-2022-03-27'

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
        const user = await connection.manager.getRepository(UserEntity).findOne({ uuid: users[i] })
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