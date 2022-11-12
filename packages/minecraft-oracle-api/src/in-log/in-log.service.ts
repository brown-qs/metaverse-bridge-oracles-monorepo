import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, FindConditions, UpdateResult, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InLogEntity } from './in-log.entity';

@Injectable()
export class InLogService {
    constructor(
        @InjectRepository(InLogEntity)
        private readonly repository: Repository<InLogEntity>
    ) { }

    public async create(entity: InLogEntity): Promise<InLogEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: InLogEntity[]): Promise<InLogEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: InLogEntity): Promise<InLogEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: InLogEntity[]): Promise<InLogEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<InLogEntity>, partialEntity: QueryDeepPartialEntity<InLogEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<InLogEntity>): Promise<InLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<InLogEntity>): Promise<InLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<InLogEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<InLogEntity>, options?: FindOneOptions<InLogEntity>): Promise<InLogEntity> {
        const result: InLogEntity = await this.repository.findOne(params, options);
        return result;
    }
}
