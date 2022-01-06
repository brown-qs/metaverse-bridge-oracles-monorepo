import { Injectable } from '@nestjs/common';
import { AssetEntity } from './asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(AssetEntity)
        private readonly repository: Repository<AssetEntity>
    ) {}

    public async create(material: AssetEntity): Promise<AssetEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: AssetEntity[]): Promise<AssetEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: AssetEntity): Promise<AssetEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: AssetEntity[]): Promise<AssetEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<AssetEntity>, partialEntity: QueryDeepPartialEntity<AssetEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<AssetEntity>): Promise<AssetEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<AssetEntity>): Promise<AssetEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<AssetEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<AssetEntity>, options?: FindOneOptions<AssetEntity>): Promise<AssetEntity> {
        const result: AssetEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
