import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerAchievementEntity } from './playerachievement.entity';
import { PlayerAchievementService } from './playerachievement.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([PlayerAchievementEntity]))
    ],
    providers: [PlayerAchievementService],
    exports: [PlayerAchievementService],
    controllers: []
})
export class PlayerAchievementModule {}
