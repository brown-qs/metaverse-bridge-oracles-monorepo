import { Injectable } from '@nestjs/common';
import { ChainEntity } from './chain.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class ChainService {
    constructor(
        @InjectRepository(ChainEntity)
        private readonly repository: Repository<ChainEntity>
    ) {}

    public async create(material: ChainEntity): Promise<ChainEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: ChainEntity[]): Promise<ChainEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: ChainEntity): Promise<ChainEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: ChainEntity[]): Promise<ChainEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<ChainEntity>, partialEntity: QueryDeepPartialEntity<ChainEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<ChainEntity>): Promise<ChainEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<ChainEntity>): Promise<ChainEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<ChainEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<ChainEntity>, options?: FindOneOptions<ChainEntity>): Promise<ChainEntity> {
        const result: ChainEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
