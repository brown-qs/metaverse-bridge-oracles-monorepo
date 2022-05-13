import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { ProviderToken } from '../provider/token';
import { Interface } from 'ethers/lib/utils';
import { Contract } from '@ethersproject/contracts';
import { fromStream } from 'file-type/core';
import fetch from 'node-fetch'
import { collections } from '../common/collections';
import { TypeContractsCallbackProvider } from '../provider/contract';
import { ContractType } from 'src/common/enums/ContractType';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from './attribute.entity';
import { AttributeDto } from './dtos/attribute.dto'
import { Repository, FindConditions, FindManyOptions, FindOneOptions, ObjectID, UpdateResult } from 'typeorm';


@Injectable()
export class AttributeService {

    private readonly context: string;
    private readonly defaultChainId: number;

    constructor(
        @InjectRepository(AttributeEntity)
        private readonly repository: Repository<AttributeEntity>
    ) {
    }

    public async addAttributes(attributes: AttributeDto[]): Promise<AttributeEntity[]> {
        const entities = attributes.map(attr => {
            return {
                trait_type: attr.trait_type,
                value: attr.value
            }
        })
        return await this.repository.save(entities);
    }
}
