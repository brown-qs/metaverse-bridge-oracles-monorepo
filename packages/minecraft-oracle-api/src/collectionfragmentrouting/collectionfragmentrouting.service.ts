import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CollectionFragmentRoutingEntity } from './collectionfragmentrouting.entity';

@Injectable()
export class CollectionFragmentRoutingService {
    constructor(
        @InjectRepository(CollectionFragmentRoutingEntity)
        private readonly repository: Repository<CollectionFragmentRoutingEntity>
    ) { }

    public async create(material: CollectionFragmentRoutingEntity): Promise<CollectionFragmentRoutingEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: CollectionFragmentRoutingEntity[]): Promise<CollectionFragmentRoutingEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: CollectionFragmentRoutingEntity): Promise<CollectionFragmentRoutingEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: CollectionFragmentRoutingEntity[]): Promise<CollectionFragmentRoutingEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<CollectionFragmentRoutingEntity>, partialEntity: QueryDeepPartialEntity<CollectionFragmentRoutingEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<CollectionFragmentRoutingEntity>): Promise<CollectionFragmentRoutingEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<CollectionFragmentRoutingEntity>): Promise<CollectionFragmentRoutingEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<CollectionFragmentRoutingEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<CollectionFragmentRoutingEntity>, options?: FindOneOptions<CollectionFragmentRoutingEntity>): Promise<CollectionFragmentRoutingEntity> {
        const result: CollectionFragmentRoutingEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
