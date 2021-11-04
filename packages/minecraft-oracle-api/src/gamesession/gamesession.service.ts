import { Injectable } from '@nestjs/common';
import { GameSessionEntity } from './gamesession.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectRepository(GameSessionEntity)
        private readonly repository: Repository<GameSessionEntity>
    ) {}

    public async create(gameSessionEntity: GameSessionEntity): Promise<GameSessionEntity> {
        const u = await this.repository.save(gameSessionEntity);
        return u;
    }

    public async createMultiple(gameSessionEntitys: GameSessionEntity[]): Promise<GameSessionEntity[]> {
        const u = await this.repository.save(gameSessionEntitys);
        return u;
    }

    public async remove(gameSessionEntity: GameSessionEntity): Promise<GameSessionEntity> {
        const u = await this.repository.remove(gameSessionEntity);
        return u;
    }

    public async removeMultiple(gameSessionEntitys: GameSessionEntity[]): Promise<GameSessionEntity[]> {
        const u = await this.repository.remove(gameSessionEntitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<GameSessionEntity>, partialEntity: QueryDeepPartialEntity<GameSessionEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<GameSessionEntity>): Promise<GameSessionEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<GameSessionEntity>): Promise<GameSessionEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<GameSessionEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async getOngoing(): Promise<GameSessionEntity | undefined> {
        const result: GameSessionEntity = await this.repository.findOne({ ongoing: true });
        return result;
    }

    public async findOne(params: FindConditions<GameSessionEntity>, options?: FindOneOptions<GameSessionEntity>): Promise<GameSessionEntity> {
        const result: GameSessionEntity = await this.repository.findOne(params, options);
        return result;
    }
}
