import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CollectionFragmentEntity } from './collectionfragment.entity';

@Injectable()
export class CollectionFragmentService {
    constructor(
        @InjectRepository(CollectionFragmentEntity)
        private readonly repository: Repository<CollectionFragmentEntity>
    ) { }

    public async create(material: CollectionFragmentEntity): Promise<CollectionFragmentEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: CollectionFragmentEntity[]): Promise<CollectionFragmentEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: CollectionFragmentEntity): Promise<CollectionFragmentEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: CollectionFragmentEntity[]): Promise<CollectionFragmentEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<CollectionFragmentEntity>, partialEntity: QueryDeepPartialEntity<CollectionFragmentEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<CollectionFragmentEntity>): Promise<CollectionFragmentEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<CollectionFragmentEntity>): Promise<CollectionFragmentEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<CollectionFragmentEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<CollectionFragmentEntity>, options?: FindOneOptions<CollectionFragmentEntity>): Promise<CollectionFragmentEntity> {
        const result: CollectionFragmentEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
