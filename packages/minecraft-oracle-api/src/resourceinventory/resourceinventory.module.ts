import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceInventoryEntity } from './resourceinventory.entity';
import { ResourceInventoryService } from './resourceinventory.service';
@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([ResourceInventoryEntity])),
    ],
    providers: [ResourceInventoryService],
    exports: [ResourceInventoryService],
    controllers: []
})
export class ResourceInventoryModule {}
