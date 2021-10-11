import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'nestjs-redis';
import { SESSION_CACHE_FIELD_USER } from 'src/config/constants';
import IORedis from 'ioredis';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

@Injectable()
export class CacheService {

    private readonly context: string;
    protected redisSession: IORedis.Redis;
    private readonly expirationTime: number;

    constructor(
        readonly redisService: RedisService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = CacheService.name;
        this.expirationTime = this.configService.get<number>('redis.expiration');
        const rname = this.configService.get<string>('redis.name')
        this.redisSession = this.redisService.getClient(
            rname
        );
        logger.log(`CacheService:: Redis connected with name ${rname} and default expiration time ${this.expirationTime}`, this.context)
    }

    public async createSession(sessionKey: string, uuid: string): Promise<boolean> {
        try {
            await this.redisSession.hset(sessionKey, SESSION_CACHE_FIELD_USER, uuid);
            await this.redisSession.expire(sessionKey, this.expirationTime);
            this.logger.debug(`createSession:: success`, this.context);
            return true;
        } catch (error) {
            this.logger.error(`createSession:: fail`, error, this.context);
            return false;
        }
    }

    public async getSession(sessionKey: string): Promise<string | undefined> {
        try {
            const uuid = await this.redisSession.hget(sessionKey, SESSION_CACHE_FIELD_USER);
            await this.redisSession.expire(sessionKey, this.expirationTime);
            this.logger.debug(`getSession:: success for user ${uuid}`, this.context);
            return uuid;
        } catch (error) {
            this.logger.error(`getSession:: fail`, error, this.context);
            return undefined;
        }
    }

    public async deleteSession(sessionKey: string): Promise<boolean> {
        try {
            const n = await this.redisSession.del(sessionKey);
            this.logger.debug(`deleteSession:: success(${n})`, this.context);
            return true;
        } catch (error) {
            this.logger.error(`deleteSession:: error`, error, this.context);
            return false;
        }
    }
}
