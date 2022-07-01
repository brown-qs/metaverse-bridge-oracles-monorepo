import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinecraftLinkEvent } from 'src/common/enums/MinecraftLinkEvent';
import { Repository } from 'typeorm';
import { MinecraftLinkEntity } from './minecraft-link.entity';

@Injectable()
export class MinecraftLinkService {
    constructor(@InjectRepository(MinecraftLinkEntity)
    private readonly repository: Repository<MinecraftLinkEntity>,
    ) { }

    public async link(userUuid: string, minecraftUuid: string): Promise<void> {
        const event = this.repository.create({ userUuid, minecraftUuid, event: MinecraftLinkEvent.LINK })
        await this.repository.insert(event);
    }

    public async unlink(userUuid: string, minecraftUuid: string): Promise<void> {
        const event = this.repository.create({ userUuid, minecraftUuid, event: MinecraftLinkEvent.UNLINK })
        await this.repository.insert(event);
    }
}
