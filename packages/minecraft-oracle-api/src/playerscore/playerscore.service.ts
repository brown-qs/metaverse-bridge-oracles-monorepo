import { Injectable } from '@nestjs/common';
import { PlayerScoreEntity } from './playerscore.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PlayerScoreService {
    constructor(
        @InjectRepository(PlayerScoreEntity)
        private readonly repository: Repository<PlayerScoreEntity>
    ) {}

    public calculateId(dto: {uuid: string, gameId: string}): string {
        return `${dto.uuid}-${dto.gameId}`
    }

    public async create(entity: PlayerScoreEntity): Promise<PlayerScoreEntity> {
        const u = await this.repository.save(entity);
        return u;
    }

    public async createMultiple(entitys: PlayerScoreEntity[]): Promise<PlayerScoreEntity[]> {
        const u = await this.repository.save(entitys);
        return u;
    }

    public async remove(entity: PlayerScoreEntity): Promise<PlayerScoreEntity> {
        const u = await this.repository.remove(entity);
        return u;
    }

    public async removeMultiple(entitys: PlayerScoreEntity[]): Promise<PlayerScoreEntity[]> {
        const u = await this.repository.remove(entitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<PlayerScoreEntity>, partialEntity: QueryDeepPartialEntity<PlayerScoreEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async find(conditions: FindConditions<PlayerScoreEntity>): Promise<PlayerScoreEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<PlayerScoreEntity>): Promise<PlayerScoreEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<PlayerScoreEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<PlayerScoreEntity>, options?: FindOneOptions<PlayerScoreEntity>): Promise<PlayerScoreEntity> {
        const result: PlayerScoreEntity = await this.repository.findOne(params, options);
        return result;
    }

    public async countByGame(gameId: string): Promise<number> {
        return (await this.repository.count({where: {game: {id: gameId}}}));
    }
}
