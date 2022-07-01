import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailChangeEntity } from './email-change.entity';

@Injectable()
export class EmailChangeService {
    constructor(@InjectRepository(EmailChangeEntity)
    private readonly repository: Repository<EmailChangeEntity>,
    ) { }

    public async create(userUuid: string, oldEmail: string, newEmail: string): Promise<void> {
        const oldEm = oldEmail.toLowerCase().trim()
        const newEm = newEmail.toLowerCase().trim()
        const emailChange = this.repository.create({ userUuid, oldEmail: oldEm, newEmail: newEm })
        await this.repository.insert(emailChange);
    }
}
