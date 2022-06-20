import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { KiltDidEmailEntity } from './kilt-did-email.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class KiltDidEmailService {
    constructor(
        @InjectRepository(KiltDidEmailEntity)
        private readonly repository: Repository<KiltDidEmailEntity>,
        private configService: ConfigService
    ) { }

    public async create(email: string, did: string): Promise<void> {
        const em = email.toLowerCase().trim()
        const user = this.repository.create({ email: em, did })
        await this.repository.upsert(user, ["email", "did"]);
    }

    public async findByEmail(email: string): Promise<KiltDidEmailEntity> {
        const result = await this.repository.findOne({ email: email.toLowerCase().trim() });
        return result;
    }


}
