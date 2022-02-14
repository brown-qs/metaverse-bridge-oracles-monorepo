import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SnaplogEntity } from './snaplog.entity';

@Injectable()
export class SnaplogService {
    constructor(
        @InjectRepository(SnaplogEntity)
        private readonly repository: Repository<SnaplogEntity>,
        private configService: ConfigService
    ) {}

    public async create(snapshotItem: SnaplogEntity): Promise<SnaplogEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: SnaplogEntity[]): Promise<SnaplogEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: SnaplogEntity): Promise<SnaplogEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: SnaplogEntity[], removeOptions?: RemoveOptions): Promise<SnaplogEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<SnaplogEntity>, partialEntity: QueryDeepPartialEntity<SnaplogEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<SnaplogEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: string): Promise<SnaplogEntity> {
        const result: SnaplogEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<SnaplogEntity>): Promise<SnaplogEntity[]> {
        const results: SnaplogEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<SnaplogEntity>): Promise<SnaplogEntity[]> {
        const results: SnaplogEntity[] = await this.repository.find(params);
        return results;
    }
    
    public async findOne(params: FindConditions<SnaplogEntity>, options?: FindOneOptions<SnaplogEntity>): Promise<SnaplogEntity> {
        const result: SnaplogEntity = await this.repository.findOne(params, options);
        return result;
    }
}
