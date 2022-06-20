import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { EmailLoginKeyEntity } from './email-login-key.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class EmailLoginKeyService {
    constructor(
        @InjectRepository(EmailLoginKeyEntity)
        private readonly repository: Repository<EmailLoginKeyEntity>,
        private configService: ConfigService
    ) { }

    public async createLogin(email: string, loginKey: string, keyGenerationDate: Date): Promise<void> {
        const user = this.repository.create({ email, loginKey, keyGenerationDate })
        await this.repository.upsert(user, ["email"]);
    }

    public async spendLoginKey(loginKey: string): Promise<void> {
        await this.repository.update({ loginKey }, { loginKey: null, keyGenerationDate: null, lastLogin: new Date() })
    }

    public async findByEmail(email: string): Promise<EmailLoginKeyEntity> {
        const result = await this.repository.findOne({ email });
        return result;
    }

    public async findByLoginKey(loginKey: string): Promise<EmailLoginKeyEntity> {
        const result = await this.repository.findOne({ loginKey });
        return result;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<EmailLoginKeyEntity>, partialEntity: QueryDeepPartialEntity<EmailLoginKeyEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }
}
