import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinecraftUserService } from './minecraft-user.service';
import { MinecraftUserEntity } from './minecraft-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([MinecraftUserEntity]))
    ],
    providers: [MinecraftUserService],
    exports: [MinecraftUserService],
    controllers: []
})
export class MinecraftUserModule { }
