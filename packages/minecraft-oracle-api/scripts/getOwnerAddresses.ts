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
import { ChainEntity } from '../src/chain/chain.entity'
import { GameEntity } from '../src/game/game.entity'
import { AchievementEntity } from '../src/achievement/achievement.entity'
import { PlayerAchievementEntity } from '../src/playerachievement/playerachievement.entity'
import { PlayerScoreEntity } from '../src/playerscore/playerscore.entity'
import { GameTypeEntity } from '../src/gametype/gametype.entity'
import { GganbuEntity } from '../src/gganbu/gganbu.entity'
import { SnaplogEntity } from '../src/snaplog/snaplog.entity'
import { GameItemTypeEntity } from '../src/gameitemtype/gameitemtype.entity'
import { PlayerGameItemEntity } from '../src/playergameitem/playergameitem.entity'
import { GameScoreTypeEntity } from '../src/gamescoretype/gamescoretype.entity'
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { SecretEntity } from '../src/secret/secret.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { ResourceInventoryService } from '../src/resourceinventory/resourceinventory.service'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { Oauth2AuthorizationEntity } from '../src/oauth2api/oauth2-authorization/oauth2-authorization.entity'
import { Oauth2ClientEntity } from '../src/oauth2api/oauth2-client/oauth2-client.entity'
import { DidEntity } from '../src/user/did/did.entity'
import { EmailChangeEntity } from '../src/user/email-change/email-change.entity'
import { EmailLoginKeyEntity } from '../src/user/email-login-key/email-login-key.entity'
import { EmailEntity } from '../src/user/email/email.entity'
import { KiltDappEntity } from '../src/user/kilt-dapp/kilt-dapp.entity'
import { KiltSessionEntity } from '../src/user/kilt-session/kilt-session.entity'
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity'
import { MinecraftUserNameEntity } from '../src/user/minecraft-user-name/minecraft-user-name.entity'
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity'
import { ZUserAssetView, ZUserBaitView } from '../src/views'
import { RecognizedAssetType } from '../src/config/constants'
config()

async function main() {

    let connection: Connection
    try {
        connection = await createConnection({
            keepAlive: 10000,
            name: 'assetwire',
            type: process.env.TYPEORM_CONNECTION as any,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            host: process.env.TYPEORM_HOST,
            port: Number.parseInt(process.env.TYPEORM_PORT),
            database: process.env.TYPEORM_DATABASE,
            entities: [
                EmailChangeEntity,
                    MinecraftLinkEntity,
                    KiltSessionEntity,
                    EmailLoginKeyEntity,
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
                    ResourceInventoryOffsetEntity,
                    ZUserAssetView,
                    MinecraftUserNameEntity,
                    MinecraftUuidEntity,
                    EmailEntity,
                    DidEntity,
                    KiltDappEntity,
                    Oauth2ClientEntity,
                    Oauth2AuthorizationEntity,
                    ZUserBaitView
            ],
            synchronize: false
        })
    } catch (err) {
        connection = getConnection('assetwire')
    }

    if (!connection.isConnected) {
        connection = await connection.connect()
    }

    try {
        for (let i = 0; i < list.length; i++) {
            const userId = list[i]
            const assets = await connection.manager.find<AssetEntity>(AssetEntity, { where: { owner: { uuid: userId } }, relations: ['collectionFragment', 'collectionFragment.collection', 'resourceInventory', 'owner'], loadEagerRelations: true })
            const sama = assets.find(a => a.recognizedAssetType.valueOf() === RecognizedAssetType.MOONSAMA)
            const tticket = assets.find(a => a.recognizedAssetType.valueOf() === RecognizedAssetType.TEMPORARY_TICKET)
            const ticket = assets.find(a => a.recognizedAssetType.valueOf() === RecognizedAssetType.TICKET)

            const chosen = sama ?? ticket ?? tticket
            //console.log(chosen.owner.minecraftUserName, chosen.recognizedAssetType, chosen.assetOwner)
            console.log(chosen.assetOwner)
            //console.log(chosen.owner.minecraftUserName)
            //console.log(assets.find(x => !!x).owner.gamerTag)
        }
    } catch (error) {
        console.log(error)
    }

    await connection.close()
    process.exit(0);
}

const list = [

        "eaecaeef5709d58e4224a8a1af1527cf",
        "e8ad7d83ce2c5a09dc748db194560329",
        "b1b567fc4d05e5b6880601d707e44cd7",
        "5ab9526638b560a07374f02fca1fa9c2",
        "1c4fece5c11759a42c256003a7ad550b",
        "0b2a0d36883eeee237a5264ee6388a68",
        "13100be8fb06309c3ac2a48bbb7f0825",
        "7ab772fbeff8868bc394a62fa11ec662",
        "96c4a901e7d2b9bf4b7f2095cf2caacb",
        "8791c66300325ed5a85d3d2dcd9da892",
        "debf1ff1cf69d4e94d28d5239d2a378b",
        "f75aed098931e2f39f27a8436fd7a9c5",
        "2128e0d3252642f93a87293705b48788",
        "cd561dd5e5c79d156da90b6b78bf3a56",
        "65eb34ef6198d00651ba989324e140ca",
        "81470d3ffa7ec7e4f87a8fca1b9f78b3",
        "63cb2eafc68d586eb0b60798e2853879",
        "9a8eaf9aef7cc44a224e7e287fe9dd52",
        "3680b811205b8746bc23b5e885c2221a",
        "1fa7ed27b7237c0649d5e5dcba60119f",
        "4f6a34c8680214a50f24617c28a36d12",
        "cca70fc601fb4c5ff59e4341ab7c5fb7",
        "710c7c41303705ab588bca7fbc3ed97d",
        "4202fdd1d4572ef3da26b48eabaee3d3",
        "2a3b83b5e14056c0d5d0178fe82c29de"

]

// const list = [
//     "eb05c7250f9fb4f8998b49d752c739af",
//     "56432973f8ffa950803279617d2fcb15",
//     "2ceea846fc960cf30395566f50af851f",
//     "c0a407a8024defaa3239fc16aa32c0ee",
//     "5ae21fa9ce4305aebd6a536aa2452325",
//     "e33ed28337915d76612b383e6085b21e",
//     "b7d6bdeaf2ba02cb32df7168e3582a4d",
//     "c346afcec5e95822228604a459e67a71",
//     "9531b82b37f7a44ca6093980e9f9bed5",
//     "dab7957a5282539a5eef2d17df40a8ae",
//     "cefdb01bf569f6dee26f5b11eb6c4804",
//     "95ec2e8c62f474f4201087e985056a4e",
//     "2aecdfdc33dff02383429e5ae2c1aee5",
//     "3a808bc5b30e3ef5ac8f4820b890669e",
//     "322dea066954625bf32d3810bf2f6f9b",
//     "c2a2f10aea81003c7b63bf3821b9f83d",
//     "eecf324ba520d0f0661c929e2d07cf58",
//     "0b64a6c8624ce621206ebec489f6437c",
//     "76ed3ca147fd6ca2d6926f458d981ac4",
//     "a599d55690033af056bd8635da7c6cc0",
//     "be6202667feab8167dd3e951c2c936af",
//     "fa8714f3d4be4e5fb464aecbe9e59205",
//     "6c92bb1aea7253fb1dbefafe8d1ffefe",
//     "ab1abed7229a166d3f4fe58a5669bfa0",
//     "dfec031ff9daffc1cdd74cdaf49486d0",
//     "f92ccfb8c1e8392f960ca1e22b9c6664",
//     "993663458e96d968dd5535751a8ac874",
//     "293614a22ccb1cb49a49d18d3bc830c5",
//     "20197854726e8804e20d293f9ac30501",
//     "f532fdfec7d6fb12a91cb71c7cfbd161",
//     "50245c1e3c62371412c5b6de48858d77",
//     "a43181e648f09d663c83ad22a2e22a2c",
//     "b28a6219d7a6f3f0800c1e1d3ccbaeec",
//     "96c4a901e7d2b9bf4b7f2095cf2caacb",
//     "997e0cf0e79697f324746b0bc849a4d2",
//     "4202fdd1d4572ef3da26b48eabaee3d3",
//     "0e5bbdb10aa138cfa97dd0a556573c4e",
//     "65b032a5fb6bc34d64fe87311df7d981",
//     "c4e368fd670c9d55965984851588faa8",
//     "5af3fb27fbec947e362d069c320b02c1",
//     "9c84028940ac8ad30414cdd27a186edc",
//     "710de382aa3d7c4a34703d9699fd3695",
//     "354b9c5393a660c012ee6f1b0aad3d58",
//     "eaecaeef5709d58e4224a8a1af1527cf",
//     "13100be8fb06309c3ac2a48bbb7f0825",
//     "0b2a0d36883eeee237a5264ee6388a68",
//     "e904f80abbb088a15fb4f37fe4f26c1e",
//     "1bd5e2205ee65fda39cbdaec53924d33",
//     "b8b786fafe457df8714ca792111494ae",
//     "0876b0915ee6bc58786ff38b49f57dfb",
//     "aa9ae896196a71f2af8ccfbe022086a9",
//     "d4103870e90e2b7b766ca07c18faf9b4",
//     "e04d4e3dff7c54e0fa95aa876c09e7b8",
//     "c76ea20640e3245724824ec6b890bc2c",
//     "302a68eba02bfb1724f1ffb742340e4e",
//     "d2656bf31bd9b76eb8de26fb879b918a",
//     "a81a1f8353209aee8d75d29146a804d7",
//     "615f149bee131b43d6f74199a88b4a2b",
//     "e90333812d872d3d283d6e4305317192",
//     "f75aed098931e2f39f27a8436fd7a9c5",
//     "1745ca8fc0ec0086502d3febb4f07126",
//     "63c7e06845ac0d2a81887ee3f0deaa7a",
//     "1321787db06b3fbeb0c00fa1d0114632",
//     "78949dfc81e5a3137e3a463a1e886bd5",
//     "b8a96189767a39d8a8f9e35917897112",
//     "0fc37423070d4967d01befeb06b641ca",
//     "8bf8cb037e3028cfb3fb775ad3e048c5",
//     "f886ea16d52eb8eb4341319b18bc505d",
//     "f81162e6a7ba4367bd4a1a1d6efe9972",
//     "50d5ced481dd0e1a8e774650f20d3a92",
//     "cca70fc601fb4c5ff59e4341ab7c5fb7",
//     "19af0d9ab1c52d53dfe4f455f668bb5c",
//     "4ca3a7b207cfe0fae39507cc6fbcddbc",
//     "253ce06cf37ae95897d682c127204fe5",
//     "2a8ab7edf3ef0dc712898bbb8e176cfa",
//     "cb32e88a53e2a1ec547eae6e54f929b3",
//     "e3aefba553294c0f4240d02ae86a6b47",
//     "45a09634a6567cbec85a8615c34d862e",
//     "76620c6cc6c47bbb59912a1047280972",
//     "2128e0d3252642f93a87293705b48788",
//     "0e869d5532ce3ba0e2bb76498faa1f2b",
//     "56b0f3e4fb75009d03fbff694b11b4ab",
//     "6868e0ecf33b1100c62fb16f87cadf07",
//     "ce014e492f161a5c30682d0cde519ad4",
//     "dca74a8e986ecf766be98df2e114b9b1",
//     "f0fd3d4e57fe002febde6691812ff139",
//     "7e5d920ec0f6784746d20d49e8d86576",
//     "f0f0c636478c58af34aa6d4d1b78970f",
//     "e3c8d3a40b9dad4ba684b616b8b75580",
//     "7947d270ea4373eb089ca1be3742bcf5",
//     "b7614dcef830f4d2fff0644d1c228fae",
//     "5a91c879e6514d118bee24aa92933276",
//     "81470d3ffa7ec7e4f87a8fca1b9f78b3",
//     "0e77b2546c990af6bd21ff7428eced67",
//     "dcd364dd0e1e6851afffafa6329c4790",
//     "7ddfc4b8a454a98cca4502d34f2c6dba",
//     "3dd08ace95ed485195ecfb02948bcf35",
//     "693502ff255214a1f4b493bad8e311ae",
//     "88cb2edf1e6e202a3380ae736b7ca0f6",
//     "f9cbdf5905e478a0040f5c02f9e4061e"
// ]

main()