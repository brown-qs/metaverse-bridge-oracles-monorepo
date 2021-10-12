import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { FindConditions, Repository } from 'typeorm';
import { TextureEntity } from './texture.entity';
import { AssetType } from '../common/enums/AssetType';

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

    public async findByCompositeIndex(compositeIndex: {assetId: string, assetAddress: string, assetType: AssetType}): Promise<TextureEntity> {
        const result: TextureEntity = await this.repository.findOne(compositeIndex);
        return result;
    }

    public async findOne(params: TextureEntity): Promise<TextureEntity> {
        const result: TextureEntity = await this.repository.findOne(params);
        return result;
    }
}
