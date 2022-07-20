import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        CqrsModule,
        forwardRef(() => TypeOrmModule.forFeature([UserEntity]))
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: []
})
export class UserModule { }
