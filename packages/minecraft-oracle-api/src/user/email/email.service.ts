import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailEntity } from './email.entity';

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(EmailEntity)
        private readonly repository: Repository<EmailEntity>,
    ) { }
    public async create(email: string): Promise<EmailEntity> {
        const em = email.toLowerCase().trim()
        const result = await this.repository.createQueryBuilder('email')
            .insert()
            .values({ email: em })
            .orUpdate(["email"], ["email"])
            .returning('*')
            .execute()

        const row = this.repository.create(result.generatedMaps[0])
        return row
    }
}
