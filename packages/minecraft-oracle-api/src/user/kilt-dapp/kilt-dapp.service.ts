import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KiltDappEntity } from './kilt-dapp.entity';

@Injectable()
export class KiltDappService {
    constructor(
        @InjectRepository(KiltDappEntity)
        private readonly repository: Repository<KiltDappEntity>,
    ) { }
    public async create(dappName: string): Promise<KiltDappEntity> {

        const result = await this.repository.createQueryBuilder('kilt_dapp')
            .insert()
            .values({ dappName })
            .orUpdate(["dappName"], ["dappName"])
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }
}
