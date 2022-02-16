import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnaplogEntity } from './snaplog.entity';
import { SnaplogService } from './snaplog.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SnaplogEntity])),
    ],
    providers: [SnaplogService],
    exports: [SnaplogService],
    controllers: []
})
export class SnaplogModule {}
