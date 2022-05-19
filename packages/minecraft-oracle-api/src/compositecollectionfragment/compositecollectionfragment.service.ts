import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CompositeCollectionFragmentEntity } from './compositecollectionfragment.entity';

@Injectable()
export class CompositeCollectionFragmentService {
    constructor(
        @InjectRepository(CompositeCollectionFragmentEntity)
        private readonly repository: Repository<CompositeCollectionFragmentEntity>
    ) {}

    public static calculateId(dto: {assetAddress: string, chainId?: string | number}): string {
        return `${dto.chainId}-${dto.assetAddress}`
    }

    public async create(material: CompositeCollectionFragmentEntity): Promise<CompositeCollectionFragmentEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: CompositeCollectionFragmentEntity[]): Promise<CompositeCollectionFragmentEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: CompositeCollectionFragmentEntity): Promise<CompositeCollectionFragmentEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: CompositeCollectionFragmentEntity[]): Promise<CompositeCollectionFragmentEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<CompositeCollectionFragmentEntity>, partialEntity: QueryDeepPartialEntity<CompositeCollectionFragmentEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<CompositeCollectionFragmentEntity>): Promise<CompositeCollectionFragmentEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<CompositeCollectionFragmentEntity>): Promise<CompositeCollectionFragmentEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<CompositeCollectionFragmentEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<CompositeCollectionFragmentEntity>, options?: FindOneOptions<CompositeCollectionFragmentEntity>): Promise<CompositeCollectionFragmentEntity> {
        const result: CompositeCollectionFragmentEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
