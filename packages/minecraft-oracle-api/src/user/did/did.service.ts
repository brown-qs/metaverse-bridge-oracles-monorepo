import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DidEntity } from './did.entity';

@Injectable()
export class DidService {
    constructor(
        @InjectRepository(DidEntity)
        private readonly repository: Repository<DidEntity>,
    ) { }
    public async create(did: string): Promise<DidEntity> {

        const result = await this.repository.createQueryBuilder('did')
            .insert()
            .values({ did })
            .orUpdate(["did"], ["did"])
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }
}
