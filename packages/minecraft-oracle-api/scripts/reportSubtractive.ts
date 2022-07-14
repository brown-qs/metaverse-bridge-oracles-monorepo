import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'

import { config } from 'dotenv'
import { SnapshotItemEntity } from '../src/snapshot/snapshotItem.entity'
import { UserEntity } from '../src/user/user/user.entity'
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

const reports: any[] = [{ "id": 259, "created_at": "2022-06-26T17:03:15.000000Z", "updated_at": "2022-06-28T05:13:58.000000Z", "player_id": "c031a8230ac748169b023ea07107367f", "name": "DotWarrior16", "ip_address": "\/85.137.52.79:57442", "game_id": "minecraft-carnage-2022-06-26", "reported_by": "Epic_Monty", "reason": "double kill looked a lil sus", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=7lLjAVzng-U", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 260, "created_at": "2022-06-26T17:26:18.000000Z", "updated_at": "2022-06-27T07:45:27.000000Z", "player_id": "fccd0bedb2bc4f31af697b575268d713", "name": "GrassySiren8644", "ip_address": "\/223.206.245.102:50690", "game_id": "minecraft-carnage-2022-06-26", "reported_by": "YuntWheat", "reason": "Has had potion effect many times with Moonbrella as his offhand, no recording means nothing to investigate", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 261, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T18:07:24.000000Z", "player_id": "2a1e74e078804deda3d1df9fb1996ed1", "name": "Bloob_bloo_balls", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Previous penalty", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/35Mmbd3QPbs", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 262, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "f5d4e5e8807c4e1ba6881604b0b4e075", "name": "Msama319", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Previous penalty, no recording x2", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 0 }, { "id": 263, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "2241f927482442c9a2c3f03ef6ded56f", "name": "Orangenox1", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Previous penalty, no recording x2", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 0 }, { "id": 264, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T16:42:42.000000Z", "player_id": "6077feef8b3f47b0bb50b8d8c173527b", "name": "viindiesel", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Previous penalty", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/E268VxmffSs", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 265, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T17:59:51.000000Z", "player_id": "c4ca440b90b944b49467eae18b34e3e0", "name": "craftedsama", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Previous penalty", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/bBwlAQp8MZw", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 266, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-27T08:38:30.000000Z", "player_id": "5d8ba9fdf67e45c9b63ece8afe43a493", "name": "GameOverMachine", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Previous penalty", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/4ia-ONuIBFU", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 267, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-27T15:45:18.000000Z", "player_id": "c04b46d1fc654bdaa43c4beb44ca5580", "name": "PlazmaOfficialYT", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (exp)", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/zbdrzM1qn9M", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 268, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-27T13:59:17.000000Z", "player_id": "2bb2310bcb804daa98973ddb25767dbf", "name": "Zell3664", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (exp)", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/9BVe43kQJ0M", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 269, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T19:18:19.000000Z", "player_id": "0c1c0d92309a4efbb1670a5113dcbf63", "name": "TicketSmasher", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (exp)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=UT7rqY1nxNE", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 270, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T20:09:44.000000Z", "player_id": "9491bd46c2814603ae3c2ac876b6f1e0", "name": "MonkeCrypto", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron)", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/wD19j2_97FA", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 271, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "f23e14b75e7744068eb0503157c99a3b", "name": "WaffleO", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=K-XCrEKXyP4", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 272, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T17:06:22.000000Z", "player_id": "abda78a2a3554e1a9f3fde4c45e1d399", "name": "WheatBaron", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron), https:\/\/youtu.be\/KMMByseIAog", "state": "done", "result": "clear", "evidence": "video redacted because of visible personal information", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 273, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T22:37:51.000000Z", "player_id": "f9d6b153af55436e8cc5bf0f27e5fedb", "name": "MovrSama88", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron), incomplete video", "state": "done", "result": "penalty", "evidence": "https:\/\/youtu.be\/OP2fBEsP5y4", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 274, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T17:07:10.000000Z", "player_id": "bc6efff0784d41459a2ed79716ce4763", "name": "DeathKnight745", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=6PDfZ-tqqAI", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 275, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T22:39:39.000000Z", "player_id": "31ce5a2cab82492794c3ac0741e9cc84", "name": "Ace556", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=_FbuMLYxFLU", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 276, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T23:54:40.000000Z", "player_id": "f932e276e5084eb9adb50ee1b08e71b5", "name": "Burgaz", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (iron)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=HFEIzMPk_Ck", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 277, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T07:53:04.000000Z", "player_id": "079a5a312b1d43d0bfec17cd1c769c4e", "name": "VIPSAMA", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (gold)", "state": "done", "result": "clear", "evidence": "https:\/\/m.twitch.tv\/videos\/1514759657", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 278, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T19:57:32.000000Z", "player_id": "be485e5b02ea4cf9a5f88245d883a8c1", "name": "DviineBean", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (gold)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=A6eVpFotBzQ", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 279, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T16:30:36.000000Z", "player_id": "4f25861b6b3943d68ae2ee90f1ac1d22", "name": "WheatBaron3", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (gold)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=aqpGE9BoNUQ", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 280, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T21:38:19.000000Z", "player_id": "08c346db77fb455aa10187eb34ed42ec", "name": "FL0WC4RN4G3", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (gold)", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/Z62ZiB_Xda4", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 281, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T18:32:41.000000Z", "player_id": "42096bc4e38a4798b102ce75fd6d8ca9", "name": "Klinggaard", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (gold)", "state": "done", "result": "clear", "evidence": "https:\/\/www.twitch.tv\/videos\/1514758399", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 282, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T18:53:45.000000Z", "player_id": "9caca8b7d38a4f40a2d412927711eeea", "name": "Sama4Life", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (gold)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=3CPAfzXH4v4", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 283, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T20:46:13.000000Z", "player_id": "1641277ff6fd46c6ae8854a306624753", "name": "CarnageTime", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (string)", "state": "done", "result": "clear", "evidence": "https:\/\/www.youtube.com\/watch?v=1pddlQca82g", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 284, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T17:49:35.000000Z", "player_id": "94e07f053a5b4e97bc124473ec1ca6a3", "name": "zTheDarkAlex", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "System", "reason": "Leaderboard (string)", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/ieTz7NTRCa8", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 285, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T15:40:48.000000Z", "player_id": "5ffa3228c07241cca1c4424000e0cc0d", "name": "Gganbu_MOVR", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "Donniebigbags", "reason": "Donnie, bad behaviour", "state": "done", "result": "penalty", "evidence": "https:\/\/youtu.be\/HL5gq58mUk8", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 288, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "aac6ac643baf4d52948bf18058da09f7", "name": "OzOn185Hz", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "Donniebigbags", "reason": "Donnie, no recording x2", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 0 }, { "id": 289, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-26T18:52:33.000000Z", "player_id": "4f5179114f154215bb9651c08a95a960", "name": "SamaSuccess", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "Donniebigbags", "reason": "Donnie, not played", "state": "done", "result": "penalty", "evidence": "https:\/\/youtu.be\/C6o3oRgpQIc", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 290, "created_at": "2022-06-26T18:07:24.000000Z", "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "9eda2c01ded74ad3b33de57c02646f44", "name": "Geforce_Ti", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "Donniebigbags", "reason": "Donnie", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 292, "created_at": null, "updated_at": "2022-06-28T16:32:19.000000Z", "player_id": "6d42fb6400e24f2185346ac0bb7a7c49", "name": "WheatBaron2", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "PvP", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/GVisLnoguGU", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 294, "created_at": null, "updated_at": "2022-06-28T17:58:25.000000Z", "player_id": "888e0fe93d2848f1806a963e7c759364", "name": "SkyDream3r", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "PvP", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/euFKiMMBfOU", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 295, "created_at": null, "updated_at": "2022-06-27T20:10:41.000000Z", "player_id": "59f2f2e60a30405baeccc37863ea7571", "name": "BlueBeardie", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "Investigation", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/Z0UL5ZqGQFU", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 296, "created_at": null, "updated_at": "2022-06-27T17:31:27.000000Z", "player_id": "6f14984f26d4447eb9b4aeef6a43ea5d", "name": "SerMomo", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "Investigation", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/9Kmvnmc9eSk", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 297, "created_at": null, "updated_at": "2022-06-28T09:30:04.000000Z", "player_id": "3f0b2192a2f94a768be2777fabd10d3e", "name": "SlimeyJoe10", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "Investigation", "state": "done", "result": "clear", "evidence": "https:\/\/youtu.be\/chDn0O-qD8s", "game_pass": 1, "personal_share": 1, "gganbu": 1 }, { "id": 298, "created_at": null, "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "a2ad7d2edf144444a48c4851e46acba6", "name": "BlueBeardie", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "Investigation", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 299, "created_at": null, "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "f91a3ba97afe4617b8d7b88ce58249a2", "name": "X_tro7", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "Investigation, no recording", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 1 }, { "id": 300, "created_at": null, "updated_at": "2022-06-28T18:00:02.000000Z", "player_id": "342e013914214e0d88534107f2fb17a2", "name": "ArcanT9675", "ip_address": null, "game_id": "minecraft-carnage-2022-06-26", "reported_by": "VitruviusBeanie", "reason": "Bad Behaviour", "state": "done", "result": "penalty", "evidence": "none provided", "game_pass": 1, "personal_share": 0, "gganbu": 1 }]

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
            console.log(`${user?.minecraftUserName} - blacklisted: ${blacklist}`)
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