import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PlayerGameItemEntity } from './playergameitem.entity';

@Injectable()
export class PlayerGameItemService {
    constructor(
        @InjectRepository(PlayerGameItemEntity)
        private readonly repository: Repository<PlayerGameItemEntity>,
        private configService: ConfigService
    ) {}

    public static calculateId(dto: {playerId: string, itemId: string}) {
        return `${dto.playerId}-${dto.itemId}`
    }

    public async create(snapshotItem: PlayerGameItemEntity): Promise<PlayerGameItemEntity> {
        const u = await this.repository.save(snapshotItem);
        return u;
    }

    public async createAll(snapshotItems: PlayerGameItemEntity[]): Promise<PlayerGameItemEntity[]> {
        const u = await this.repository.save(snapshotItems);
        return u;
    }

    public async remove(snapshotItem: PlayerGameItemEntity): Promise<PlayerGameItemEntity> {
        const u = await this.repository.remove(snapshotItem);
        return u;
    }

    public async removeAll(snapshotItems: PlayerGameItemEntity[], removeOptions?: RemoveOptions): Promise<PlayerGameItemEntity[]> {
        const u = await this.repository.remove(snapshotItems, removeOptions);
        return u;
    }

    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<PlayerGameItemEntity>, partialEntity: QueryDeepPartialEntity<PlayerGameItemEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async exists(conditions: FindConditions<PlayerGameItemEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findById(id: string): Promise<PlayerGameItemEntity> {
        const result: PlayerGameItemEntity = await this.repository.findOne({ id });
        return result;
    }

    public async findMany(params: FindManyOptions<PlayerGameItemEntity>): Promise<PlayerGameItemEntity[]> {
        const results: PlayerGameItemEntity[] = await this.repository.find(params);
        return results;
    }

    public async find(params: FindConditions<PlayerGameItemEntity>): Promise<PlayerGameItemEntity[]> {
        const results: PlayerGameItemEntity[] = await this.repository.find(params);
        return results;
    }
    
    public async findOne(params: FindConditions<PlayerGameItemEntity>, options?: FindOneOptions<PlayerGameItemEntity>): Promise<PlayerGameItemEntity> {
        const result: PlayerGameItemEntity = await this.repository.findOne(params, options);
        return result;
    }

    public async countByGameItem(gameId: string, itemId: string) {
        return (await this.repository.count({where: {game: {id: gameId}, itemId: itemId}}));
    }
}
