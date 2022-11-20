import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ResourceInventoryOffsetEntity } from './resourceinventoryoffset.entity';

@Injectable()
export class ResourceInventoryOffsetService {
    constructor(
        @InjectRepository(ResourceInventoryOffsetEntity)
        private readonly repository: Repository<ResourceInventoryOffsetEntity>,
        private configService: ConfigService
    ) { }

    public async create(snapshotItem: ResourceInventoryOffsetEntity): Promise<ResourceInventoryOffsetEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: ResourceInventoryOffsetEntity[]): Promise<ResourceInventoryOffsetEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: ResourceInventoryOffsetEntity): Promise<ResourceInventoryOffsetEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: ResourceInventoryOffsetEntity[], removeOptions?: RemoveOptions): Promise<ResourceInventoryOffsetEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<ResourceInventoryOffsetEntity>, partialEntity: QueryDeepPartialEntity<ResourceInventoryOffsetEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<ResourceInventoryOffsetEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: number): Promise<ResourceInventoryOffsetEntity> {
        const result: ResourceInventoryOffsetEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<ResourceInventoryOffsetEntity>): Promise<ResourceInventoryOffsetEntity[]> {
        const results: ResourceInventoryOffsetEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<ResourceInventoryOffsetEntity>): Promise<ResourceInventoryOffsetEntity[]> {
        const results: ResourceInventoryOffsetEntity[] = await this.repository.find(params);
        return results;
    }

    public async findOne(params: FindConditions<ResourceInventoryOffsetEntity>, options?: FindOneOptions<ResourceInventoryOffsetEntity>): Promise<ResourceInventoryOffsetEntity> {
        const result: ResourceInventoryOffsetEntity = await this.repository.findOne(params, options);
        return result;
    }
}
