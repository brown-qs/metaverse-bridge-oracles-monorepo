import { Injectable } from '@nestjs/common';
import { MaterialEntity } from './material.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID } from 'typeorm';

@Injectable()
export class MaterialService {
    constructor(
        @InjectRepository(MaterialEntity)
        private readonly repository: Repository<MaterialEntity>
    ) {}

    public async create(material: MaterialEntity): Promise<MaterialEntity> {
        const u = await this.repository.save(material);
        return u;
    }

    public async createMultiple(materials: MaterialEntity[]): Promise<MaterialEntity[]> {
        const u = await this.repository.save(materials);
        return u;
    }

    public async remove(material: MaterialEntity): Promise<MaterialEntity> {
        const u = await this.repository.remove(material);
        return u;
    }

    public async removeMultiple(materials: MaterialEntity[]): Promise<MaterialEntity[]> {
        const u = await this.repository.remove(materials);
        return u;
    }

    public async update(material: MaterialEntity): Promise<MaterialEntity> {
        const u = await this.repository.save(material)
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

    public async findOne(conditions: string | number | Date | ObjectID, options?: FindOneOptions<MaterialEntity>): Promise<MaterialEntity> {
        const result: MaterialEntity = await this.repository.findOne(conditions, options);
        return result;
    }
}
