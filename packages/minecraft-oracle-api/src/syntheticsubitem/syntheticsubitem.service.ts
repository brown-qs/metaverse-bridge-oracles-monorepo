import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SyntheticSubItemEntity } from './syntheticsubitem.entity';

@Injectable()
export class SyntheticSubItemService {
    constructor(
        @InjectRepository(SyntheticSubItemEntity)
        private readonly repository: Repository<SyntheticSubItemEntity>
    ) { }

    public static calculateId(dto: { chainId: string | number, assetAddress: string, assetId: string | number, syntheticPartId: string | number }): string {
        return `${dto.chainId}-${dto.assetAddress}-${dto.assetId}-${dto.syntheticPartId}`
    }

    public async create(material: SyntheticSubItemEntity): Promise<SyntheticSubItemEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: SyntheticSubItemEntity[]): Promise<SyntheticSubItemEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: SyntheticSubItemEntity): Promise<SyntheticSubItemEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: SyntheticSubItemEntity[]): Promise<SyntheticSubItemEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SyntheticSubItemEntity>, partialEntity: QueryDeepPartialEntity<SyntheticSubItemEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<SyntheticSubItemEntity>): Promise<SyntheticSubItemEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SyntheticSubItemEntity>): Promise<SyntheticSubItemEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SyntheticSubItemEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<SyntheticSubItemEntity>, options?: FindOneOptions<SyntheticSubItemEntity>): Promise<SyntheticSubItemEntity> {
        const result: SyntheticSubItemEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
