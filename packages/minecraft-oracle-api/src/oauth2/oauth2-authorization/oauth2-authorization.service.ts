import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Repository, ObjectID, FindConditions, UpdateResult, FindOneOptions, FindManyOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Oauth2Scope } from '../../common/enums/Oauth2Scope';
import { UserEntity } from '../../user/user/user.entity';
import { Oauth2ClientDto } from '../oauth2-client/dtos/oauth2client.dto';
import { Oauth2ClientEntity } from '../oauth2-client/oauth2-client.entity';
import { Oauth2AuthorizationEntity } from './oauth2-authorization.entity';


@Injectable()
export class Oauth2AuthorizationService {
    context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @InjectRepository(Oauth2AuthorizationEntity) private readonly repository: Repository<Oauth2AuthorizationEntity>,
    ) {
        this.context = Oauth2AuthorizationService.name
    }

    async create(scopes: Oauth2Scope[], user: UserEntity, client: Oauth2ClientEntity, redirectUri: string, state?: string) {
        const result = await this.repository.createQueryBuilder('authorization')
            .insert()
            .values({ code: createToken(), codeCreatedAt: new Date(), scopes, user, client, accessToken: null, accessTokenCreatedAt: null, refreshToken: null, refreshTokenCreatedAt: null, valid: true, redirectUri, state: (state ?? null) })
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }

    public async updateTokensAuthorizationCode(authorizationEntity: Oauth2AuthorizationEntity, code: string) {
        return await this.update({ id: authorizationEntity.id, code }, { accessToken: createToken(), accessTokenCreatedAt: new Date(), refreshToken: createToken(), refreshTokenCreatedAt: new Date() })
    }

    public async updateTokensRefreshToken(authorizationEntity: Oauth2AuthorizationEntity, refreshToken: string) {
        return await this.update({ id: authorizationEntity.id, refreshToken }, { accessToken: createToken(), accessTokenCreatedAt: new Date(), refreshToken: createToken(), refreshTokenCreatedAt: new Date() })
    }


    public async remove(material: Oauth2AuthorizationEntity): Promise<Oauth2AuthorizationEntity> {
        const u = await this.repository.remove(material);
        return u;
    }


    public async update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<Oauth2AuthorizationEntity>, partialEntity: QueryDeepPartialEntity<Oauth2AuthorizationEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }


    public async findOne(conditions?: FindConditions<Oauth2AuthorizationEntity>, options?: FindOneOptions<Oauth2AuthorizationEntity>): Promise<Oauth2AuthorizationEntity> {
        const result: Oauth2AuthorizationEntity = await this.repository.findOne(conditions, options);
        return result;
    }

    public async findMany(conditions: FindManyOptions<Oauth2AuthorizationEntity>): Promise<Oauth2AuthorizationEntity[]> {
        const u = await this.repository.find(conditions)
        return u
    }

}

const separator = ""
export function createToken() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return s4() + s4() + separator + s4() + separator + s4() + separator + s4() + separator + s4() + s4() + s4(); }

