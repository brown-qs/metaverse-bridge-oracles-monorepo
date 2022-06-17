import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { KiltUserEntity } from './kilt-user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class KiltUserService {
    constructor(
        @InjectRepository(KiltUserEntity)
        private readonly repository: Repository<KiltUserEntity>,
        private configService: ConfigService
    ) { }
    /*
public async create(user: KiltUserEntity): Promise<KiltUserEntity> {
    const u = await this.repository.save(user);
    return u;
}

public async createMany(users: KiltUserEntity[]): Promise<KiltUserEntity[]> {
    const u = await this.repository.save(users);
    return u;
}

public async remove(user: KiltUserEntity): Promise<KiltUserEntity> {
    const u = await this.repository.remove(user);
    return u;
}

public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<KiltUserEntity>, partialEntity: QueryDeepPartialEntity<KiltUserEntity>): Promise<UpdateResult> {
    const u = await this.repository.update(criteria, partialEntity)
    return u
}

public async exists(conditions: FindConditions<KiltUserEntity>): Promise<boolean> {
    return (await this.repository.findOne(conditions)) !== undefined;
}

public async findByUuid(uuid: string): Promise<KiltUserEntity> {
    const result: KiltUserEntity = (await this.repository.findOne({ uuid }));
    return result;
}

public async findOne(params: FindConditions<KiltUserEntity>, options?: FindOneOptions<KiltUserEntity>): Promise<KiltUserEntity> {
    const result: KiltUserEntity = await this.repository.findOne(params, options);
    return result;
}

public async findMany(options: FindManyOptions<KiltUserEntity>): Promise<KiltUserEntity[]> {
    const results: KiltUserEntity[] = await this.repository.find(options);
    return results;
}

public async findByIds(uuids: string[]) {
    const entities: KiltUserEntity[] = await this.repository.findByIds(uuids);
    return entities;
}*/
}
