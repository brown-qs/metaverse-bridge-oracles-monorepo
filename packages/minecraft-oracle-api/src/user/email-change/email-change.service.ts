import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { EmailChangeEntity } from './email-change.entity';

@Injectable()
export class EmailChangeService {
    constructor(@InjectRepository(EmailChangeEntity)
    private readonly repository: Repository<EmailChangeEntity>,
        private readonly userService: UserService,

    ) { }

    public async create(user: UserEntity, initiator: UserEntity, oldEmail: string, newEmail: string): Promise<void> {
        const oldEm = oldEmail.toLowerCase().trim()
        const newEm = newEmail.toLowerCase().trim()

        const emailChange = this.repository.create({ user, initiator, oldEmail: oldEm, newEmail: newEm })
        await this.repository.insert(emailChange);
    }
}
