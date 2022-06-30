import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { KiltSessionEntity } from './kilt-session.entity';

@Injectable()
export class KiltSessionService {
    constructor(
        @InjectRepository(KiltSessionEntity)
        private readonly repository: Repository<KiltSessionEntity>,
        private configService: ConfigService
    ) { }

    public async create(sessionId: string, walletSessionChallenge: string, dappName: string, dAppEncryptionKeyUri: string): Promise<KiltSessionEntity> {
        const sess = await this.repository.save({ sessionId, walletSessionChallenge, dappName, dAppEncryptionKeyUri });
        return sess;
    }

    public async findBySessionId(sessionId: string): Promise<KiltSessionEntity> {
        const sess: KiltSessionEntity = (await this.repository.findOne({ sessionId }));
        return sess;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<KiltSessionEntity>, partialEntity: QueryDeepPartialEntity<KiltSessionEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }

    public async remove(user: KiltSessionEntity): Promise<KiltSessionEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

}
