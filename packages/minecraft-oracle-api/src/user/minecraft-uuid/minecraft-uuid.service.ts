import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinecraftUuidEntity } from './minecraft-uuid.entity';

@Injectable()
export class MinecraftUuidService {
    constructor(
        @InjectRepository(MinecraftUuidEntity)
        private readonly repository: Repository<MinecraftUuidEntity>,
    ) { }
    public async create(minecraftUuid: string): Promise<MinecraftUuidEntity> {

        const result = await this.repository.createQueryBuilder('minecraft_uuid')
            .insert()
            .values({ minecraftUuid })
            .orUpdate(["minecraftUuid"], ["minecraftUuid"])
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }
}
