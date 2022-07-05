import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinecraftLinkEvent } from 'src/common/enums/MinecraftLinkEvent';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { MinecraftLinkEntity } from './minecraft-link.entity';

@Injectable()
export class MinecraftLinkService {
    constructor(@InjectRepository(MinecraftLinkEntity)
    private readonly repository: Repository<MinecraftLinkEntity>,
        private readonly userService: UserService,

    ) { }

    public async link(user: UserEntity, initiator: UserEntity, minecraftUuid: string): Promise<void> {
        const event = this.repository.create({ user, initiator, minecraftUuid, event: MinecraftLinkEvent.LINK })
        await this.repository.insert(event);
    }

    public async unlink(user: UserEntity, initiator: UserEntity, minecraftUuid: string): Promise<void> {
        const event = this.repository.create({ user, initiator, minecraftUuid, event: MinecraftLinkEvent.UNLINK })
        await this.repository.insert(event);
    }
}
