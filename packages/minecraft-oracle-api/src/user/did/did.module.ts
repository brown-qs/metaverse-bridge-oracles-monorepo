import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DidEntity } from './did.entity';
import { DidService } from './did.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([DidEntity]))
    ],
    providers: [DidService],
    exports: [DidService]
})
export class DidModule { }
