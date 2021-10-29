import { Injectable } from '@nestjs/common';
import { SummonEntity } from './summon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID } from 'typeorm';

@Injectable()
export class SummonService {
    constructor(
        @InjectRepository(SummonEntity)
        private readonly repository: Repository<SummonEntity>
    ) {}

    public async create(data: SummonEntity): Promise<SummonEntity> {
        const u = await this.repository.save(data);
        return u;
    }

    public async createMultiple(datas: SummonEntity[]): Promise<SummonEntity[]> {
        const u = await this.repository.save(datas);
        return u;
    }

    public async remove(data: SummonEntity): Promise<SummonEntity> {
        const u = await this.repository.remove(data);
        return u;
    }

    public async removeMultiple(datas: SummonEntity[]): Promise<SummonEntity[]> {
        const u = await this.repository.remove(datas);
        return u;
    }

    public async update(data: SummonEntity): Promise<SummonEntity> {
        const u = await this.repository.save(data)
        return u
    }

    public async find(conditions: FindConditions<SummonEntity>): Promise<SummonEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SummonEntity>): Promise<SummonEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SummonEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions: FindConditions<SummonEntity>, options?: FindOneOptions<SummonEntity>): Promise<SummonEntity> {
        const result: SummonEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
