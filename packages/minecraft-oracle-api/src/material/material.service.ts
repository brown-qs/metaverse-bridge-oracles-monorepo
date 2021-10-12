import { Injectable } from '@nestjs/common';
import { MaterialEntity } from './material.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions } from 'typeorm';

@Injectable()
export class MaterialService {
    constructor(
        @InjectRepository(MaterialEntity)
        private readonly repository: Repository<MaterialEntity>
    ) {}

    public async create(user: MaterialEntity): Promise<MaterialEntity> {
        const u = await this.repository.save(user);
        return u;
    }

    public async remove(user: MaterialEntity): Promise<MaterialEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

    public async update(user: MaterialEntity): Promise<MaterialEntity> {
        const u = await this.repository.save(user)
        return u
    }

    public async find(conditions: FindConditions<MaterialEntity>): Promise<MaterialEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<MaterialEntity>): Promise<MaterialEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<MaterialEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findByName(name: string): Promise<MaterialEntity> {
        const result: MaterialEntity = await this.repository.findOne({ name });
        return result;
    }

    public async findOne(params: MaterialEntity): Promise<MaterialEntity> {
        const result: MaterialEntity = await this.repository.findOne(params);
        return result;
    }
}
