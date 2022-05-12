import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Asset, ProcessedStaticTokenData, StaticTokenData, TokenMeta } from './exoconfig.types';
import { ProviderToken } from '../provider/token';
import { Interface } from 'ethers/lib/utils';
import { Contract } from '@ethersproject/contracts';
import { fromStream } from 'file-type/core';
import fetch from 'node-fetch'
import { collections } from '../common/collections';
import { TypeContractsCallbackProvider } from '../provider/contract';
import { ContractType } from 'src/common/enums/ContractType';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigEntity } from './config.entity';
import { ConfigDto } from './dtos/config.dto'
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';


@Injectable()
export class MoonsamaApiService {

    private readonly context: string;
    private readonly defaultChainId: number;

    constructor(
        @InjectRepository(ConfigEntity)
        private readonly repository: Repository<ConfigEntity>
    ) {
    }

    public async addConfig(config: ConfigDto): Promise<ConfigDto> {
        const u = await this.repository.save({
            name: config.name,
            description: config.description,
            image: config.image,
            artist: config.artist,
            artist_url: config.artist_url,
            external_link: config.external_link,
        });
        return u;
    }

    public async findOne(params: FindConditions<ConfigEntity>): Promise<ConfigEntity> {
        const u: ConfigEntity = await this.repository.findOne(params);
        return u;
    }

    public async find(conditions: FindConditions<ConfigEntity>): Promise<ConfigEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public async updateConfig(config: ConfigEntity, dto: ConfigDto): Promise<boolean> {

        await this.repository.update(config.id, dto)

        return true
    }
}
