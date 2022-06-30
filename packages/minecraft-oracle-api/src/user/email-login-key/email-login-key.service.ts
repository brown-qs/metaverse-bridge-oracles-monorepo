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
        //if user is trying to change uuid with this email but hasn't used the link, will invalidate and new link if used will create new account
        const user = this.repository.create({ email, loginKey, keyGenerationDate, changeUuid: null })
        await this.repository.upsert(user, ["email"]);
    }

    public async createChangeEmailLogin(userUuid: string, email: string, loginKey: string, keyGenerationDate: Date): Promise<void> {
        //invalidate all previous change links from this uuid
        await this.repository.update({ changeUuid: userUuid }, { loginKey: null, keyGenerationDate: null })
        const user = this.repository.create({ email, loginKey, keyGenerationDate, changeUuid: userUuid })
        await this.repository.upsert(user, ["email"]);
    }

    public async spendLoginKey(loginKey: string): Promise<void> {
        await this.repository.update({ loginKey }, { loginKey: null, keyGenerationDate: null, lastLogin: new Date(), changeUuid: null })
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
