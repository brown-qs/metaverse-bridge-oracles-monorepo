import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindConditions, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private configService: ConfigService
    ) {}

    public async create(user: UserEntity): Promise<UserEntity> {
        const u = await this.repository.save(user);
        return u;
    }

    public async remove(user: UserEntity): Promise<UserEntity> {
        const u = await this.repository.remove(user);
        return u;
    }

    public async update(user: UserEntity): Promise<UserEntity> {
        const u = await this.repository.save(user)
        return u
    }

    public async exists(conditions: FindConditions<UserEntity>): Promise<boolean> {
        return (await this.repository.findOne(conditions)) !== undefined;
    }

    public async findByUserName(userName: string): Promise<UserEntity> {
        const result: UserEntity = await this.repository.findOne({ userName });
        return result;
    }

    public async findByUuid(uuid: string): Promise<UserEntity> {
        const result: UserEntity = (await this.repository.findOne({ uuid }));
        return result;
    }

    public async findOne(params: UserEntity): Promise<UserEntity> {
        const result: UserEntity = await this.repository.findOne(params);
        return result;
    }
}
