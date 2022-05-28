import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceInventoryOffsetEntity } from './resourceinventoryoffset.entity';
import { ResourceInventoryOffsetService } from './resourceinventoryoffset.service';
@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([ResourceInventoryOffsetEntity])),
    ],
    providers: [ResourceInventoryOffsetService],
    exports: [ResourceInventoryOffsetService],
    controllers: []
})
export class ResourceInventoryOffsetModule {}
