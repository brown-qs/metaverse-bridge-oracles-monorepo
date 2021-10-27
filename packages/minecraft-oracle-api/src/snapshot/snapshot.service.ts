import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { SnapshotItemEntity } from './snapshotItem.entity';

@Injectable()
export class SnapshotService {
    constructor(
        @InjectRepository(SnapshotItemEntity)
        private readonly repository: Repository<SnapshotItemEntity>,
        private configService: ConfigService
    ) {}

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

    public async removeAll(snapshotItems: SnapshotItemEntity[]): Promise<SnapshotItemEntity[]> {
        const u = await this.repository.remove(snapshotItems);
        return u;
    }

    public async update(snapshotItem: SnapshotItemEntity): Promise<SnapshotItemEntity> {
        const u = await this.repository.save(snapshotItem)
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
}
