import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CompositeAssetEntity } from './compositeasset.entity';

@Injectable()
export class CompositeAssetService {
    constructor(
        @InjectRepository(CompositeAssetEntity)
        private readonly repository: Repository<CompositeAssetEntity>
    ) {}

    public static calculateId(dto: {chainId: string | number, assetAddress: string, assetId: string | number}): string {
        return `${dto.chainId}-${dto.assetAddress}-${dto.assetId}`
    }

    public async create(material: CompositeAssetEntity): Promise<CompositeAssetEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: CompositeAssetEntity[]): Promise<CompositeAssetEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: CompositeAssetEntity): Promise<CompositeAssetEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: CompositeAssetEntity[]): Promise<CompositeAssetEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<CompositeAssetEntity>, partialEntity: QueryDeepPartialEntity<CompositeAssetEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<CompositeAssetEntity>): Promise<CompositeAssetEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<CompositeAssetEntity>): Promise<CompositeAssetEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<CompositeAssetEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<CompositeAssetEntity>, options?: FindOneOptions<CompositeAssetEntity>): Promise<CompositeAssetEntity> {
        const result: CompositeAssetEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
