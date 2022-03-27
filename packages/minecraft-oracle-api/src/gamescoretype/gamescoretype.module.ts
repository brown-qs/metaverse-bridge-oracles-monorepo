import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameScoreTypeEntity } from './gamescoretype.entity';
import { GameScoreTypeService } from './gamescoretype.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([GameScoreTypeEntity]))
    ],
    providers: [GameScoreTypeService],
    exports: [GameScoreTypeService],
    controllers: []
})
export class GameScoreTypeModule {}
