import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinecraftUuidUserNameEntity } from './minecraft-uuid-user-name.entity';

@Injectable()
export class MinecraftUuidUserNameService {
    constructor(@InjectRepository(MinecraftUuidUserNameEntity)
    private readonly repository: Repository<MinecraftUuidUserNameEntity>,
    ) { }

    public async create(minecraftUuid: string, minecraftUserName: string): Promise<void> {
        const entity = this.repository.create({ minecraftUuid: minecraftUuid, minecraftUserName: minecraftUserName, updatedAt: new Date() })
        await this.repository.upsert(entity, ["minecraftUuid"]);
    }
}
