import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions } from 'typeorm';
import { SecretEntity } from './secret.entity';

@Injectable()
export class SecretService {
    constructor(
        @InjectRepository(SecretEntity)
        private readonly repository: Repository<SecretEntity>
    ) { }

    public async create(gameSessionEntity: SecretEntity): Promise<SecretEntity> {
        const u = await this.repository.save(gameSessionEntity);
        return u;
    }

    public async createMultiple(gameSessionEntitys: SecretEntity[]): Promise<SecretEntity[]> {
        const u = await this.repository.save(gameSessionEntitys);
        return u;
    }

    public async remove(gameSessionEntity: SecretEntity): Promise<SecretEntity> {
        const u = await this.repository.remove(gameSessionEntity);
        return u;
    }

    public async removeMultiple(gameSessionEntitys: SecretEntity[]): Promise<SecretEntity[]> {
        const u = await this.repository.remove(gameSessionEntitys);
        return u;
    }

    public async update(gameSessionEntity: SecretEntity): Promise<SecretEntity> {
        const u = await this.repository.save(gameSessionEntity)
        return u
    }

    public async find(conditions: FindConditions<SecretEntity>): Promise<SecretEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<SecretEntity>): Promise<SecretEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<SecretEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<SecretEntity>): Promise<SecretEntity> {
        const result: SecretEntity = await this.repository.findOne(params);
        return result;
    }

    public async all(): Promise<SecretEntity[]> {
        return (await this.repository.find({ order: { name: "ASC" } }))
    }
}
