import { InjectConnection, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, EntityManager, FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
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

    public async create(user: UserEntity): Promise<UserEntity> {
        const u = await this.repository.save(user);
        return u;
    }

    public async createEmail(email: string): Promise<UserEntity> {
        const em = email.toLowerCase().trim()
        const user = this.repository.create({ email: em, lastLogin: new Date() })
        await this.repository.upsert(user, ["email"]);
        return await this.findByEmail(em)
    }

    public async createMany(users: UserEntity[]): Promise<UserEntity[]> {
        const u = await this.repository.save(users);
        return u;
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
                    const relationships = [{ entity: AssetEntity, fk: "owner" }, { entity: SummonEntity, fk: "owner" }, { entity: SnapshotItemEntity, fk: "owner" }, { entity: SnaplogEntity, fk: "owner" }, { entity: InventoryEntity, fk: "owner" }, { entity: SkinEntity, fk: "owner" }, { entity: ResourceInventoryEntity, fk: "owner" }, { entity: PlaySessionEntity, fk: "player" }, { entity: PlayerAchievementEntity, fk: "player" }, { entity: PlayerGameItemEntity, fk: "player" }, { entity: PlayerScoreEntity, fk: "player" }]
                    for (const { entity, fk } of relationships) {
                        await queryRunner.manager.update(entity, { [fk]: minecraftUuid }, { [fk]: userUuid })
                    }

                    //move
                    //move other fields to email user
                    await queryRunner.manager.update(UserEntity, { uuid: userUuid }, { role: existingMinecraft.role, allowedToPlay: existingMinecraft.allowedToPlay, blacklisted: existingMinecraft.blacklisted, vip: existingMinecraft.vip, numGamePassAsset: existingMinecraft.numGamePassAsset, serverId: existingMinecraft.serverId, preferredServer: existingMinecraft.preferredServer, lastUsedAddress: existingMinecraft.lastUsedAddress, usedAddresses: existingMinecraft.usedAddresses })

                    //TODO: gganbu

                    //remove old minecraft user
                    await queryRunner.manager.remove(UserEntity, existingMinecraft)
                }
            }

            await queryRunner.manager.update(UserEntity, { uuid: userUuid }, { minecraftUuid: minecraftUuid, minecraftUserName, hasGame })
            //TODO: add log of minecraft link/unlinks + relationship moves
            await queryRunner.commitTransaction();

        } catch (e) {
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
