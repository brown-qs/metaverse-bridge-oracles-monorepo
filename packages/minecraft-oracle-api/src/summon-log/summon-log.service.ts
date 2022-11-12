import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, FindConditions, UpdateResult, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SummonLogEntity } from './summon-log.entity';

@Injectable()
export class SummonLogService {
    constructor(
        @InjectRepository(SummonLogEntity)
        private readonly repository: Repository<SummonLogEntity>
    ) { }

    public async create(entity: SummonLogEntity): Promise<SummonLogEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: SummonLogEntity[]): Promise<SummonLogEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: SummonLogEntity): Promise<SummonLogEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: SummonLogEntity[]): Promise<SummonLogEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SummonLogEntity>, partialEntity: QueryDeepPartialEntity<SummonLogEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<SummonLogEntity>): Promise<SummonLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SummonLogEntity>): Promise<SummonLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SummonLogEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<SummonLogEntity>, options?: FindOneOptions<SummonLogEntity>): Promise<SummonLogEntity> {
        const result: SummonLogEntity = await this.repository.findOne(params, options);
        return result;
    }
}
