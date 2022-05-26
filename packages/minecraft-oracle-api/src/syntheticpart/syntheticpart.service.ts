import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SyntheticPartEntity } from './syntheticpart.entity';

@Injectable()
export class SyntheticPartService {
    constructor(
        @InjectRepository(SyntheticPartEntity)
        private readonly repository: Repository<SyntheticPartEntity>
    ) {}

    public async create(material: SyntheticPartEntity): Promise<SyntheticPartEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: SyntheticPartEntity[]): Promise<SyntheticPartEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: SyntheticPartEntity): Promise<SyntheticPartEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: SyntheticPartEntity[]): Promise<SyntheticPartEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SyntheticPartEntity>, partialEntity: QueryDeepPartialEntity<SyntheticPartEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<SyntheticPartEntity>): Promise<SyntheticPartEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SyntheticPartEntity>): Promise<SyntheticPartEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SyntheticPartEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<SyntheticPartEntity>, options?: FindOneOptions<SyntheticPartEntity>): Promise<SyntheticPartEntity> {
        const result: SyntheticPartEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
