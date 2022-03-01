import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameItemTypeEntity } from './gameitemtype.entity';
import { GameItemTypeService } from './gameitemtype.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([GameItemTypeEntity]))
    ],
    providers: [GameItemTypeService],
    exports: [GameItemTypeService],
    controllers: []
})
export class GameTypeModule {}
