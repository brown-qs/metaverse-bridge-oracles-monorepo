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

    public async create(user: TextureEntity): Promise<TextureEntity> {
        const u = await this.repository.save(user);
        return u;
    }

    public async remove(user: TextureEntity): Promise<TextureEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

    public async update(user: TextureEntity): Promise<TextureEntity> {
        const u = await this.repository.save(user)
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
