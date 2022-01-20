import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementEntity } from './achievement.entity';
import { AchievementService } from './achievement.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([AchievementEntity]))
    ],
    providers: [AchievementService],
    exports: [AchievementService],
    controllers: []
})
export class AchievementModule {}
