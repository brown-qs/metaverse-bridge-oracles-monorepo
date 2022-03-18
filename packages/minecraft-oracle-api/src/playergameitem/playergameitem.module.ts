import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerGameItemEntity } from './playergameitem.entity';
import { PlayerGameItemService } from './playergameitem.service';
@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([PlayerGameItemEntity])),
    ],
    providers: [PlayerGameItemService],
    exports: [PlayerGameItemService],
    controllers: []
})
export class PlayerGameItemModule {}
