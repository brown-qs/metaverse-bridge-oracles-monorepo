import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private configService: ConfigService
    ) {}

    public async create(user: UserEntity): Promise<UserEntity> {
        const u = await this.repository.save(user);
        return u;
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

    public async findByUuid(uuid: string): Promise<UserEntity> {
        const result: UserEntity = (await this.repository.findOne({ uuid }));
        return result;
    }

    public async findOne(params: FindConditions<UserEntity>, options: FindOneOptions<UserEntity>): Promise<UserEntity> {
        const result: UserEntity = await this.repository.findOne(params, options);
        return result;
    }

    public async findMany(options: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
        const results: UserEntity[] = await this.repository.find(options);
        return results;
    }
}
