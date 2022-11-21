import { InjectConnection, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, In, MoreThanOrEqual } from "typeorm"
import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, DeepPartial, EntityManager, FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { UserEntity, userUuid } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { exist } from 'joi';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { MinecraftLinkEntity } from '../minecraft-link/minecraft-link.entity';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { AssetEntity } from '../../asset/asset.entity';
import { UserRole } from '../../common/enums/UserRole';
import { PlayerAchievementEntity } from '../../playerachievement/playerachievement.entity';
import { PlayerGameItemEntity } from '../../playergameitem/playergameitem.entity';
import { InventoryEntity } from '../../playerinventory/inventory.entity';
import { PlayerScoreEntity } from '../../playerscore/playerscore.entity';
import { PlaySessionEntity } from '../../playsession/playsession.entity';
import { ResourceInventoryEntity } from '../../resourceinventory/resourceinventory.entity';
import { ResourceInventoryOffsetEntity } from '../../resourceinventoryoffset/resourceinventoryoffset.entity';
import { SkinEntity } from '../../skin/skin.entity';
import { SnapshotItemEntity } from '../../snapshot/snapshotItem.entity';
import { SummonEntity } from '../../summon/summon.entity';
import { RecognizedAssetType } from '../../config/constants';
import { GameEntity } from '../../game/game.entity';
import { GameKind } from '../../game/game.enum';
import { MinecraftUuidEntity } from '../minecraft-uuid/minecraft-uuid.entity';
import { MinecraftUserNameEntity } from '../minecraft-user-name/minecraft-user-name.entity';
import { EmailEntity } from '../email/email.entity';
import { EventBus } from "@nestjs/cqrs";
import { UserProfileUpdatedEvent } from '../../cqrs/events/user-profile-updated.event';
import { SanitizeService, TextNormalizationMode } from '../../sanitize/sanitize.service';
@Injectable()
export class UserService {
    context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @InjectConnection() private connection: Connection,
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private readonly eventBus: EventBus,
        private readonly configService: ConfigService,
        private readonly sanitizeService: SanitizeService
    ) {
        this.context = UserService.name
    }


    public async createEmail(email: EmailEntity): Promise<UserEntity> {

        const result = await this.repository.createQueryBuilder('users')
            .insert()
            .values({ uuid: userUuid(), email, createdAt: new Date(), lastLogin: new Date() })
            .orUpdate(["lastLogin"], ["email"])
            .returning('*')
            .execute()

        const user = this.repository.create(result.generatedMaps[0])
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

    public async findByEmail(email: EmailEntity): Promise<UserEntity> {
        const result = await this.repository.findOne({ email });
        return result;
    }

    public async findByUuid(uuid: string): Promise<UserEntity> {
        const result: UserEntity = (await this.repository.findOne({ uuid }, { relations: ["email"] }));
        return result;
    }

    public async findByMinecraftUuid(minecraftUuid: string): Promise<UserEntity> {
        const result: UserEntity = (await this.repository.findOne({ minecraftUuid }, { relations: ["email"] }));
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
        this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid} minecraftUserName: ${minecraftUserName} hasGame: ${hasGame}`, this.context)
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
            const existingMinecraft = await queryRunner.manager.findOne(UserEntity, { minecraftUuid }, { relations: ["email"] })



            //minecraft account has never been used on moonsama or was already migrated and unlinked
            if (!existingMinecraft) {
                this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid}, MC account new to moonsama, can just add to email row`, this.context)

                //
            } else {
                //minecraft user has been migrated to an email before and is in use
                if (!!existingMinecraft?.email?.email) {
                    //safety check, uuid and minecraftUuid should be different
                    if (existingMinecraft.uuid === existingMinecraft.minecraftUuid) {
                        throw new Error("If user has an email defined, uuid !== minecraftUuid, condition not met")
                    }
                    this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid}, MC account already been migrated to email before, removing MC account from prev email, and assigning to new`, this.context)

                    if (!!(await queryRunner.manager.findOne(GameEntity, { ongoing: true, type: GameKind.CARNAGE }))) {
                        throw new UnprocessableEntityException('Linking this Minecraft account would require unlinking it from another user who is currently using it. You cannot do this during Carnage or the resource distribution period after Carnage.')
                    }
                    //no need to migrate anything, just remove from existing user 
                    await queryRunner.manager.update(UserEntity, { minecraftUuid }, { minecraftUuid: null, minecraftUserName: null, hasGame: false })
                    const newUser = await queryRunner.manager.findOne(UserEntity, { uuid: userUuid })

                    //log the mc unlink, the user is old user who had the mc account linked, and the initiator is the new user who is linking
                    queryRunner.manager.update(MinecraftLinkEntity, { user: existingMinecraft, minecraftUuid, unlinkedAt: null }, { unlinkedAt: new Date(), unlinkInitiator: newUser })


                    //minecraft user has never been migrated
                } else {
                    //safety check, uuid and minecraftUuid should be same for unmigrated minecraft users
                    if (existingMinecraft.uuid !== existingMinecraft.minecraftUuid) {
                        throw new Error("If old minecraft account, uuid === minecraftUuid, condition not met")
                    }
                    this.logger.debug(`user.service::linkMinecraftByUserUuid userUuid: ${userUuid} minecraftUuid: ${minecraftUuid}, MC account has never been migrated to email before, moving relationships`, this.context)

                    //dont let users combine accounts with enraptured gamepasses

                    const emUser = await queryRunner.manager.findOne(UserEntity, { uuid: userUuid })
                    const emailEnrapturedGamepass = await queryRunner.manager.findOne(AssetEntity, { owner: emUser, recognizedAssetType: RecognizedAssetType.TEMPORARY_TICKET, enraptured: true })
                    const mcEnrapturedGamepass = await queryRunner.manager.findOne(AssetEntity, { owner: existingMinecraft, recognizedAssetType: RecognizedAssetType.TEMPORARY_TICKET, enraptured: true })
                    this.logger.debug(`user.service::linkMinecraftByUserUuid mcEnrapturedGamepass: ${!!mcEnrapturedGamepass} emailEnrapturedGamepass: ${!!emailEnrapturedGamepass}`, this.context)

                    if (!!emailEnrapturedGamepass && !!mcEnrapturedGamepass) {
                        throw new UnprocessableEntityException("You already have an enraptured gamepass in your account, you cannot link a Minecraft account that also has an enraptured gamepass.")
                    }

                    //move all relationships to email user
                    const relationships = [
                        { entity: AssetEntity, fk: "owner", },
                        { entity: SummonEntity, fk: "owner" },
                        { entity: SnapshotItemEntity, fk: "owner" },
                        //we will just leave this alone, fk constraint was removed
                        //{ entity: SnaplogEntity, fk: "owner" },
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


                    //merge inventory
                    const emailUserInventoryRows = await queryRunner.manager.find(InventoryEntity, { where: { id: Like(`${userUuid}-%`) } })
                    const mcUserInventoryRows = await queryRunner.manager.find(InventoryEntity, { where: { id: Like(`${minecraftUuid}-%`) } })
                    this.logger.debug(`user.service::linkMinecraftByUserUuid emailUserInventoryRows.length ${emailUserInventoryRows.length} mcUserInventoryRows.length ${mcUserInventoryRows.length}`, this.context)

                    if (emailUserInventoryRows.length > 0 && mcUserInventoryRows.length > 0) {
                        this.logger.debug(`user.service::linkMinecraftByUserUuid both users have inventory, needs to be added.`, this.context)
                        let items = [...emailUserInventoryRows, ...mcUserInventoryRows].map(row => row.id.split("-")[1])
                        //de-dupe
                        items = items.filter((item, i, self) => self.lastIndexOf(item) === i).sort()

                        for (const item of items) {
                            const emailHasItem = emailUserInventoryRows.some(inv => inv.id.endsWith(`-${item}`))
                            const mcHasItem = mcUserInventoryRows.some(inv => inv.id.endsWith(`-${item}`))
                            this.logger.debug(`user.service::linkMinecraftByUserUuid ${item} mcHasItem: ${mcHasItem} emailHasItem: ${emailHasItem}`, this.context)

                            if (emailHasItem && mcHasItem) {
                                this.logger.debug(`user.service::linkMinecraftByUserUuid both users have item ${item}, we need to add them`, this.context)
                                const oldId = `${minecraftUuid}-${item}`
                                const newId = oldId.replace(`${minecraftUuid}-`, `${userUuid}-`)
                                const mcInventory = await queryRunner.manager.findOne(InventoryEntity, { id: oldId })
                                const emailInventory = await queryRunner.manager.findOne(InventoryEntity, { id: newId })

                                const summedInventory = formatEther(BigNumber.from(parseEther(mcInventory.amount)).add(parseEther(emailInventory.amount)))
                                this.logger.debug(`user.service::linkMinecraftByUserUuid item: ${item} mcInventory: ${mcInventory.amount} emailInventory: ${emailInventory.amount} summedInventory: ${summedInventory}`, this.context)
                                await queryRunner.manager.update(InventoryEntity, { id: newId }, { amount: summedInventory })
                                await queryRunner.manager.delete(InventoryEntity, { id: oldId })

                            } else if (mcHasItem) {
                                this.logger.debug(`user.service::linkMinecraftByUserUuid only mc user has item ${item}, we can just rewrite the id`, this.context)
                                const oldId = `${minecraftUuid}-${item}`
                                const newId = oldId.replace(`${minecraftUuid}-`, `${userUuid}-`)
                                await queryRunner.manager.update(InventoryEntity, { id: oldId }, { id: newId })
                            }
                        }

                        this.logger.debug(`user.service::linkMinecraftByUserUuid successfully merged inventory!`, this.context)

                    } else if (mcUserInventoryRows.length > 0) {
                        this.logger.debug(`user.service::linkMinecraftByUserUuid just mc user has inventory`, this.context)

                        for (const row of mcUserInventoryRows) {
                            const oldId = row.id
                            const newId = oldId.replace(`${minecraftUuid}-`, `${userUuid}-`)
                            await queryRunner.manager.update(InventoryEntity, { id: oldId }, { id: newId })
                        }

                        this.logger.debug(`user.service::linkMinecraftByUserUuid successfully moved inventory!`, this.context)
                    }

                    //   throw new Error("Stop here")
                    //merge bait :)
                    const emailUserBait = await queryRunner.manager.findOne(ResourceInventoryEntity, { where: { id: Like(`${userUuid}-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14`) }, relations: ["offsets"] })
                    const mcUserBait = await queryRunner.manager.findOne(ResourceInventoryEntity, { where: { id: Like(`${minecraftUuid}-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14`) }, relations: ["offsets"] })

                    if (!!emailUserBait && !!mcUserBait) {
                        this.logger.debug(`user.service::linkMinecraftByUserUuid both users have bait, needs to be added.`, this.context)
                        //add bait from mc user and email user
                        const mcUserBaitAmount = BigNumber.from(mcUserBait?.amount ?? '0')
                        const emailUserBaitAmount = BigNumber.from(emailUserBait?.amount ?? '0')
                        this.logger.debug(`user.service::linkMinecraftByUserUuid [MC User] Bait: ${formatEther(mcUserBaitAmount)} [Email User] Bait: ${formatEther(emailUserBaitAmount)}`, this.context)

                        const addedBait = (mcUserBaitAmount.add(emailUserBaitAmount)).toString()

                        //move over all bait to email user
                        this.logger.debug(`user.service::linkMinecraftByUserUuid moving over all bait to email user...`, this.context)

                        await queryRunner.manager.update(ResourceInventoryEntity, { id: Like(`${userUuid}-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14`) }, { amount: addedBait })

                        //zero out minecraft user, will be deleted after keys in asset_entity are updated
                        this.logger.debug(`user.service::linkMinecraftByUserUuid zeroing out bait in mc user...`, this.context)
                        await queryRunner.manager.update(ResourceInventoryEntity, { id: Like(`${minecraftUuid}`) }, { amount: BigNumber.from("0").toString() })


                        //update keys on asset_entity to point to email user
                        this.logger.debug(`user.service::linkMinecraftByUserUuid updating resourceInventoryId on asset_entity to all be email user based`, this.context)
                        await queryRunner.manager.update(AssetEntity, { resourceInventory: { id: mcUserBait.id } }, { resourceInventory: { id: emailUserBait.id } })

                        this.logger.debug(`user.service::linkMinecraftByUserUuid moving resource inventory offset to new uuid`, this.context)
                        await queryRunner.manager.update(ResourceInventoryOffsetEntity, { resourceInventory: { id: `${minecraftUuid}-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14` } }, { resourceInventory: { id: `${userUuid}-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14` } })


                        this.logger.debug(`user.service::linkMinecraftByUserUuid deleting old minecraft resource_inventory_entity rows`, this.context)
                        const oldMcResourceId = mcUserBait.id
                        const newMcResourceId = oldMcResourceId.replace(`${minecraftUuid}-`, `${userUuid}-`)

                        //ResourceInventoryEntity's id cascades to update the fk relationship in asset_entity, but no rows should reference it since we moved over all the fk's to asset_entity
                        await queryRunner.manager.delete(ResourceInventoryEntity, { id: Like(`${minecraftUuid}-%`) })
                        this.logger.debug(`user.service::linkMinecraftByUserUuid successfully merged bait!`, this.context)

                    } else if (!!mcUserBait) {
                        this.logger.debug(`user.service::linkMinecraftByUserUuid just mc user has bait`, this.context)

                        //update id on resource_inventory_entity will cascade to fks on asset_entity and resource_inventory_offset_entity, then just need to update id on resource_inventory_offset_entity
                        const mcUserBait = await queryRunner.manager.findOne(ResourceInventoryEntity, { where: { id: Like(`${minecraftUuid}-%`) }, relations: ["offsets"] })
                        const mcUserBaitAmount = BigNumber.from(mcUserBait?.amount ?? '0')
                        this.logger.debug(`user.service::linkMinecraftByUserUuid [MC User] Bait: ${formatEther(mcUserBaitAmount)}`, this.context)

                        const oldMcResourceId = mcUserBait.id
                        const newMcResourceId = oldMcResourceId.replace(`${minecraftUuid}-`, `${userUuid}-`)
                        //updating id here will cascade to fk on asset_entity and resource_inventory_offset_entity
                        await queryRunner.manager.update(ResourceInventoryEntity, { id: oldMcResourceId }, { id: newMcResourceId })



                        this.logger.debug(`user.service::linkMinecraftByUserUuid successfully moved bait!`, this.context)
                    }

                    //merge skins
                    const skins = await queryRunner.manager.find(SkinEntity, { where: { id: Like(`${minecraftUuid}-%`) }, relations: ["owner"] })
                    for (const skin of skins) {
                        const oldRowId = skin.id
                        const newRowId = oldRowId.replace(`${minecraftUuid}-`, `${userUuid}-`)
                        //sanity check, make sure query returned correct result
                        if (!oldRowId.startsWith(`${minecraftUuid}-`)) {
                            throw new Error("Old minecraft uuid not in id")
                        }

                        //sanity check: owner should already be updated to userUuid from above
                        if (skin.owner.uuid !== userUuid) {
                            throw new Error("Changing composite id to new user uuid but owner is a different user")
                        }

                        //on first skin row
                        if (skins.indexOf(skin) === 0) {
                            const emailUserEquipped = !!await queryRunner.manager.findOne(SkinEntity, { where: { id: Like(`${userUuid}-%`), equipped: true } })
                            const userToMergeInIsEquipped = skins.some(skin => skin.equipped === true)
                            this.logger.debug(`user.service::linkMinecraftByUserUuid emailUserEquipped: ${emailUserEquipped}, userToMergeInIsEquipped: ${userToMergeInIsEquipped}`, this.context)

                            if (emailUserEquipped && userToMergeInIsEquipped) {
                                this.logger.debug(`user.service::linkMinecraftByUserUuid Users who are being merged both are equipped with skins, will un-equip email user and will use equip from user who is being merged in`, this.context)
                                await queryRunner.manager.update(SkinEntity, { id: Like(`${userUuid}-%`) }, { equipped: false })
                            }
                        }
                        //if two mc accounts are merged in, will have multiple default skins, could have multiple exo skins, etc., this will fix that
                        //delete skin with this id from email user, otherwise updating the old row to new row will cause primary key constraint error
                        await queryRunner.manager.delete(SkinEntity, { id: newRowId })
                        await queryRunner.manager.update(SkinEntity, { "id": oldRowId }, { "id": newRowId })
                    }




                    //move
                    //move other fields to email user
                    const emailUser = await queryRunner.manager.findOne(UserEntity, { uuid: userUuid })

                    const allowedToPlay = (emailUser?.allowedToPlay === true) || (existingMinecraft?.allowedToPlay === true)
                    this.logger.debug(`user.service::linkMinecraftByUserUuid emailUser?.blacklisted === true: ${emailUser?.blacklisted === true} existingMinecraft?.allowedToPlay === true: ${existingMinecraft?.allowedToPlay === true} allowedToPlay: ${allowedToPlay}`, this.context)
                    const blacklisted = (emailUser?.blacklisted === true) || (existingMinecraft?.blacklisted === true)
                    const vip = (emailUser?.vip === true) || (existingMinecraft?.vip === true)
                    const numGamePassAsset = (emailUser?.numGamePassAsset ?? 0) + (existingMinecraft?.numGamePassAsset ?? 0)
                    this.logger.debug(`user.service::linkMinecraftByUserUuid emailUser?.numGamePassAsset ?? 0: ${emailUser?.numGamePassAsset ?? 0} existingMinecraft?.numGamePassAsset ?? 0: ${existingMinecraft?.numGamePassAsset ?? 0} numGamePassAsset: ${numGamePassAsset}`, this.context)

                    let usedAddresses = [...emailUser?.usedAddresses ?? [], ...existingMinecraft?.usedAddresses ?? []]
                    //remove duplicates
                    usedAddresses = usedAddresses.filter((item, i, self) => self.lastIndexOf(item) === i)
                    //if either of the two users being merged is an admin, user is admin

                    let role = numGamePassAsset > 0 ? UserRole.PLAYER : UserRole.NONE
                    if (emailUser?.role.valueOf() === UserRole.ADMIN.valueOf() || existingMinecraft?.role.valueOf() === UserRole.ADMIN.valueOf()) {
                        role = UserRole.ADMIN
                    }

                    await queryRunner.manager.update(UserEntity, { uuid: userUuid }, { role, allowedToPlay, blacklisted, vip, numGamePassAsset, serverId: existingMinecraft.serverId, preferredServer: existingMinecraft.preferredServer, lastUsedAddress: existingMinecraft.lastUsedAddress, usedAddresses })


                    //remove old minecraft user
                    await queryRunner.manager.remove(UserEntity, existingMinecraft)
                }
            }

            await queryRunner.manager.update(UserEntity, { uuid: userUuid }, { minecraftUuid: minecraftUuid, minecraftUserName, hasGame })

            const newUser = await queryRunner.manager.findOne(UserEntity, { uuid: userUuid })

            await queryRunner.manager.upsert(MinecraftUuidEntity, { minecraftUuid }, ["minecraftUuid"])
            await queryRunner.manager.upsert(MinecraftUserNameEntity, { minecraftUserName }, ["minecraftUserName"])
            const mcUuidEn = await queryRunner.manager.findOne(MinecraftUuidEntity, { minecraftUuid })
            const mcUserNameEn = await queryRunner.manager.findOne(MinecraftUserNameEntity, { minecraftUserName })


            const mcLink = queryRunner.manager.create(MinecraftLinkEntity, { user: newUser, minecraftUuid: mcUuidEn, minecraftUserName: mcUserNameEn, hasGame, linkInitiator: newUser, linkedAt: new Date() })
            await queryRunner.manager.save(MinecraftLinkEntity, mcLink)

            //add minecraft link
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
        const u = await this.findByUuid(userUuid)
        this.eventBus.publish(new UserProfileUpdatedEvent(userUuid))
        return u
    }

    public async unlinkMinecraftByUserUuid(uuid: string) {
        await this.repository.update({ uuid }, { minecraftUuid: null, minecraftUserName: null, hasGame: false })
        this.eventBus.publish(new UserProfileUpdatedEvent(uuid))
    }

    public async setGamerTag(uuid: string, gamerTag: string) {
        if (typeof gamerTag !== "string") {
            throw new BadRequestException("Gamer Tag must be a string")
        }
        this.logger.debug(`setGamerTag:: user ${uuid} wants to set gamerTag encodeURIComponent() ${encodeURIComponent(gamerTag)}`, this.context)

        const sanitizeOptions = {
            textNormalizationMode: TextNormalizationMode.NFKC,
            removeNewlineAndTab: true,
            removeControlCharacters: true,
            removeEmoji: true,
            removeXss: true,
            removeWhitespaceBeforeAfter: true
        }

        const sanitizedGamerTag = this.sanitizeService.sanitize(gamerTag, sanitizeOptions)
        if (sanitizedGamerTag.length === 0) {
            throw new BadRequestException("Gamer Tag is either blank or contains invalid characters")
        }

        if (sanitizedGamerTag.length > 30) {
            throw new BadRequestException("Gamer Tag is too long")
        }

        try {
            await this.repository.update({ uuid }, { gamerTag: sanitizedGamerTag })
        } catch (e) {
            if (String(e).includes("duplicate key")) {
                throw new BadRequestException("Gamer Tag is already taken")
            } else {
                throw e
            }
        }
        this.eventBus.publish(new UserProfileUpdatedEvent(uuid))
        return sanitizedGamerTag
    }

    public async minecraftUuidMap(offset: number, minecraftUuids: string[] | undefined, limit: number | undefined) {



        const query = this.repository.createQueryBuilder('users')
            .select("users.uuid", "uuid")
            .addSelect("users.minecraftUuid", "minecraftUuid")
            .orderBy("users.minecraftUuid", "ASC")
            .offset(offset)

        if (Array.isArray(minecraftUuids)) {
            query.where({ "minecraftUuid": In([...minecraftUuids]) })
        }
        if (!!limit) {
            query.limit(limit)
        }
        return await query.execute()
    }

    public async userUpdates(offset: number, secsSinceEpoch: string, take: number | undefined): Promise<string[]> {

        //sanitize to prevent sql injection
        const s = parseInt(secsSinceEpoch).toString()

        const query = this.repository.createQueryBuilder('users')
            .select("users.uuid", "uuid")
            .where(`extract(epoch from users.relationsUpdatedAt) >= ${s}`)
            .orderBy("users.relationsUpdatedAt", "ASC")
            .offset(offset)

        if (!!take) {
            query.limit(take)
        }
        const rows = await query.execute()
        return rows.map((r: { uuid: string }) => r.uuid)
    }

    /*
    //too dangerous to be used in production, could be used for stealing

    public async testMigration(uuid: string, minecraftUuid: string) {
        const emailUser = await this.findOne({ uuid })
        const mcUser = await this.findOne({ uuid: minecraftUuid })

        if (uuid === minecraftUuid) {
            throw new UnprocessableEntityException("uuid and minecraftUuid must be different")
        }

        if (!emailUser) {
            throw new UnprocessableEntityException("uuid doesn't exist")
        }

        if (!mcUser) {
            throw new UnprocessableEntityException("minecraftUuid doesn't exist")
        }

        if (!!mcUser.email) {
            throw new UnprocessableEntityException("minecraftUuid has already been migrated")
        }

        if (!emailUser.email) {
            throw new UnprocessableEntityException("uuid hasn't been migrated yet, can't use")
        }
        await this.linkMinecraftByUserUuid(uuid, minecraftUuid, "me", true)

    }*/
}
