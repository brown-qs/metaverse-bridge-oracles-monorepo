import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SyntheticItemEntity } from './syntheticitem.entity';

@Injectable()
export class SyntheticItemService {
    constructor(
        @InjectRepository(SyntheticItemEntity)
        private readonly repository: Repository<SyntheticItemEntity>
    ) {}

    public static calculateId(dto: {chainId: string | number, assetAddress: string, assetId: string | number, syntheticPartId: string | number}): string {
        return `${dto.chainId}-${dto.assetAddress}-${dto.assetId}-${dto.syntheticPartId}`
    }

    public async create(material: SyntheticItemEntity): Promise<SyntheticItemEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: SyntheticItemEntity[]): Promise<SyntheticItemEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: SyntheticItemEntity): Promise<SyntheticItemEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: SyntheticItemEntity[]): Promise<SyntheticItemEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SyntheticItemEntity>, partialEntity: QueryDeepPartialEntity<SyntheticItemEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<SyntheticItemEntity>): Promise<SyntheticItemEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SyntheticItemEntity>): Promise<SyntheticItemEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SyntheticItemEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<SyntheticItemEntity>, options?: FindOneOptions<SyntheticItemEntity>): Promise<SyntheticItemEntity> {
        const result: SyntheticItemEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
