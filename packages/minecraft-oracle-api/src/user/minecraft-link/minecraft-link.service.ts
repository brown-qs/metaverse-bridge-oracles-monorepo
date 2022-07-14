import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, ObjectID, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MinecraftUuidEntity } from '../minecraft-uuid/minecraft-uuid.entity';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { MinecraftLinkEntity } from './minecraft-link.entity';

@Injectable()
export class MinecraftLinkService {
    constructor(@InjectRepository(MinecraftLinkEntity)
    private readonly repository: Repository<MinecraftLinkEntity>,
        private readonly userService: UserService,

    ) { }

    /*
    public async link(user: UserEntity, linkInitiator: UserEntity, minecraftUuid: string, minecraftUserName: string, hasGame: boolean): Promise<void> {
        const event = this.repository.create({ user, linkInitiator, minecraftUuid, minecraftUserName, hasGame })
        await this.repository.insert(event);
    }*/

    public async unlink(user: UserEntity, unlinkInitiator: UserEntity, minecraftUuid: MinecraftUuidEntity): Promise<void> {
        await this.update({ user, minecraftUuid, unlinkedAt: null }, { unlinkedAt: new Date(), unlinkInitiator })
    }

    private async update(criteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindConditions<MinecraftLinkEntity>, partialEntity: QueryDeepPartialEntity<MinecraftLinkEntity>): Promise<UpdateResult> {
        const u = await this.repository.update(criteria, partialEntity)
        return u
    }
}
