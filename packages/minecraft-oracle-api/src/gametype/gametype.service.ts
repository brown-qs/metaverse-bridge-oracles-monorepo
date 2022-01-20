import { Injectable } from '@nestjs/common';
import { GameTypeEntity } from './gametype.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class GameTypeService {
    constructor(
        @InjectRepository(GameTypeEntity)
        private readonly repository: Repository<GameTypeEntity>
    ) {}

    public async create(entity: GameTypeEntity): Promise<GameTypeEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: GameTypeEntity[]): Promise<GameTypeEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: GameTypeEntity): Promise<GameTypeEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: GameTypeEntity[]): Promise<GameTypeEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<GameTypeEntity>, partialEntity: QueryDeepPartialEntity<GameTypeEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<GameTypeEntity>): Promise<GameTypeEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<GameTypeEntity>): Promise<GameTypeEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<GameTypeEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<GameTypeEntity>, options?: FindOneOptions<GameTypeEntity>): Promise<GameTypeEntity> {
        const result: GameTypeEntity = await this.repository.findOne(params, options);
        return result;
    }
}
