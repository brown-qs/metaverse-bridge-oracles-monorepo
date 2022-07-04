import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinecraftLinkEvent } from 'src/common/enums/MinecraftLinkEvent';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { MinecraftLinkEntity } from './minecraft-link.entity';

@Injectable()
export class MinecraftLinkService {
    constructor(@InjectRepository(MinecraftLinkEntity)
    private readonly repository: Repository<MinecraftLinkEntity>,
        private readonly userService: UserService,

    ) { }

    public async link(userUuid: string, initiatorUuid: string, minecraftUuid: string): Promise<void> {
        const user = await this.userService.findByUuid(userUuid)
        const initiator = await this.userService.findByUuid(initiatorUuid)
        const event = this.repository.create({ user, initiator, minecraftUuid, event: MinecraftLinkEvent.LINK })
        await this.repository.insert(event);
    }

    public async unlink(userUuid: string, initiatorUuid: string, minecraftUuid: string): Promise<void> {
        const user = await this.userService.findByUuid(userUuid)
        const initiator = await this.userService.findByUuid(initiatorUuid)

        const event = this.repository.create({ user, initiator, minecraftUuid, event: MinecraftLinkEvent.UNLINK })
        await this.repository.insert(event);
    }
}
