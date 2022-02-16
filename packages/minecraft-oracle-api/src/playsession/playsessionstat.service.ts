import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, IsNull, Not,  } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PlaySessionStatEntity } from './playsessionstat.entity';

@Injectable()
export class PlaySessionStatService {
    constructor(
        @InjectRepository(PlaySessionStatEntity)
        private readonly repository: Repository<PlaySessionStatEntity>
    ) {}

    public static calculateId(data: {uuid: string, gameId: string}): string {
        return `${data.uuid}-${data.gameId}`
    }
    
    public async create(playSessionStatEntity: PlaySessionStatEntity): Promise<PlaySessionStatEntity> {
        const u = await this.repository.save(playSessionStatEntity);
        return u;
    }

    public async createMultiple(playSessionStatEntitys: PlaySessionStatEntity[]): Promise<PlaySessionStatEntity[]> {
        const u = await this.repository.save(playSessionStatEntitys);
        return u;
    }

    public async remove(playSessionStatEntity: PlaySessionStatEntity): Promise<PlaySessionStatEntity> {
        const u = await this.repository.remove(playSessionStatEntity);
        return u;
    }

    public async removeMultiple(playSessionStatEntitys: PlaySessionStatEntity[]): Promise<PlaySessionStatEntity[]> {
        const u = await this.repository.remove(playSessionStatEntitys);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<PlaySessionStatEntity>, partialEntity: QueryDeepPartialEntity<PlaySessionStatEntity>): Promise<boolean> {
        const u = await this.repository.update(criteria, partialEntity)
        return (u.affected ?? 1) > 0
    }

    public async find(conditions: FindConditions<PlaySessionStatEntity>): Promise<PlaySessionStatEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async findMany(conditions: FindManyOptions<PlaySessionStatEntity>): Promise<PlaySessionStatEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async exists(conditions: FindConditions<PlaySessionStatEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(params: FindConditions<PlaySessionStatEntity>, options?: FindOneOptions<PlaySessionStatEntity>): Promise<PlaySessionStatEntity> {
        const result: PlaySessionStatEntity = await this.repository.findOne(params, options);
        return result;
    }
}
