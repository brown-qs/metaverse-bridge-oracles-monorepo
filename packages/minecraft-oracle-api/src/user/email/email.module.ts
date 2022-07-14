import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailEntity } from './email.entity';
import { EmailService } from './email.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([EmailEntity]))
    ],
    providers: [EmailService],
    exports: [EmailService]

})
export class EmailModule { }
