import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { EmailUserEntity } from './email-user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class EmailUserService {
    constructor(
        @InjectRepository(EmailUserEntity)
        private readonly repository: Repository<EmailUserEntity>,
        private configService: ConfigService
    ) { }

    public async createLogin(email: string, loginKey: string, keyGenerationDate: Date): Promise<void> {
        const user = this.repository.create({ email, loginKey, keyGenerationDate })
        await this.repository.upsert(user, ["email"]);
    }

    public async spendLoginKey(loginKey: string): Promise<void> {
        await this.repository.update({ loginKey }, { loginKey: null, keyGenerationDate: null, lastLogin: new Date() })
    }

    public async setMinecraftUuidById(id: string, minecraftUuid: string): Promise<void> {
        //remove minecraft account from users who have used it before
        await this.repository.createQueryBuilder().update(EmailUserEntity).set({ minecraftUuid: null }).where("minecraftUuid = :id", { id: minecraftUuid }).execute()
        await this.repository.update({ id }, { minecraftUuid })
    }

    public async unsetMinecraftUuidById(id: string): Promise<void> {
        await this.repository.update({ id }, { minecraftUuid: null })
    }


    public async remove(user: EmailUserEntity): Promise<EmailUserEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

    public async findByEmail(email: string): Promise<EmailUserEntity> {
        const result = await this.repository.findOne({ email });
        return result;
    }

    public async findByLoginKey(loginKey: string): Promise<EmailUserEntity> {
        const result = await this.repository.findOne({ loginKey });
        return result;
    }

    public async findById(id: string): Promise<EmailUserEntity> {
        const result = await this.repository.findOne({ id });
        return result;
    }

    public async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<EmailUserEntity>, partialEntity: QueryDeepPartialEntity<EmailUserEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }
}
