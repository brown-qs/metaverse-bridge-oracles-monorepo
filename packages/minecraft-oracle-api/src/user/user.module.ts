import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([UserEntity])),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
                const expiration = configService.get<number>('jwt.expiration')
                const secret = configService.get<string>('jwt.secret')
                return {
                    secret: secret,
                    signOptions: { expiresIn: expiration }
                }
            },
            inject: [ConfigService]
        })
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}
