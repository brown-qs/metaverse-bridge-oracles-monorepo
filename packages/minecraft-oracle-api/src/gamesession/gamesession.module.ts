import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSessionEntity } from './gamesession.entity';
import { GameSessionService } from './gamesession.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([GameSessionEntity]))
    ],
    providers: [GameSessionService],
    exports: [GameSessionService],
    controllers: []
})
export class GameSessionModule {}
