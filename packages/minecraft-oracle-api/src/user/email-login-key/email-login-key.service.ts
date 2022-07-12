import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { EmailLoginKeyEntity } from './email-login-key.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class EmailLoginKeyService {
    constructor(
        @InjectRepository(EmailLoginKeyEntity)
        private readonly repository: Repository<EmailLoginKeyEntity>,
        private configService: ConfigService
    ) { }

    public async createLogin(email: string, loginKey: string, keyGenerationDate: Date): Promise<EmailLoginKeyEntity> {
        //if user is trying to change uuid with this email but hasn't used the link, will invalidate and new link if used will create new account

        const result = await this.repository.createQueryBuilder('email_log_key')
            .insert()
            .values({ email, loginKey, keyGenerationDate, changeUser: null, createdAt: new Date() })
            .orUpdate(["loginKey", "changeUserUuid", "keyGenerationDate"], ["email"])
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }

    public async createChangeEmailLogin(changeUser: UserEntity, email: string, loginKey: string, keyGenerationDate: Date): Promise<EmailLoginKeyEntity> {

        const result = await this.repository.createQueryBuilder('email_log_key')
            .insert()
            .values({ email, loginKey, keyGenerationDate, changeUser, createdAt: new Date() })
            .orUpdate(["loginKey", "changeUserUuid", "keyGenerationDate"], ["email"])
            .returning('*')
            .execute()
        const row = this.repository.create(result.generatedMaps[0])
        return row
    }

    public async spendLoginKey(loginKey: string): Promise<void> {
        await this.repository.update({ loginKey }, { loginKey: null, keyGenerationDate: null, lastLogin: new Date(), changeUser: null })
    }

    public async findByEmail(email: string): Promise<EmailLoginKeyEntity> {
        const result = await this.repository.findOne({ email });
        return result;
    }

    public async findByLoginKey(loginKey: string): Promise<EmailLoginKeyEntity> {
        const result = await this.repository.findOne({ loginKey }, { relations: ["changeUser"] });
        return result;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<EmailLoginKeyEntity>, partialEntity: QueryDeepPartialEntity<EmailLoginKeyEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }
}
