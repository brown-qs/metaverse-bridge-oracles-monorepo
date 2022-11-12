import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, FindConditions, UpdateResult, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MigrationLogEntity } from './migration-log.entity';

@Injectable()
export class MigrationLogService {
    constructor(
        @InjectRepository(MigrationLogEntity)
        private readonly repository: Repository<MigrationLogEntity>
    ) { }

    public async create(entity: MigrationLogEntity): Promise<MigrationLogEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: MigrationLogEntity[]): Promise<MigrationLogEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: MigrationLogEntity): Promise<MigrationLogEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: MigrationLogEntity[]): Promise<MigrationLogEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<MigrationLogEntity>, partialEntity: QueryDeepPartialEntity<MigrationLogEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<MigrationLogEntity>): Promise<MigrationLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<MigrationLogEntity>): Promise<MigrationLogEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<MigrationLogEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<MigrationLogEntity>, options?: FindOneOptions<MigrationLogEntity>): Promise<MigrationLogEntity> {
        const result: MigrationLogEntity = await this.repository.findOne(params, options);
        return result;
    }
}
