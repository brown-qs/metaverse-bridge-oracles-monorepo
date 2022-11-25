import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'aws-sdk';
import { Repository, RemoveOptions, ObjectID, FindConditions, UpdateResult, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SnaplogMergeEntity } from './snaplog-merge.entity';

@Injectable()
export class SnaplogMergeService {
    constructor(
        @InjectRepository(SnaplogMergeEntity)
        private readonly repository: Repository<SnaplogMergeEntity>,
    ) { }

    public async create(snapshotItem: SnaplogMergeEntity): Promise<SnaplogMergeEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: SnaplogMergeEntity[]): Promise<SnaplogMergeEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: SnaplogMergeEntity): Promise<SnaplogMergeEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: SnaplogMergeEntity[], removeOptions?: RemoveOptions): Promise<SnaplogMergeEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SnaplogMergeEntity>, partialEntity: QueryDeepPartialEntity<SnaplogMergeEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<SnaplogMergeEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: string): Promise<SnaplogMergeEntity> {
        const result: SnaplogMergeEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<SnaplogMergeEntity>): Promise<SnaplogMergeEntity[]> {
        const results: SnaplogMergeEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<SnaplogMergeEntity>): Promise<SnaplogMergeEntity[]> {
        const results: SnaplogMergeEntity[] = await this.repository.find(params);
        return results;
    }

    public async findOne(params: FindConditions<SnaplogMergeEntity>, options?: FindOneOptions<SnaplogMergeEntity>): Promise<SnaplogMergeEntity> {
        const result: SnaplogMergeEntity = await this.repository.findOne(params, options);
        return result;
    }
}
