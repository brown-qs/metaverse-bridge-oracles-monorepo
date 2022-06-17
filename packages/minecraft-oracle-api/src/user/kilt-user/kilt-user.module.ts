import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KiltUserService } from './kilt-user.service';
import { KiltUserEntity } from './kilt-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([KiltUserEntity]))
    ],
    providers: [KiltUserService],
    exports: [KiltUserService],
    controllers: []
})
export class KiltUserModule { }
