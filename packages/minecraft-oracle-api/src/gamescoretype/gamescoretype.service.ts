import { Injectable } from '@nestjs/common';
import { GameScoreTypeEntity } from './gamescoretype.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SetGameScoreTypeDto } from './dtos/gamescoretype.dto';

@Injectable()
export class GameScoreTypeService {
    constructor(
        @InjectRepository(GameScoreTypeEntity)
        private readonly repository: Repository<GameScoreTypeEntity>
    ) {}

    public async create(entity: GameScoreTypeEntity): Promise<GameScoreTypeEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: GameScoreTypeEntity[]): Promise<GameScoreTypeEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: GameScoreTypeEntity): Promise<GameScoreTypeEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: GameScoreTypeEntity[]): Promise<GameScoreTypeEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<GameScoreTypeEntity>, partialEntity: QueryDeepPartialEntity<GameScoreTypeEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<GameScoreTypeEntity>): Promise<GameScoreTypeEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<GameScoreTypeEntity>): Promise<GameScoreTypeEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<GameScoreTypeEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<GameScoreTypeEntity>, options?: FindOneOptions<GameScoreTypeEntity>): Promise<GameScoreTypeEntity> {
        const result: GameScoreTypeEntity = await this.repository.findOne(params, options);
        return result;
    }

    public calculateId(dto: SetGameScoreTypeDto) {
        return `${dto.gameId}-${dto.scoreId}`;
    }
}
