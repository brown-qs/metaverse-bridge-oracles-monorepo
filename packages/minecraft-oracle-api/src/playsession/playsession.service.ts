import { Injectable } from '@nestjs/common';
import { PlaySessionEntity } from './playsession.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, IsNull, Not } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PlaySesionService {
    constructor(
        @InjectRepository(PlaySessionEntity)
        private readonly repository: Repository<PlaySessionEntity>
    ) {}

    public async create(gameSessionEntity: PlaySessionEntity): Promise<PlaySessionEntity> {
        const u = await this.repository.save(gameSessionEntity);
        return u;
    }

    public async createMultiple(gameSessionEntitys: PlaySessionEntity[]): Promise<PlaySessionEntity[]> {
        const u = await this.repository.save(gameSessionEntitys);
        return u;
    }

    public async remove(gameSessionEntity: PlaySessionEntity): Promise<PlaySessionEntity> {
        const u = await this.repository.remove(gameSessionEntity);
        return u;
    }

    public async removeMultiple(gameSessionEntitys: PlaySessionEntity[]): Promise<PlaySessionEntity[]> {
        const u = await this.repository.remove(gameSessionEntitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<PlaySessionEntity>, partialEntity: QueryDeepPartialEntity<PlaySessionEntity>): Promise<boolean> {
        const u = await this.repository.update(criteria, partialEntity)
        return (u.affected ?? 1) > 0
    }

    public async find(conditions: FindConditions<PlaySessionEntity>): Promise<PlaySessionEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<PlaySessionEntity>): Promise<PlaySessionEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<PlaySessionEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async getOngoing({uuid}: {uuid: string}): Promise<PlaySessionEntity | undefined> {
        const result: PlaySessionEntity = await this.repository.findOne({ where: {endedAt: IsNull(), player: {uuid}}, relations: ['player', 'stat'] });
        return result;
    }

    public async getLast({uuid}: {uuid: string}): Promise<PlaySessionEntity | undefined> {
        const result: PlaySessionEntity = await this.repository.findOne({ where: {endedAt: Not(IsNull()), player: {uuid}}, order: {endedAt: 'DESC'}, relations: ['player'] });
        return result;
    }

    public async findOne(params: FindConditions<PlaySessionEntity>, options?: FindOneOptions<PlaySessionEntity>): Promise<PlaySessionEntity> {
        const result: PlaySessionEntity = await this.repository.findOne(params, options);
        return result;
    }
}
