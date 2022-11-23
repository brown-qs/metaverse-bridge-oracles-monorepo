import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, FindConditions, UpdateResult, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BlacklistLogEntity } from './blacklist-log.entity';

@Injectable()
export class BlacklistLogService {
    constructor(
        @InjectRepository(BlacklistLogEntity)
        private readonly repository: Repository<BlacklistLogEntity>
    ) { }

    public async create(entity: BlacklistLogEntity): Promise<BlacklistLogEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: BlacklistLogEntity[]): Promise<BlacklistLogEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: BlacklistLogEntity): Promise<BlacklistLogEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: BlacklistLogEntity[]): Promise<BlacklistLogEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<BlacklistLogEntity>, partialEntity: QueryDeepPartialEntity<BlacklistLogEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<BlacklistLogEntity>): Promise<BlacklistLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<BlacklistLogEntity>): Promise<BlacklistLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<BlacklistLogEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<BlacklistLogEntity>, options?: FindOneOptions<BlacklistLogEntity>): Promise<BlacklistLogEntity> {
        const result: BlacklistLogEntity = await this.repository.findOne(params, options);
        return result;
    }
}
