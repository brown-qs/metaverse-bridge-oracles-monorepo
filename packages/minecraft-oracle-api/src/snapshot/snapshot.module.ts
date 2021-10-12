import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotItemEntity } from './snapshotItem.entity';
import { SnapshotService } from './snapshot.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SnapshotItemEntity])),
    ],
    providers: [SnapshotService],
    exports: [SnapshotService],
    controllers: []
})
export class SnapshotModule {}
