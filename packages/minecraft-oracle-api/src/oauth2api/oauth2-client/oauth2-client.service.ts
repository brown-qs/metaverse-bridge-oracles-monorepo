import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Oauth2Scope } from '../../common/enums/Oauth2Scope';
import { UserEntity } from '../../user/user/user.entity';
import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Oauth2ClientDto } from './dtos/oauth2client.dto';
import { Oauth2ClientEntity } from './oauth2-client.entity';

@Injectable()
export class Oauth2ClientService {
    context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @InjectRepository(Oauth2ClientEntity) private readonly repository: Repository<Oauth2ClientEntity>,
    ) {
        this.context = Oauth2ClientService.name
    }

    async create(appName: string, redirectUri: string, scopes: Oauth2Scope[], owner: UserEntity) {
        const en = this.repository.create({ clientId: createToken(), clientSecret: createToken(), appName, redirectUri, scopes, owner, createdAt: new Date(), updatedAt: new Date() })
        return await this.repository.save(en)
    }

    public async remove(material: Oauth2ClientEntity): Promise<Oauth2ClientEntity> {
        const u = await this.repository.remove(material);
        return u;
    }


    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<Oauth2ClientEntity>, partialEntity: QueryDeepPartialEntity<Oauth2ClientEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }


    public async findOne(conditions?: FindConditions<Oauth2ClientEntity>, options?: FindOneOptions<Oauth2ClientEntity>): Promise<Oauth2ClientEntity> {
        const result: Oauth2ClientEntity = await this.repository.findOne(conditions, options);
        return result;
    }

    public async findMany(conditions: FindManyOptions<Oauth2ClientEntity>): Promise<Oauth2ClientEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

    public clientEntityToDto(client: Oauth2ClientEntity): Oauth2ClientDto {
        const result = { clientId: client.clientId, clientSecret: client.clientSecret, appName: client.appName, redirectUri: client.redirectUri, accessTokenValidity: client.accessTokenValidity, refreshTokenValidity: client.refreshTokenValidity, scopes: [...client.scopes], approved: client.approved }
        return result
    }
}

const separator = ""
export function createToken() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return s4() + s4() + separator + s4() + separator + s4() + separator + s4() + separator + s4() + s4() + s4(); }

