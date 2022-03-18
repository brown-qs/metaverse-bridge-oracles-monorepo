import { Injectable } from '@nestjs/common';
import { GameEntity } from './game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly repository: Repository<GameEntity>
    ) {}

    public async create(entity: GameEntity): Promise<GameEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: GameEntity[]): Promise<GameEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: GameEntity): Promise<GameEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: GameEntity[]): Promise<GameEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<GameEntity>, partialEntity: QueryDeepPartialEntity<GameEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<GameEntity>): Promise<GameEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<GameEntity>): Promise<GameEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<GameEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<GameEntity>, options?: FindOneOptions<GameEntity>): Promise<GameEntity> {
        const result: GameEntity = await this.repository.findOne(params, options);
        return result;
    }
    
    public async findByIds(ids: string[]) {
        const entities: GameEntity[] = await this.repository.findByIds(ids);
        return entities;
    }

}
