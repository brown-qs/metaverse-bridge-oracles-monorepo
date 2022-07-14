import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLoginKeyService } from './email-login-key.service';
import { EmailLoginKeyEntity } from './email-login-key.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([EmailLoginKeyEntity]))
    ],
    providers: [EmailLoginKeyService],
    exports: [EmailLoginKeyService],
    controllers: [],
})
export class EmailLoginKeyModule { }
