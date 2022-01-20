import { Injectable } from '@nestjs/common';
import { AchievementEntity } from './achievement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class AchievementService {
    constructor(
        @InjectRepository(AchievementEntity)
        private readonly repository: Repository<AchievementEntity>
    ) {}

    public async create(entity: AchievementEntity): Promise<AchievementEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: AchievementEntity[]): Promise<AchievementEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: AchievementEntity): Promise<AchievementEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: AchievementEntity[]): Promise<AchievementEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<AchievementEntity>, partialEntity: QueryDeepPartialEntity<AchievementEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<AchievementEntity>): Promise<AchievementEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(options?: FindManyOptions<AchievementEntity>): Promise<AchievementEntity[]> {
        const u = await this.repository.find(options)
        return u
    }

    public async exists(conditions: FindConditions<AchievementEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<AchievementEntity>, options?: FindOneOptions<AchievementEntity>): Promise<AchievementEntity> {
        const result: AchievementEntity = await this.repository.findOne(params, options);
        return result;
    }
}
