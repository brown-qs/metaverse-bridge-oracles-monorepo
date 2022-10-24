import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SyntheticItemLayerEntity } from './syntheticitemlayer.entity';

@Injectable()
export class SyntheticItemLayerService {
    constructor(
        @InjectRepository(SyntheticItemLayerEntity)
        private readonly repository: Repository<SyntheticItemLayerEntity>
    ) { }

    public static calculateId(dto: { chainId: string | number, assetAddress: string, assetId: string | number, syntheticPartId: string | number }): string {
        return `${dto.chainId}-${dto.assetAddress}-${dto.assetId}-${dto.syntheticPartId}`
    }

    public async create(material: SyntheticItemLayerEntity): Promise<SyntheticItemLayerEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: SyntheticItemLayerEntity[]): Promise<SyntheticItemLayerEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: SyntheticItemLayerEntity): Promise<SyntheticItemLayerEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: SyntheticItemLayerEntity[]): Promise<SyntheticItemLayerEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SyntheticItemLayerEntity>, partialEntity: QueryDeepPartialEntity<SyntheticItemLayerEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<SyntheticItemLayerEntity>): Promise<SyntheticItemLayerEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SyntheticItemLayerEntity>): Promise<SyntheticItemLayerEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SyntheticItemLayerEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<SyntheticItemLayerEntity>, options?: FindOneOptions<SyntheticItemLayerEntity>): Promise<SyntheticItemLayerEntity> {
        const result: SyntheticItemLayerEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
