import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ResourceInventoryEntity } from './resourceinventory.entity';

@Injectable()
export class ResourceInventoryService {
    constructor(
        @InjectRepository(ResourceInventoryEntity)
        private readonly repository: Repository<ResourceInventoryEntity>,
        private configService: ConfigService
    ) {}

    public static calculateId(dto: {chainId: string | number; assetAddress: string; assetId: string | number, uuid: string}): string {
        return `${dto.uuid}-${dto.chainId}-${dto.assetAddress}-${dto.assetId}`
    }
    
    public async create(snapshotItem: ResourceInventoryEntity): Promise<ResourceInventoryEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: ResourceInventoryEntity[]): Promise<ResourceInventoryEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: ResourceInventoryEntity): Promise<ResourceInventoryEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: ResourceInventoryEntity[], removeOptions?: RemoveOptions): Promise<ResourceInventoryEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<ResourceInventoryEntity>, partialEntity: QueryDeepPartialEntity<ResourceInventoryEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<ResourceInventoryEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: string): Promise<ResourceInventoryEntity> {
        const result: ResourceInventoryEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<ResourceInventoryEntity>): Promise<ResourceInventoryEntity[]> {
        const results: ResourceInventoryEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<ResourceInventoryEntity>): Promise<ResourceInventoryEntity[]> {
        const results: ResourceInventoryEntity[] = await this.repository.find(params);
        return results;
    }
    
    public async findOne(params: FindConditions<ResourceInventoryEntity>, options?: FindOneOptions<ResourceInventoryEntity>): Promise<ResourceInventoryEntity> {
        const result: ResourceInventoryEntity = await this.repository.findOne(params, options);
        return result;
    }
}
