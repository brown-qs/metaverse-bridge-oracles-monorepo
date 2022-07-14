import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinecraftUserNameEntity } from './minecraft-user-name.entity';

@Injectable()
export class MinecraftUserNameService {
    constructor(
        @InjectRepository(MinecraftUserNameEntity)
        private readonly repository: Repository<MinecraftUserNameEntity>,
    ) { }
    public async create(minecraftUserName: string): Promise<MinecraftUserNameEntity> {
        const result = await this.repository.createQueryBuilder('minecraft_user_name')
            .insert()
            .values({ minecraftUserName })
            .orUpdate(["minecraftUserName"], ["minecraftUserName"])
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }
}
