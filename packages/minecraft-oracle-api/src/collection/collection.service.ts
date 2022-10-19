import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CollectionEntity } from './collection.entity';

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(CollectionEntity)
        private readonly repository: Repository<CollectionEntity>
    ) { }

    public async create(material: CollectionEntity): Promise<CollectionEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: CollectionEntity[]): Promise<CollectionEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: CollectionEntity): Promise<CollectionEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: CollectionEntity[]): Promise<CollectionEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<CollectionEntity>, partialEntity: QueryDeepPartialEntity<CollectionEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<CollectionEntity>): Promise<CollectionEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<CollectionEntity>): Promise<CollectionEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<CollectionEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<CollectionEntity>, options?: FindOneOptions<CollectionEntity>): Promise<CollectionEntity> {
        const result: CollectionEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
