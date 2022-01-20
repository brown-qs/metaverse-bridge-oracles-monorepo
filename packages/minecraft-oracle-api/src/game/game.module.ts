import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([GameEntity]))
    ],
    providers: [GameService],
    exports: [GameService],
    controllers: []
})
export class GameModule {}
