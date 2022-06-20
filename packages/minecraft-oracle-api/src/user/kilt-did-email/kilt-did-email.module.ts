import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KiltDidEmailEntity } from './kilt-did-email.entity';
import { KiltDidEmailService } from './kilt-did-email.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([KiltDidEmailEntity]))
    ],
    providers: [KiltDidEmailService],
    exports: [KiltDidEmailService],
    controllers: [],
})
export class KiltDidEmailModule { }
