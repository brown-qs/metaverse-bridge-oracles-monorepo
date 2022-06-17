import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { MinecraftUserEntity } from './minecraft-user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MinecraftUserService {
    constructor(
        @InjectRepository(MinecraftUserEntity)
        private readonly repository: Repository<MinecraftUserEntity>,
        private configService: ConfigService
    ) { }

    public async create(user: MinecraftUserEntity): Promise<MinecraftUserEntity> {
        const u = await this.repository.save(user);
        return u;
    }

    public async createMany(users: MinecraftUserEntity[]): Promise<MinecraftUserEntity[]> {
        const u = await this.repository.save(users);
        return u;
    }

    public async remove(user: MinecraftUserEntity): Promise<MinecraftUserEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<MinecraftUserEntity>, partialEntity: QueryDeepPartialEntity<MinecraftUserEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<MinecraftUserEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findByUserName(userName: string): Promise<MinecraftUserEntity> {
        const result: MinecraftUserEntity = await this.repository.findOne({ userName });
        return result;
    }

    public async findByUuid(uuid: string): Promise<MinecraftUserEntity> {
        const result: MinecraftUserEntity = (await this.repository.findOne({ uuid }));
        return result;
    }

    public async findOne(params: FindConditions<MinecraftUserEntity>, options?: FindOneOptions<MinecraftUserEntity>): Promise<MinecraftUserEntity> {
        const result: MinecraftUserEntity = await this.repository.findOne(params, options);
        return result;
    }

    public async findMany(options: FindManyOptions<MinecraftUserEntity>): Promise<MinecraftUserEntity[]> {
        const results: MinecraftUserEntity[] = await this.repository.find(options);
        return results;
    }

    public async findByIds(uuids: string[]) {
        const entities: MinecraftUserEntity[] = await this.repository.findByIds(uuids);
        return entities;
    }
}
