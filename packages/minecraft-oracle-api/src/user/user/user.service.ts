import { InjectConnection, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Like } from "typeorm"
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, DeepPartial, EntityManager, FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { UserEntity, userUuid } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { exist } from 'joi';
import { AssetEntity } from 'src/asset/asset.entity';
import { SummonEntity } from 'src/summon/summon.entity';
import { SnapshotItemEntity } from 'src/snapshot/snapshotItem.entity';
import { SnaplogEntity } from 'src/snaplog/snaplog.entity';
import { InventoryEntity } from 'src/playerinventory/inventory.entity';
import { SkinEntity } from 'src/skin/skin.entity';
import { ResourceInventory } from 'src/gameapi/dtos/resourceinventory.dto';
import { ResourceInventoryEntity } from 'src/resourceinventory/resourceinventory.entity';
import { PlaySessionEntity } from 'src/playsession/playsession.entity';
import { PlayerAchievementEntity } from 'src/playerachievement/playerachievement.entity';
import { PlayerGameItemEntity } from 'src/playergameitem/playergameitem.entity';
import { PlayerScoreEntity } from 'src/playerscore/playerscore.entity';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { MinecraftLinkEntity } from '../minecraft-link/minecraft-link.entity';
import { MinecraftLinkEvent } from 'src/common/enums/MinecraftLinkEvent';
import { ResourceInventoryOffsetEntity } from 'src/resourceinventoryoffset/resourceinventoryoffset.entity';
import { UserRole } from 'src/common/enums/UserRole';
@Injectable()
export class UserService {
    context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @InjectConnection() private connection: Connection,
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private configService: ConfigService
    ) {
        this.context = UserService.name
    }


    public async createEmail(email: string): Promise<UserEntity> {
        const em = email.toLowerCase().trim()

        const result = await this.repository.createQueryBuilder('users')
            .insert()
            .values({ uuid: userUuid(), email: em, lastLogin: new Date() })
            .orUpdate(["lastLogin"], ["email"])
            .returning('*')
            .execute()

        const user = this.repository.create(result.generatedMaps[0])
        console.log(JSON.stringify(user, null, 4))
        return user
    }

    public async remove(user: UserEntity): Promise<UserEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<UserEntity>, partialEntity: QueryDeepPartialEntity<UserEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<UserEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findByMinecraftUserName(minecraftUserName: string): Promise<UserEntity> {
        const result: UserEntity = await this.repository.findOne({ minecraftUserName });
        return result;
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        const result = await this.repository.findOne({ email: email.toLowerCase().trim() });
        return result;
    }

    public async findByUuid(uuid: string): Promise<UserEntity> {
        const result: UserEntity = (await this.repository.findOne({ uuid }));
        return result;
    }

    public async findByMinecraftUuid(minecraftUuid: string): Promise<UserEntity> {
        const result: UserEntity = (await this.repository.findOne({ minecraftUuid }));
        return result;
    }

    public async findOne(params: FindConditions<UserEntity>, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
        const result: UserEntity = await this.repository.findOne(params, options);
        return result;
    }

    public async findMany(options: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
        const results: UserEntity[] = await this.repository.find(options);
        return results;
    }

    public async findByIds(uuids: string[]) {
        const entities: UserEntity[] = await this.repository.findByIds(uuids);
        return entities;
    }

    public async linkMinecraftByUserUuid(userUuid: string, minecraftUuid: string, minecraftUserName: string, hasGame: boolean) {
        let err;
        //typeorm 0.2.45 and @nestjs/typeorm@8.0.3
        //https://github.com/typeorm/typeorm/blob/0.2.45/docs/transactions.md

        //From Nest.js: There are many different strategies to handle TypeORM transactions. We recommend using the QueryRunner class because it gives full control over the transaction.

        const queryRunner = this.connection.createQueryRunner()

        // establish real database connection using our new query runner
        await queryRunner.connect();

        //can do non-transactional queries here

        await queryRunner.startTransaction();
        try {
            /*
            Cases: 
            1. minecraft account has never been used on moonsama
                -can just set fields (minecraftUuid, minecraftUsername, hasGame) on email row 
            2. minecraft account has been used on moonsama but has never been associated with an email
                -need to move all relationships to new userUuid and delete old minecraft row after finish
                -if userUuid already has relationships from having relationships migrated from a different minecraft account, need to combine relationships from new minecraft account
            3. minecraft account is already associated with an email
                -relationships have already been migrated over to first email, can null out minecraftUuid on old user and put it on new user
            */

            const existingMinecraft = await queryRunner.manager.findOne(UserEntity, { minecraftUuid })
            console.log("Existing minecraft: " + JSON.stringify(existingMinecraft))

            //minecraft account has never been used on moonsama
            if (!existingMinecraft) {
                this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid}, MC account new to moonsama, can just add to email row`, this.context)

                //
            } else {
                //minecraft user has been migrated to an email before
                if (typeof existingMinecraft.email === "string") {
                    //safety check, uuid and minecraftUuid should be different
                    if (existingMinecraft.uuid === existingMinecraft.minecraftUuid) {
                        throw new Error("If user has an email defined, uuid !== minecraftUuid, condition not met")
                    }
                    this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid}, MC account already been migrated to email before, removing MC account from prev email, and assigning to new`, this.context)

                    //no need to migrate anything, just remove from existing user 
                    await queryRunner.manager.update(UserEntity, { minecraftUuid }, { minecraftUuid: null, minecraftUserName: null, hasGame: false })
                    const newUser = await queryRunner.manager.findOne(UserEntity, { uuid: userUuid })

                    //log the mc unlink, the user is old user who had the mc account linked, and the initiator is the new user who is linking
                    const mcLink = queryRunner.manager.create(MinecraftLinkEntity, { minecraftUuid, user: existingMinecraft, initiator: newUser, event: MinecraftLinkEvent.UNLINK })
                    await queryRunner.manager.save(MinecraftLinkEntity, mcLink)
                    queryRunner.manager.create(MinecraftLinkEntity, { minecraftUuid, user: existingMinecraft, initiator: newUser, event: MinecraftLinkEvent.UNLINK })


                    //minecraft user has never been migrated
                } else {
                    //safety check, uuid and minecraftUuid should be same for unmigrated minecraft users
                    if (existingMinecraft.uuid !== existingMinecraft.minecraftUuid) {
                        throw new Error("If old minecraft account, uuid === minecraftUuid, condition not met")
                    }
                    this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid}, MC account has never been migrated to email before, moving relationships`, this.context)

                    //move all relationships to email user
                    const relationships = [
                        { entity: AssetEntity, fk: "owner", },
                        { entity: SummonEntity, fk: "owner" },
                        { entity: SnapshotItemEntity, fk: "owner" },
                        { entity: SnaplogEntity, fk: "owner" },
                        { entity: InventoryEntity, fk: "owner" },
                        { entity: SkinEntity, fk: "owner" },
                        { entity: ResourceInventoryEntity, fk: "owner" },
                        { entity: SnapshotItemEntity, fk: "owner" },

                        { entity: PlaySessionEntity, fk: "player" },
                        { entity: PlayerAchievementEntity, fk: "player" },
                        { entity: PlayerGameItemEntity, fk: "player" },
                        { entity: PlayerScoreEntity, fk: "player" },
                    ]
                    for (const { entity, fk } of relationships) {
                        await queryRunner.manager.update(entity, { [fk]: minecraftUuid }, { [fk]: userUuid })
                    }

                    //rewrite ids
                    //ids look like: 30828468962f44e681190c1f6d82d42a-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14 ~ need to be written with new uuid
                    //ResourceInventoryOffsetEntity has a fk that references ResourceInventoryEntity, we need update cascade for this
                    //we don't need to cacade update user ids, because we are moving from the old mc user which still exists to the email user which exists, the mc user is only deleted after all the relationships have been moved
                    const rewriteIdEntities = [ResourceInventoryEntity, ResourceInventoryOffsetEntity, SkinEntity]
                    for (const entity of rewriteIdEntities) {

                        let relations = ["owner"]
                        if (entity === ResourceInventoryOffsetEntity) {
                            relations = []
                        }
                        console.log(`Entity: ${entity}`)
                        const rows = await queryRunner.manager.find(entity, { where: { id: Like(`${minecraftUuid}-%`) }, relations })
                        //console.log(`Rows: ${}`)
                        for (const row of rows) {
                            const oldRowId = row.id
                            const newRowId = oldRowId.replace(`${minecraftUuid}-`, `${userUuid}-`)
                            //sanity check, make sure query returned correct result
                            if (!oldRowId.startsWith(`${minecraftUuid}-`)) {
                                throw new Error("Old minecraft uuid not in id")
                            }

                            //sanity check: owner should already be updated to userUuid from above
                            // console.log(`row.owner: ${JSON.stringify(row.owner)}`)
                            if (entity !== ResourceInventoryOffsetEntity && row.owner.uuid !== userUuid) {
                                throw new Error("Changing composite id to new user uuid but owner is a different user")
                            }

                            //if two mc accounts are merged in, will have multiple default skins, could have multiple exo skins, etc.  
                            if (entity === SkinEntity) {
                                //on first skin row
                                if (rows.indexOf(row) === 0) {
                                    const emailUserEquipped = !!await queryRunner.manager.findOne(SkinEntity, { where: { id: Like(`${userUuid}-%`), equipped: true } })
                                    const userToMergeInIsEquipped = (rows as any).some((row: SkinEntity) => row.equipped === true)
                                    console.log(`emailUserEquipped: ${emailUserEquipped}, userToMergeInIsEquipped: ${userToMergeInIsEquipped}`)
                                    if (emailUserEquipped && userToMergeInIsEquipped) {
                                        console.log("Users who are being merged both are equipped with skins, will un-equip email user and will use equip from user who is being merged in")
                                        await queryRunner.manager.update(SkinEntity, { id: Like(`${userUuid}-%`) }, { equipped: false })
                                    }
                                }
                                //delete skin with this id from email user, otherwise updating the old row to new row will cause primary key constraint error
                                await queryRunner.manager.delete(SkinEntity, { id: newRowId })

                            }

                            await queryRunner.manager.update(entity, { "id": oldRowId }, { "id": newRowId })


                        }
                    }

                    //add bait
                    const emailUserBait = await queryRunner.manager.findOne(ResourceInventoryEntity, { where: { id: Like(`${userUuid}-%`) } })
                    const mcUserBait = await queryRunner.manager.findOne(ResourceInventoryEntity, { where: { id: Like(`${minecraftUuid}-%`) } })

                    if (!!emailUserBait && !!mcUserBait) {
                        console.log("both users have bait, needs to be added...")
                        console.log(JSON.stringify(mcUserBait))
                    }
                    throw new Error("Stop here")
                    /*
        // TODO fixme
        const bait = await this.resourceInventoryService.findOne({ owner: user }, { relations: ['owner', 'offset'] })
        if (!!bait) {
            const baitAsset = userAssets.find(x => x.assetId === bait.assetId && x.collectionFragment.recognizedAssetType.valueOf() === RecognizedAssetType.RESOURCE.valueOf())

            if (!!baitAsset) {
                assets.push(
                    {
                        amount: formatEther(BigNumber.from(bait.amount).sub(bait.offset?.amount ?? '0')),
                        assetAddress: baitAsset.collectionFragment.collection.assetAddress.toLowerCase(),
                        assetType: baitAsset.collectionFragment.collection.assetType,
                        assetId: baitAsset.assetId,
                        name: baitAsset.collectionFragment.name,
                        exportable: !baitAsset.enraptured,
                        hash: baitAsset.hash,
                        summonable: false,
                        recognizedAssetType: baitAsset.recognizedAssetType.valueOf(),
                        enraptured: baitAsset.enraptured,
                        exportChainId: baitAsset.collectionFragment.collection.chainId,
                        exportAddress: baitAsset.assetOwner?.toLowerCase(),
                    }
                )
            }
        }
                    */

                    //     throw new Error("don't continue")
                    //move
                    //move other fields to email user
                    const emailUser = await queryRunner.manager.findOne(UserEntity, { uuid: userUuid })

                    const allowedToPlay = emailUser?.allowedToPlay === true || existingMinecraft?.allowedToPlay === true
                    const blacklisted = emailUser?.blacklisted === true || existingMinecraft?.blacklisted === true
                    const vip = emailUser?.vip === true || existingMinecraft?.vip === true
                    const numGamePassAsset = emailUser?.numGamePassAsset ?? 0 + existingMinecraft?.numGamePassAsset ?? 0
                    let role = numGamePassAsset > 0 ? UserRole.PLAYER : UserRole.NONE
                    let usedAddresses = [...emailUser?.usedAddresses ?? [], ...existingMinecraft?.usedAddresses ?? []]
                    //remove duplicates
                    usedAddresses = usedAddresses.filter((item, i, self) => self.lastIndexOf(item) === i)
                    //if either of the two users being merged is an admin, user is admin
                    if (emailUser?.role.valueOf() === UserRole.ADMIN.valueOf() || existingMinecraft?.role.valueOf() === UserRole.ADMIN.valueOf()) {
                        role = UserRole.ADMIN
                    }

                    await queryRunner.manager.update(UserEntity, { uuid: userUuid }, { role, allowedToPlay, blacklisted, vip, numGamePassAsset, serverId: existingMinecraft.serverId, preferredServer: existingMinecraft.preferredServer, lastUsedAddress: existingMinecraft.lastUsedAddress, usedAddresses })


                    //remove old minecraft user
                    await queryRunner.manager.remove(UserEntity, existingMinecraft)
                }
            }

            await queryRunner.manager.update(UserEntity, { uuid: userUuid }, { minecraftUuid: minecraftUuid, minecraftUserName, hasGame })
            await queryRunner.commitTransaction();

        } catch (e) {
            console.log(e.stack)
            err = e
            this.logger.error(`user.service::linkMinecraftByUserUuid, error linking minecraft account ${e}`, e, this.context)
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
            //rethrow
            if (err) {
                throw err
            }
        }
        this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid} successful link`, this.context)
        return await this.findByUuid(userUuid)
    }

    public async unlinkMinecraftByUserUuid(uuid: string) {
        await this.repository.update({ uuid }, { minecraftUuid: null, minecraftUserName: null, hasGame: false })
    }
}
