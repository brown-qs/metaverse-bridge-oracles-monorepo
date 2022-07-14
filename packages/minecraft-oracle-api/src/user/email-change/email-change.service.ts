import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailEntity } from '../email/email.entity';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { EmailChangeEntity } from './email-change.entity';

@Injectable()
export class EmailChangeService {
    constructor(@InjectRepository(EmailChangeEntity)
    private readonly repository: Repository<EmailChangeEntity>,
        private readonly userService: UserService,

    ) { }

    public async create(user: UserEntity, initiator: UserEntity, oldEmail: EmailEntity, newEmail: EmailEntity): Promise<void> {
        const emailChange = this.repository.create({ user, initiator, oldEmail, newEmail, createdAt: new Date() })
        await this.repository.insert(emailChange);
    }
}
