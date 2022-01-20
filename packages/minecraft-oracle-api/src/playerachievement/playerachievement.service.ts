import { Injectable } from '@nestjs/common';
import { PlayerAchievementEntity } from './playerachievement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PlayerAchievementService {
    constructor(
        @InjectRepository(PlayerAchievementEntity)
        private readonly repository: Repository<PlayerAchievementEntity>
    ) {}

    public calculateId(dto: {uuid: string, gameId: string, achievementId: string}): string {
        return `${dto.uuid}-${dto.gameId}-${dto.achievementId}`
    }

    public async create(entity: PlayerAchievementEntity): Promise<PlayerAchievementEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: PlayerAchievementEntity[]): Promise<PlayerAchievementEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: PlayerAchievementEntity): Promise<PlayerAchievementEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: PlayerAchievementEntity[]): Promise<PlayerAchievementEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<PlayerAchievementEntity>, partialEntity: QueryDeepPartialEntity<PlayerAchievementEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<PlayerAchievementEntity>): Promise<PlayerAchievementEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<PlayerAchievementEntity>): Promise<PlayerAchievementEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<PlayerAchievementEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<PlayerAchievementEntity>, options?: FindOneOptions<PlayerAchievementEntity>): Promise<PlayerAchievementEntity> {
        const result: PlayerAchievementEntity = await this.repository.findOne(params, options);
        return result;
    }
}
