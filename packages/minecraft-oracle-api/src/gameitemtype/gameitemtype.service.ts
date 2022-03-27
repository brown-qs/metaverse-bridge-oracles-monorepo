import { Injectable } from '@nestjs/common';
import { GameItemTypeEntity } from './gameitemtype.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class GameItemTypeService {
    constructor(
        @InjectRepository(GameItemTypeEntity)
        private readonly repository: Repository<GameItemTypeEntity>
    ) {}

    public async create(entity: GameItemTypeEntity): Promise<GameItemTypeEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: GameItemTypeEntity[]): Promise<GameItemTypeEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: GameItemTypeEntity): Promise<GameItemTypeEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: GameItemTypeEntity[]): Promise<GameItemTypeEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<GameItemTypeEntity>, partialEntity: QueryDeepPartialEntity<GameItemTypeEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<GameItemTypeEntity>): Promise<GameItemTypeEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<GameItemTypeEntity>): Promise<GameItemTypeEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<GameItemTypeEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<GameItemTypeEntity>, options?: FindOneOptions<GameItemTypeEntity>): Promise<GameItemTypeEntity> {
        const result: GameItemTypeEntity = await this.repository.findOne(params, options);
        return result;
    }
}
