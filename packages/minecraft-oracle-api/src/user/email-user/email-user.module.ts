import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailUserService } from './email-user.service';
import { EmailUserEntity } from './email-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([EmailUserEntity]))
    ],
    providers: [EmailUserService],
    exports: [EmailUserService],
    controllers: [],
})
export class EmailUserModule { }
