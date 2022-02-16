import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GganbuEntity } from './gganbu.entity';
import { GganbuService } from './gganbu.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([GganbuEntity]))
    ],
    providers: [GganbuService],
    exports: [GganbuService],
    controllers: []
})
export class GganbuModule {}
