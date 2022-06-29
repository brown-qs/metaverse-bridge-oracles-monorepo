import { InjectConnection, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, EntityManager, FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
@Injectable()
export class UserService {
    constructor(
        @InjectConnection() private connection: Connection,
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private configService: ConfigService
    ) { }

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

    public async findByUserName(userName: string): Promise<UserEntity> {
        const result: UserEntity = await this.repository.findOne({ userName });
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

    public async linkMinecraftByUserUuid(userUuid: string, minecraftUuid: string, minecraftUsername: string, hasGame: boolean) {

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
            //await queryRunner.manager.save(users[0]);

            await queryRunner.commitTransaction();
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }

        return await this.findByUuid(userUuid)
    }

    public async unlinkMinecraftByUserUuid(uuid: string) {
        await this.repository.update({ uuid }, { minecraftUuid: null })
    }
}
