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
import { BigNumber } from 'ethers'
import { RecognizedAssetType } from 'src/config/constants'
import { TextureService } from 'src/texture/texture.service'

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

const reports: any[] = [{"id":125,"created_at":null,"updated_at":null,"player_id":"45e282cfc887432cb4d9da7765b36886","name":"KaliBat","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"No video provided","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=mnSBtprrMZI","game_pass":1,"personal_share":1,"gganbu":1},{"id":126,"created_at":null,"updated_at":null,"player_id":"82916b5d40c54c9aa9a8a3859e13be22","name":"MoonShakalaka","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"No video provided","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=VVuc0lt6fxI","game_pass":1,"personal_share":1,"gganbu":1},{"id":127,"created_at":null,"updated_at":null,"player_id":"34af312703c4456d8799f4cf32c72208","name":"TheFreeOwl","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"No video provided","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/bV3e5g47iQc","game_pass":1,"personal_share":1,"gganbu":1},{"id":128,"created_at":null,"updated_at":null,"player_id":"ac4fcc50d8ed4c66a1b6d5bf0a6c5f72","name":"Arpman","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"No video provided","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/6twwsqZrqHc","game_pass":1,"personal_share":1,"gganbu":1},{"id":129,"created_at":null,"updated_at":null,"player_id":"93fb1e8002f849d682779f82374bacb4","name":"AutoBOT404","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"No video provided (recording sent too late)","state":"done","result":"penalty","evidence":"https:\/\/youtu.be\/4gJn1UwrcsM","game_pass":1,"personal_share":0,"gganbu":1},{"id":130,"created_at":null,"updated_at":null,"player_id":"15933356a73243f18af46c1f3b9c8d32","name":"Delia987124786","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"No video provided (recording sent too late)","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=4G1EG791Q8c","game_pass":1,"personal_share":0,"gganbu":1},{"id":131,"created_at":null,"updated_at":null,"player_id":"94e07f053a5b4e97bc124473ec1ca6a3","name":"zTheDarkAlex","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Suspicious Activities","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/btZBeh1zae8","game_pass":1,"personal_share":1,"gganbu":1},{"id":132,"created_at":null,"updated_at":null,"player_id":"733cd7abbdf8484394ed66dadb6b7932","name":"msama_speedrun","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/PXjQUGd_eXI","game_pass":1,"personal_share":1,"gganbu":1},{"id":133,"created_at":null,"updated_at":null,"player_id":"aac6ac643baf4d52948bf18058da09f7","name":"OzOn185Hz","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"penalty","evidence":"no response","game_pass":1,"personal_share":0,"gganbu":1},{"id":134,"created_at":null,"updated_at":null,"player_id":"47aed22dddd243ee9da427ded4fe2f87","name":"jangermaister","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=EuUPyf6lNOA","game_pass":1,"personal_share":1,"gganbu":1},{"id":135,"created_at":null,"updated_at":null,"player_id":"fdb8e043e08a4cf49355166303a800f9","name":"EXOMonster","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/Wmtvy8pYPCM","game_pass":1,"personal_share":1,"gganbu":1},{"id":136,"created_at":null,"updated_at":null,"player_id":"8423391f415b47c588969541946718d0","name":"FrostXtreme","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/Vxb720oGAXo","game_pass":1,"personal_share":1,"gganbu":1},{"id":137,"created_at":null,"updated_at":null,"player_id":"2fee9c630c534677b6f7ff8c5b75d3c9","name":"w3njuzu","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/youtu.be\/whtz0cx5LTM","game_pass":1,"personal_share":1,"gganbu":1},{"id":138,"created_at":null,"updated_at":null,"player_id":"b4b21cda8e264571813ad9f4dacc61c4","name":"JohnGalt9","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard\r\n(video too short, video redacted because of sensitive information)","state":"done","result":"penalty","evidence":"video redacted because of visible personal information","game_pass":1,"personal_share":0,"gganbu":1},{"id":139,"created_at":null,"updated_at":null,"player_id":"6d42fb6400e24f2185346ac0bb7a7c49","name":"DarkoStosic","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"System","reason":"Leaderboard","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=r77mGFwuOa0","game_pass":1,"personal_share":1,"gganbu":1},{"id":140,"created_at":null,"updated_at":null,"player_id":"1821def2bb054fa79299e74c56cbb181","name":"Diogaite4win","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"BeanieSama","reason":"possible xray or minimap","state":"done","result":"penalty","evidence":"https:\/\/www.youtube.com\/watch?v=qsbQXFkHJTw","game_pass":1,"personal_share":0,"gganbu":1},{"id":141,"created_at":null,"updated_at":null,"player_id":"ed45bf1f20f54e9abad9a600065b484f","name":"Eben_Lt","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"BeanieSama","reason":"possible xray or minimap","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":142,"created_at":null,"updated_at":null,"player_id":"6432d40f399b4c7689db4a2ff64332bb","name":"ToxicBirdie999","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"BeanieSama","reason":"possible xray","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":143,"created_at":null,"updated_at":null,"player_id":"5d8ba9fdf67e45c9b63ece8afe43a493","name":"GameOverMachine","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"Julioo","reason":"possible xray","state":"done","result":"penalty","evidence":"none provided","game_pass":1,"personal_share":0,"gganbu":1},{"id":144,"created_at":null,"updated_at":null,"player_id":"b2acb8dda4874ebbb21fe85d01e06bd4","name":"LunarRain77","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"Julioo","reason":"suspicious movenement \/ PvP","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=NfsMKxTJdGA&t=6182s","game_pass":1,"personal_share":1,"gganbu":1},{"id":145,"created_at":null,"updated_at":null,"player_id":"f23e14b75e7744068eb0503157c99a3b","name":"WaffleO","ip_address":null,"game_id":"minecraft-carnage-2022-05-29","reported_by":"YuntWheat","reason":"PvP","state":"done","result":"clear","evidence":"https:\/\/www.youtube.com\/watch?v=tlIX1etfSvI&ab_channel=Ryan","game_pass":1,"personal_share":1,"gganbu":1}]
const gameId = 'minecraft-carnage-2022-05-29'

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
    const users = await connection.manager.getRepository(UserEntity).find({relations: ['assets', 'assets.collectionFragment', 'assets.collectionFragment.collection'], loadEagerRelations: true})

    for (let i = 0; i < users.length; i++) {
        
        const user = users[i]
        
        if (!user.assets || user.assets.length === 0) {
            continue
        }

        let sum = BigNumber.from('0')
        for (let j = 0; j < user.assets.length; j++) {
            const asset = user.assets[j]
            
            if (asset.collectionFragment.collection.assetAddress === '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a' && asset.assetId === '11') {
                console.log('found', user.userName)
                await connection.manager.getRepository(SkinEntity).save(
                    {id: SkinEntity.toId(user.uuid, '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a', '11' ),owner: user, texture: await connection.manager.getRepository(TextureEntity).findOne({where: {assetAddress: '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a', assetId: '11'}}) }
                )
               break
            }
            //console.log('    sum frag', sum.toString())
        }
    }
    await connection.close()
}


main()