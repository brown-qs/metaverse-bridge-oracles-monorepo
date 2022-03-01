import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerGameItemEntity } from './playergameitem.entity';
import { InventoryService } from './playergameitem.service';
@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([PlayerGameItemEntity])),
    ],
    providers: [InventoryService],
    exports: [InventoryService],
    controllers: []
})
export class InventoryModule {}
