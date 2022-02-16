import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { SnapshotItemEntity } from './snapshotItem.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class SnapshotService {
    constructor(
        @InjectRepository(SnapshotItemEntity)
        private readonly repository: Repository<SnapshotItemEntity>,
        private configService: ConfigService
    ) {}

    public static calculateId(dto: {uuid: string, materialName: string, gameId: string | null}): string {
        return `${dto.uuid}-${dto.materialName}-${dto.gameId ?? 'NULL'}`
    }

    public async create(snapshotItem: SnapshotItemEntity): Promise<SnapshotItemEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: SnapshotItemEntity[]): Promise<SnapshotItemEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: SnapshotItemEntity): Promise<SnapshotItemEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: SnapshotItemEntity[], removeOptions?: RemoveOptions): Promise<SnapshotItemEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SnapshotItemEntity>, partialEntity: QueryDeepPartialEntity<SnapshotItemEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<SnapshotItemEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: string): Promise<SnapshotItemEntity> {
        const result: SnapshotItemEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<SnapshotItemEntity>): Promise<SnapshotItemEntity[]> {
        const results: SnapshotItemEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<SnapshotItemEntity>): Promise<SnapshotItemEntity[]> {
        const results: SnapshotItemEntity[] = await this.repository.find(params);
        return results;
    }
    
    public async findOne(params: FindConditions<SnapshotItemEntity>, options?: FindOneOptions<SnapshotItemEntity>): Promise<SnapshotItemEntity> {
        const result: SnapshotItemEntity = await this.repository.findOne(params, options);
        return result;
    }

    public async findOneNested(options: FindOneOptions<SnapshotItemEntity>): Promise<SnapshotItemEntity> {
        const result: SnapshotItemEntity = await this.repository.findOne(options);
        return result;
    }
}
