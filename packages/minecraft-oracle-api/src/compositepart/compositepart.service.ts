import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CompositePartEntity } from './compositepart.entity';

@Injectable()
export class CompositePartService {
    constructor(
        @InjectRepository(CompositePartEntity)
        private readonly repository: Repository<CompositePartEntity>
    ) {}

    public static calculateId(dto: {chainId: string | number, assetAddress: string, fragmentId: string | number}): string {
        return `${dto.chainId}-${dto.assetAddress}-${dto.fragmentId}`
    }

    public async create(material: CompositePartEntity): Promise<CompositePartEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: CompositePartEntity[]): Promise<CompositePartEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: CompositePartEntity): Promise<CompositePartEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: CompositePartEntity[]): Promise<CompositePartEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<CompositePartEntity>, partialEntity: QueryDeepPartialEntity<CompositePartEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<CompositePartEntity>): Promise<CompositePartEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<CompositePartEntity>): Promise<CompositePartEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<CompositePartEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<CompositePartEntity>, options?: FindOneOptions<CompositePartEntity>): Promise<CompositePartEntity> {
        const result: CompositePartEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
