import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SanitizeModule } from '../../sanitize/sanitize.module';

@Module({
    imports: [
        SanitizeModule,
        CqrsModule,
        forwardRef(() => TypeOrmModule.forFeature([UserEntity]))
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: []
})
export class UserModule { }
