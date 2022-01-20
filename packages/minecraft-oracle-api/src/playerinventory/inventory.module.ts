import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { InventoryService } from './inventory.service';
@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([InventoryEntity])),
    ],
    providers: [InventoryService],
    exports: [InventoryService],
    controllers: []
})
export class InventoryModule {}
