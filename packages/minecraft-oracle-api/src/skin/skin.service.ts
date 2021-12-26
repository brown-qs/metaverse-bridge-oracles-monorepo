import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository } from 'typeorm';
import { SkinEntity } from './skin.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class SkinService {
    constructor(
        @InjectRepository(SkinEntity)
        private readonly repository: Repository<SkinEntity>
    ) {}

    public async create(texture: SkinEntity): Promise<SkinEntity> {
        const u = await this.repository.save(texture);
        return u;
    }

    public async createMultiple(textures: SkinEntity[]): Promise<SkinEntity[]> {
        const u = await this.repository.save(textures);
        return u;
    }

    public async remove(texture: SkinEntity): Promise<SkinEntity> {
        const u = await this.repository.remove(texture);
        return u;
    }

    public async removeMultiple(textures: SkinEntity[]): Promise<SkinEntity[]> {
        const u = await this.repository.remove(textures);
        return u;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<SkinEntity>, partialEntity: QueryDeepPartialEntity<SkinEntity>): Promise<number> {
        const u = await this.repository.update(criteria, partialEntity)
        return u.affected ?? 0
    }

    public async exists(conditions: FindConditions<SkinEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions?: FindConditions<SkinEntity>, options?: FindOneOptions<SkinEntity>): Promise<SkinEntity> {
        const result: SkinEntity = await this.repository.findOne(conditions, options);
        return result;
    }

    public async findMany( options?: FindManyOptions<SkinEntity>): Promise<SkinEntity[]> {
        const results: SkinEntity[] = await this.repository.find(options);
        return results;
    }
}
