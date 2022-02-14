import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { GganbuEntity } from './gganbu.entity';

@Injectable()
export class GganbuService {
    constructor(
        @InjectRepository(GganbuEntity)
        private readonly repository: Repository<GganbuEntity>
    ) {}

    public async create(entity: GganbuEntity): Promise<GganbuEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createAll(entity: GganbuEntity[]): Promise<GganbuEntity[]> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: GganbuEntity[]): Promise<GganbuEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: GganbuEntity): Promise<GganbuEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: GganbuEntity[]): Promise<GganbuEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<GganbuEntity>, partialEntity: QueryDeepPartialEntity<GganbuEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<GganbuEntity>): Promise<GganbuEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<GganbuEntity>): Promise<GganbuEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<GganbuEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<GganbuEntity>, options?: FindOneOptions<GganbuEntity>): Promise<GganbuEntity> {
        const result: GganbuEntity = await this.repository.findOne(params, options);
        return result;
    }
}
