import { MaterialEntity } from '../src/material/material.entity'
import { Connection, createConnection, getConnection } from 'typeorm'
import { execSync } from "child_process"
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
import { MetaAsset } from '../src/oracleapi/oracleapi.types'
import { Contract, ethers } from 'ethers'
import { ChainEntity } from '../src/chain/chain.entity'
import { METAVERSE_ABI } from '../src/common/contracts/Metaverse'
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
import { ApolloClient, InMemoryCache, NormalizedCacheObject, HttpLink, gql, ApolloError } from '@apollo/client';
import fetch from 'cross-fetch';
import { CollectionEntity } from '../src/collection/collection.entity'
import { CollectionFragmentEntity } from '../src/collectionfragment/collectionfragment.entity'
import { CompositePartEntity } from '../src/compositepart/compositepart.entity'
import { CompositeCollectionFragmentEntity } from '../src/compositecollectionfragment/compositecollectionfragment.entity'
import { ResourceInventoryEntity } from '../src/resourceinventory/resourceinventory.entity'
import { ResourceInventoryOffsetEntity } from '../src/resourceinventoryoffset/resourceinventoryoffset.entity'
import { CompositeAssetEntity } from '../src/compositeasset/compositeasset.entity'
import { SyntheticPartEntity } from '../src/syntheticpart/syntheticpart.entity'
import { SyntheticItemEntity } from '../src/syntheticitem/syntheticitem.entity'
import { Oauth2ClientEntity } from '../src/oauth2api/oauth2-client/oauth2-client.entity'
import { EmailChangeEntity } from '../src/user/email-change/email-change.entity'
import { EmailLoginKeyEntity } from '../src/user/email-login-key/email-login-key.entity'
import { EmailEntity } from '../src/user/email/email.entity'
import { KiltSessionEntity } from '../src/user/kilt-session/kilt-session.entity'
import { MinecraftLinkEntity } from '../src/user/minecraft-link/minecraft-link.entity'
import { KiltDappEntity } from '../src/user/kilt-dapp/kilt-dapp.entity'
import { DidEntity } from '../src/user/did/did.entity'
import { MinecraftUuidEntity } from '../src/user/minecraft-uuid/minecraft-uuid.entity'
import { MinecraftUserNameEntity } from '../src/user/minecraft-user-name/minecraft-user-name.entity'
import { getDatabaseConnection } from './common'
import { promises as fs } from 'fs';
import path from "path"
import { SyntheticItemLayerEntity } from '../src/syntheticitemlayer/syntheticitemlayer.entity'
config()

async function main() {
    //just for movr because we dont have an indexer
    const connection = await getDatabaseConnection("exosamadb")

    const exoMeta = {
        "Background": [
            "Alley",
            "Big Boy",
            "Boulevard",
            "Laboratory",
            "Nova",
            "Skyline"
        ],
        "Body": [
            "E1",
            "E2"
        ],
        "Vibe": [
            "Alluring",
            "Captivating",
            "Engaging"
        ],
        "Expression": [
            "Cheerful",
            "Crazy",
            "Hostile",
            "Pensive",
            "Resolved",
            "Skeptical"
        ],
        "Hair": [
            "Alabaster Braid",
            "Alabaster Chun Buns",
            "Alabaster Layered",
            "Alabaster Mohawk",
            "Alabaster Pony Tail",
            "Azure Bob",
            "Azure Braid",
            "Azure Chun Buns",
            "Azure Crush Chun Buns",
            "Azure Haze Braid",
            "Azure Pony Tail",
            "Blaze Bob",
            "Blaze Braid",
            "Blaze Crush Mohawk",
            "Blaze Haze Bob",
            "Blaze Haze Braid",
            "Blaze Layered",
            "Blaze Pony Tail",
            "Blush Bob",
            "Blush Crush Bob",
            "Blush Crush Mohawk",
            "Blush Crush Pony Tail",
            "Bob w/ Backwards Cap",
            "Braid w/ Beret",
            "Cobalt Crush Mohawk",
            "Cobalt Haze Bob",
            "Cobalt Haze Chun Buns",
            "Cobalt Haze Pony Tail",
            "Expresso Bob",
            "Expresso Braid",
            "Expresso Chun Buns",
            "Expresso Frizzy",
            "Expresso Lob",
            "Expresso Pony Tail",
            "Expresso Slicked Bob",
            "Imperial Bob",
            "Imperial Chun Buns",
            "Imperial Crush Mohawk",
            "Imperial Haze Chun Buns",
            "Imperial Haze Pony Tail",
            "Jam Frizzy",
            "Kiwi Bob",
            "Kiwi Braid",
            "Kiwi Chun Buns",
            "Kiwi Crush Bob",
            "Kiwi Crush Mohawk",
            "Kiwi Crush Pony Tail",
            "Kiwi Haze Bob",
            "Layered w/ Beanie",
            "Pony Tail w/ Ball Cap",
            "Raven Bob",
            "Raven Chun Buns",
            "Raven Frizzy",
            "Raven Layered",
            "Raven Lob",
            "Raven Mohawk",
            "Raven Pony Tail",
            "Raven Slicked Bob",
            "Sangria Frizzy",
            "Seafoam Braid",
            "Seafoam Crush Pony Tail",
            "Shock Braid",
            "Shock Chun Buns",
            "Shock Crush Braid",
            "Shock Crush Chun Buns",
            "Shock Crush Mohawk",
            "Shock Crush Pony Tail",
            "Shock Haze Bob",
            "Solar Bob",
            "Solar Braid",
            "Solar Chun Buns",
            "Solar Crush Mohawk",
            "Solar Haze Bob",
            "Solar Haze Braid",
            "Solar Haze Chun Buns",
            "Solar Haze Layered",
            "Solar Haze Pony Tail",
            "Solar Lob",
            "Solar Pony Tail",
            "Solar Slicked Bob",
            "Tangerine Braid",
            "Tangerine Chun Buns",
            "Tangerine Pony Tail",
            "Violet Bob",
            "Violet Braid",
            "Violet Chun Buns",
            "Violet Crush Layered",
            "Violet Crush Mohawk",
            "Violet Haze Bob",
            "Violet Haze Braid",
            "Violet Haze Chun Buns",
            "Violet Haze Layered",
            "Violet Haze Pony Tail",
            "Violet Layered",
            "Violet Pony Tail"
        ],
        "Clothes": [
            "Arctic Artemis",
            "Arctic Athena",
            "Arctic Chun",
            "Arctic Crop Top",
            "Arctic Gotti",
            "Arctic Graphic Tee",
            "Arctic Hoodie",
            "Arctic Hunter",
            "Arctic Ruffled Dress",
            "Arctic Runner",
            "Arctic Sailor",
            "Arctic Soprano",
            "Arctic Sweater",
            "Arctic Tee",
            "Cedar Military",
            "Citrus Gotti",
            "Citrus Soprano",
            "Citrus Sweater",
            "Coyote Military",
            "Desert Military",
            "Flame Battle Demon",
            "Flame Racer",
            "Golden Cyber Bomber",
            "Indigo Artemis",
            "Indigo Athena",
            "Indigo Battle Armor",
            "Indigo Battle Demon",
            "Indigo Body Suit",
            "Indigo Cyber Bomber",
            "Indigo Hunter",
            "Indigo Square Neck Mini",
            "Indigo Trainer",
            "Indigo Workout",
            "Khaki Ghost",
            "Lime Sweater",
            "Moss Ghost",
            "Navy Hacker",
            "Navy Military",
            "Navy Racer",
            "Navy Sailor",
            "Navy Square Neck Mini",
            "Olive Military",
            "Onyx Artemis",
            "Onyx Athena",
            "Onyx Body Suit",
            "Onyx Chun",
            "Onyx Crop Top",
            "Onyx Cyber Bomber",
            "Onyx Gotti",
            "Onyx Graphic Tee",
            "Onyx Hacker",
            "Onyx Hunter",
            "Onyx Ruffled Dress",
            "Onyx Runner",
            "Onyx Soprano",
            "Onyx Square Neck Mini",
            "Onyx Sweater",
            "Onyx Tee",
            "Onyx Trainer",
            "Onyx Workout",
            "Orchid Battle Demon",
            "Orchid Chun",
            "Orchid Ghost",
            "Orchid Gotti",
            "Orchid Racer",
            "Orchid Soprano",
            "Pearl Body Suit",
            "Pearl Fighter",
            "Pearl Square Neck Mini",
            "Royal Battle Armor",
            "Royal Battle Demon",
            "Royal Body Suit",
            "Royal Chun",
            "Royal Fighter",
            "Royal Gotti",
            "Royal Hoodie",
            "Royal Ruffled Dress",
            "Royal Runner",
            "Royal Soprano",
            "Royal Tee",
            "Royal Workout",
            "Sage Ghost",
            "Scarlet Artemis",
            "Scarlet Athena",
            "Scarlet Battle Armor",
            "Scarlet Battle Demon",
            "Scarlet Body Suit",
            "Scarlet Chun",
            "Scarlet Crop Top",
            "Scarlet Cyber Bomber",
            "Scarlet Fighter",
            "Scarlet Ghost",
            "Scarlet Gotti",
            "Scarlet Hacker",
            "Scarlet Hoodie",
            "Scarlet Hunter",
            "Scarlet Ruffled Dress",
            "Scarlet Runner",
            "Scarlet Soprano",
            "Scarlet Square Neck Mini",
            "Scarlet Sweater",
            "Scarlet Tee",
            "Scarlet Trainer",
            "Scarlet Workout",
            "Slate Crop Top",
            "Smoke Battle Armor",
            "Smoke Cyber Bomber",
            "Smoke Hoodie",
            "Smoke Sailor",
            "Smoke Soprano",
            "Sylvan Artemis",
            "Sylvan Athena",
            "Teal Battle Demon",
            "Teal Racer",
            "Umber Cyber Bomber",
            "Umber Runner"
        ],
        "Weapon": [
            "Alloy Bat",
            "Aquamarine Cyber Sword",
            "Aquamarine Energy Saber",
            "Aquamarine Sword",
            "Augmented Crimson Cyber Sword",
            "Augmented Orchid Cyber Sword",
            "Augmented Steel Cyber Sword",
            "Cherry AK-47",
            "Cherry Shotgun",
            "Cherry Sniper Rifle",
            "Claw",
            "Copper SMG-217",
            "Crimson Bat",
            "Crimson Boxing Gloves",
            "Crimson Cyber Axe",
            "Crimson Energy Saber",
            "Crimson Glow Sword",
            "Crimson Grenade Launcher",
            "Crimson Pistol",
            "Crimson Rocket Launcher",
            "Crimson SMG-217",
            "Crimson Sword",
            "Crimson Tech Rifle",
            "Damascus Sword",
            "Desert Grenade Launcher",
            "Desert Rocket Launcher",
            "Ember Cyber Sword",
            "Ember Glow Sword",
            "Golden Boxing Gloves",
            "Golden Cyber Axe",
            "Golden Grenade Launcher",
            "Golden Tech Rifle",
            "Indigo Boxing Gloves",
            "Indigo Cyber Axe",
            "Indigo Pistol",
            "Indigo Shotgun",
            "Indigo Tech Rifle",
            "Knuckle Dagger",
            "Midnight AK-47",
            "Midnight Bat",
            "Midnight Cyber Axe",
            "Midnight Grenade Launcher",
            "Midnight Pistol",
            "Midnight Shotgun",
            "Midnight SMG-217",
            "Midnight Sniper Rifle",
            "Midnight Sword",
            "Midnight Tech Rifle",
            "Navy AK-47",
            "Navy Cyber Axe",
            "Navy Grenade Launcher",
            "Navy Pistol",
            "Navy Shotgun",
            "Navy SMG-217",
            "Navy Tech Rifle",
            "Oak AK-47",
            "Oak Shotgun",
            "Orchid Energy Saber",
            "Orchid SMG-217",
            "Orchid Sword",
            "Royal Boxing Gloves",
            "Royal Cyber Axe",
            "Smoke Rocket Launcher",
            "Stealth Pistol",
            "Steel Grenade Launcher",
            "Steel Pistol",
            "Steel SMG-217",
            "Steel Sword",
            "Umber Rocket Launcher",
            "Walnut AK-47",
            "Walnut Sniper Rifle"
        ],
        "Cyber Wiring": [
            "Cyber Wiring v1",
            "Cyber Wiring v10",
            "Cyber Wiring v11",
            "Cyber Wiring v12",
            "Cyber Wiring v13",
            "Cyber Wiring v14",
            "Cyber Wiring v15",
            "Cyber Wiring v16",
            "Cyber Wiring v2",
            "Cyber Wiring v3",
            "Cyber Wiring v4",
            "Cyber Wiring v5",
            "Cyber Wiring v6",
            "Cyber Wiring v7",
            "Cyber Wiring v8",
            "Cyber Wiring v9"
        ],
        "Eyewear": [
            "None",
            "Aquamarine Glasses",
            "Arctic Visors",
            "Crimson Glasses",
            "Golden Visors",
            "Imperial Visors",
            "Lime Visors",
            "Midnight Glasses",
            "Midnight Visors",
            "Shock Visors",
            "Solar Visors",
            "Steel Visors",
            "Umber Glasses"
        ],
        "Helmet": [
            "None",
            "Crimson Wolf",
            "Indigo Daft",
            "Royal Wolf",
            "Steel Daft",
            "Steel Wolf",
            "Teal Daft",
            "Teal Wolf",
            "Violet Wolf"
        ],
        "Mask": [
            "None",
            "Arctic Ninja",
            "Arctic Skull",
            "Crimson Ninja",
            "Crimson Oni",
            "Crimson Skull",
            "Fox Kabuki",
            "Golden Ninja",
            "Golden Skull",
            "Indigo Ninja",
            "Lime Ninja",
            "Midnight Ninja",
            "Royal Ninja",
            "Royal Oni",
            "Shock Skull",
            "Stealth Oni",
            "Steel Ninja",
            "Steel Oni",
            "Titanium Skull",
            "Wolf Kabuki"
        ],
        "Eyes": [
            "Factory Default"
        ],
        "Gen": [
            "1"
        ],
        "Breed Counter": [
            "1"
        ]
    }

    const compositeCollectionFragment = await connection.manager.findOne<CompositeCollectionFragmentEntity>(CompositeCollectionFragmentEntity, { id: "1-0xac5c7493036de60e63eb81c5e9a440b42f47ebf5" })

    if (!compositeCollectionFragment) {
        console.log("Couldn't find composite collection fragment")
        process.exit()
    }

    /*
    for (const key of Object.keys(exoMeta)) {
        const idx = Object.keys(exoMeta).indexOf(key) + 100
        //1-0xac5c7493036de60e63eb81c5e9a440b42f47ebf5
        console.log(idx)
        const partEntity = connection.manager.create<SyntheticPartEntity>(SyntheticPartEntity, { id: idx, zIndex: 0, assetAddress: `0x00${idx}`, idRange: null, compositeCollectionFragment, mediaUriPrefix: "https://static.moonsama.com", mediaUriPostfix: ".png", name: key })
        await connection.manager.save(partEntity)
    }*/


    /*
        for (const [key, trs] of Object.entries(exoMeta)) {
            const traitTypeIdx = Object.keys(exoMeta).indexOf(key) + 100
    
            let traits = trs
            if (["Expression", "Vibe"].includes(key)) {
                traits = []
                for (const b of exoMeta.Body) {
                    for (const v of exoMeta.Vibe) {
                        for (const e of exoMeta.Expression) {
                            if (key === "Expression") {
                                traits = [...traits, `${key}~${e}|Body~${b}|Vibe~${v}`]
    
                            } else if (key === "Vibe") {
                                traits = [...traits, `${key}~${v}|Body~${b}|Expression~${e}`]
                            }
                        }
                    }
                }
            }
            for (const t of traits) {
                let attrs = [{ "trait_type": key, "value": t }]
                if (t.includes("|")) {
                    attrs = t.split("|").map(s => ({ "trait_type": s.split("~")[0], "value": s.split("~")[1] }))
                }
                const syntheticPart = await connection.manager.findOne<SyntheticPartEntity>(SyntheticPartEntity, { id: traitTypeIdx })
                const idx = traits.indexOf(t) + 1
    
                const synethicItemEntity = connection.manager.create<SyntheticItemEntity>(SyntheticItemEntity, { id: `1-${`0x00${traitTypeIdx}`}-${idx}-${traitTypeIdx}`, assetId: String(idx), attributes: attrs, syntheticPart })
                await connection.manager.save(synethicItemEntity)
            }
        }
        return*/

    /*
    const BASE_PATH = "/Users/me/Downloads"
    const S3_OUTPUT_PATH = `${BASE_PATH}/s3`
    const STANDARDIZED_OUTPUT_PATH = `${BASE_PATH}/exo-standardized`
    let images = await getDirRecursive(`${BASE_PATH}/exosama-parts`)
    images = images.filter((img: any) => img.path.endsWith(".png"))
    if (BASE_PATH.length > 5) {
        execSync(`rm -rf ${S3_OUTPUT_PATH}`)
        execSync(`mkdir -p ${S3_OUTPUT_PATH}`)
        // execSync(`rm -rf ${STANDARDIZED_OUTPUT_PATH}`)
        //   execSync(`mkdir -p ${STANDARDIZED_OUTPUT_PATH}`)
    }
    //console.log(JSON.stringify(images, null, 4))
    const syntheticItems = await connection.manager.find<SyntheticItemEntity>(SyntheticItemEntity)
    console.log(`syntheticItems: ${syntheticItems.length}`)
    for (const synthItem of syntheticItems) {
        if (synthItem.id.startsWith("1-0x")) {
            const attrs = synthItem.attributes
            console.log(`================= START =================`)
            console.log(JSON.stringify(attrs) + "\n")
            let files: { filePath: string, zIndex: number }[] = []
            if (attrs.length === 1) {
                const tt = attrs[0].trait_type
                const value = attrs[0].value
                let snakeVal = snakeCase(value.toLowerCase())
                if (tt === "Hair") {
                    snakeVal = snakeVal.replace("braid", "braided").replace("_w/_", "_with_") + "_hair"
                    snakeVal = snakeVal.replace("bob_with_backwards_cap_hair", "bob_with_backwards_cap").replace("braided_with_beret_hair", "beret_with_braid").replace("layered_with_beanie_hair", "layered_with_beanie").replace("pony_tail_with_ball_cap_hair", "pony_tail_with_ball_cap")
                } else if (tt === "Clothes") {
                    snakeVal = snakeVal.replace("_w/_", "_with_") + "_clothes"
                    snakeVal = snakeVal.replace("indigo_battle_armor_clothes", "indigo_armor_clothes").replace("royal_battle_armor_clothes", "royal_armor_clothes").replace("scarlet_battle_armor_clothes", "scarlet_armor_clothes").replace("smoke_battle_armor_clothes", "smoke_armor_clothes")

                } else if (tt === "Weapon") {
                    snakeVal = snakeVal.replace("_w/_", "_with_") + "_weapons"
                    snakeVal = snakeVal.replace("_sword_", "_swords_")
                        .replace("_cyber_swords_", "_cyber_sword_")
                        .replace("augmented_", "augmented ").replace("_ak-47_", "_ak47_").replace("_sniper_rifle_", "_sniper_")
                        .replace("crimson_glow_swords_weapons", "crimson glow_swords_weapons").replace("smg-217", "smg217")
                        .replace("ember_glow_swords_weapons", "ember glow_swords_weapons").replace("golden_cyber_axe_weapons", "crimson_cyber_axe_weapons")
                        .replace("claw_weapons", "claw").replace("knuckle_dagger_weapons", "knuckle_dagger")
                        .replace("royal_cyber_axe_weapons", "midnight_cyber_axe_weapons")

                } else if (tt === "Mask") {
                    snakeVal = snakeVal.replace("_w/_", "_with_") + "_mask"
                    snakeVal = snakeVal
                } else if (tt == "Eyewear") {
                    snakeVal = snakeVal.replace("_visors", "_cyber_visor")
                } else if (tt == "Helmet") {
                    snakeVal = snakeVal += "_helmet"

                }
                console.log(`${tt} - ${value} ${snakeVal}`)
                let matchingFile
                if (["Breed Counter", "Eyes", "Gen"].includes(tt) || value.toLowerCase() === "none") {
                    console.log("should have no image")
                    continue
                } else {
                    matchingFile = images.find((img: any) => img.file.replace(".png", "") === snakeVal)
                }
                if (!!matchingFile) {
                    console.log(`Found matching file: ${matchingFile.file} ${matchingFile.path}`)
                    if (tt === "Background") {
                        files.push({ filePath: matchingFile.path, zIndex: 1 })
                        files.push({ filePath: "/Users/me/Downloads/exosama-parts/fg/1.png", zIndex: -100 })
                    } else if (tt === "Body") {
                        files.push({ filePath: matchingFile.path, zIndex: 1 })
                        for (const img of images) {
                            if (img.path.includes(`hands/${value.toUpperCase()}/`)) {
                                files.push({ filePath: img.path, zIndex: 100 })
                            }
                        }
                    } else {
                        files.push({ filePath: matchingFile.path, zIndex: 1 })
                    }
                } else {
                    console.log(`No matching file found`)
                }
            } else {
                const body = attrs.find((a: any) => a.trait_type === "Body").value
                const vibe = attrs.find((a: any) => a.trait_type === "Vibe").value
                const expression = attrs.find((a: any) => a.trait_type === "Expression").value
                for (const img of images) {
                    if (img.path.includes(`faces/${body.toLowerCase()}/${vibe.toLowerCase()}/`) && img.path.includes(expression.toLowerCase())) {
                        files.push({ filePath: img.path, zIndex: 1 })
                    }
                }
            }
            for (const file of files) {
                const standardizedPath = attrs.map((a: any) => a.trait_type).join("~")
                const standardizedFileName = attrs.map((a: any) => a.value).join("~")
                const layerId = files.indexOf(file)

                const pieces = synthItem.id.split("-")
                const chainId = pieces[0]
                const assetAddress = pieces[1].toLowerCase()
                const assetId = pieces[2]

                const previewFilePath = `${chainId}/${assetAddress}/${assetId}.png`
                const filePath = `${chainId}/${assetAddress}/${assetId}/${layerId}.png`
                const fileName = path.basename(filePath)
                //    console.log(`mkdir -p ${BASE_PATH}/s3/${filePath.replace(fileName, "")}`)
                execSync(`mkdir -p ${S3_OUTPUT_PATH}/${filePath.replace(fileName, "")}`)
                // execSync(`mkdir -p ${STANDARDIZED_OUTPUT_PATH}/${standardizedPath}`)

                const fullFilePath = file.filePath.replace(`${BASE_PATH}/exosama-parts`, "")
                await fs.copyFile(file.filePath, `${S3_OUTPUT_PATH}/${filePath}`)

                //lets use the first image as the preview for now
                if (layerId === 0) {
                    await fs.copyFile(file.filePath, `${S3_OUTPUT_PATH}/${previewFilePath}`)

                }

                // await fs.copyFile(file.filePath, path.normalize(`${STANDARDIZED_OUTPUT_PATH}/${standardizedPath}/${standardizedFileName}.png`))

                const synethicSubItemEntity = connection.manager.create<SyntheticItemLayerEntity>(SyntheticItemLayerEntity, { id: `${chainId}-${assetAddress}-${assetId}-${layerId}`, description: fullFilePath, syntheticItem: synthItem, zIndex: file.zIndex })
                await connection.manager.save(synethicSubItemEntity)
            }
            if (files.length > 0) {
                console.log(`Has ${files.length} files`)
            } else {
                console.log("HAS NO FILES")
            }
            console.log("---------------------------------------\n\n")
        }
    }*/

    /*
    const weaponFiles = await getDirRecursive("/Users/me/Downloads/exosama_weapons")
    const synItems = await connection.manager.find<SyntheticItemEntity>(SyntheticItemEntity, { syntheticPart: { id: 106 } })
    let results = []
    for (const synItem of synItems) {
        const attrs = synItem.attributes[0]
        if (attrs.trait_type === "Weapon") {
            const val = attrs.value.replace("Sniper Rifle", "Sniper").replace("SMG-217", "smg-218").replace("Golden Cyber Axe", "Crimson Cyber Axe").replace("Royal Cyber Axe", "Midnight Cyber Axe")
            const snakeVal = snakeCase(val).replace("a_k-47", "ak47") + ".png"
            console.log(snakeVal)
            const matchingFile = weaponFiles.find((f: any) => f.file === snakeVal)
            if (!!matchingFile) {
                //   console.log(`${val} MATCH: ${matchingFile.path}`)
                const pieces = synItem.id.split("-")
                const s3Path = `customizer/${pieces[0]}/${pieces[1]}/${synItem.assetId}.png`
                results.push({ path: matchingFile.path, s3Path })
                console.log(s3Path)
            } else {
                // console.log(`${val} NO MATCH`)

            }
            // console.log("\n\n")
        }
    }
    console.log(JSON.stringify(results))*/

    const synItems = await connection.manager.find<SyntheticItemEntity>(SyntheticItemEntity, { syntheticPart: { id: 105 } })
    const allIds = []
    for (const item of synItems) {
        const attrs = item.attributes
        if (JSON.stringify(attrs).includes(` Bomber"}]`)) {
            //   console.log(JSON.stringify(item, null, 4))
            const pieces = item.id.split("-")
            const newId = `1-${pieces[1]}-${item.assetId}-1`
            allIds.push(newId)
            const synethicSubItemEntity = connection.manager.create<SyntheticItemLayerEntity>(SyntheticItemLayerEntity, { id: newId, description: "/clothes/onyx_hacker_clothes.png", syntheticItem: item, zIndex: 501 })
            await connection.manager.save(synethicSubItemEntity)

        }
    }
    console.log(JSON.stringify(allIds))

    //   process.exit(0);
}

var getDirRecursive = async (dir: any) => {
    try {
        const items = await fs.readdir(dir);
        let files: any = [];
        for (const item of items) {
            if ((await fs.lstat(`${dir}/${item}`)).isDirectory()) files = [...files, ...(await getDirRecursive(`${dir}/${item}`))];
            else files.push({ file: item, path: `${dir}/${item}`, parents: dir.split("/") });
        }
        return files;
    } catch (e) {
        return e
    }
};

var snakeCase = (string: string) => {
    return string
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join('_');
};

main()
