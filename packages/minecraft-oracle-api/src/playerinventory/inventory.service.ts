import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InventoryEntity } from './inventory.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryEntity)
        private readonly repository: Repository<InventoryEntity>,
        private configService: ConfigService
    ) {}

    public static calculateId(dto: {uuid: string; materialName: string}): string {
        return `${dto.uuid}-${dto.materialName}`
    }
    
    public async create(snapshotItem: InventoryEntity): Promise<InventoryEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: InventoryEntity[]): Promise<InventoryEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: InventoryEntity): Promise<InventoryEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: InventoryEntity[], removeOptions?: RemoveOptions): Promise<InventoryEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<InventoryEntity>, partialEntity: QueryDeepPartialEntity<InventoryEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<InventoryEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: string): Promise<InventoryEntity> {
        const result: InventoryEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<InventoryEntity>): Promise<InventoryEntity[]> {
        const results: InventoryEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<InventoryEntity>): Promise<InventoryEntity[]> {
        const results: InventoryEntity[] = await this.repository.find(params);
        return results;
    }
    
    public async findOne(params: FindConditions<InventoryEntity>, options?: FindOneOptions<InventoryEntity>): Promise<InventoryEntity> {
        const result: InventoryEntity = await this.repository.findOne(params, options);
        return result;
    }
}
