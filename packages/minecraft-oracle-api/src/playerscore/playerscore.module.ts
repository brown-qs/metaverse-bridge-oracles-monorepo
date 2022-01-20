import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerScoreEntity } from './playerscore.entity';
import { PlayerScoreService } from './playerscore.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([PlayerScoreEntity]))
    ],
    providers: [PlayerScoreService],
    exports: [PlayerScoreService],
    controllers: []
})
export class PlayerScoreModule {}
