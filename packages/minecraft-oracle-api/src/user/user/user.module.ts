import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([UserEntity]))
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: []
})
export class UserModule { }
