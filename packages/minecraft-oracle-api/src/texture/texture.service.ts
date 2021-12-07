import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TextureEntity } from './texture.entity';
import { AssetType, StringAssetType } from '../common/enums/AssetType';

@Injectable()
export class TextureService {
    constructor(
        @InjectRepository(TextureEntity)
        private readonly repository: Repository<TextureEntity>
    ) {}

    public async create(texture: TextureEntity): Promise<TextureEntity> {
        const u = await this.repository.save(texture);
        return u;
    }

    public async createMultiple(textures: TextureEntity[]): Promise<TextureEntity[]> {
        const u = await this.repository.save(textures);
        return u;
    }

    public async remove(texture: TextureEntity): Promise<TextureEntity> {
        const u = await this.repository.remove(texture);
        return u;
    }

    public async removeMultiple(textures: TextureEntity[]): Promise<TextureEntity[]> {
        const u = await this.repository.remove(textures);
        return u;
    }

    public async update(texture: TextureEntity): Promise<TextureEntity> {
        const u = await this.repository.save(texture)
        return u
    }

    public async exists(conditions: FindConditions<TextureEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findOne(conditions?: FindConditions<TextureEntity>, options?: FindOneOptions<TextureEntity>): Promise<TextureEntity> {
        const result: TextureEntity = await this.repository.findOne(conditions, options);
        return result;
    }

    public async findMany( options?: FindManyOptions<TextureEntity>): Promise<TextureEntity[]> {
        const results: TextureEntity[] = await this.repository.find(options);
        return results;
    }
}
