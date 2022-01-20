import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameTypeEntity } from './gametype.entity';
import { GameTypeService } from './gametype.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([GameTypeEntity]))
    ],
    providers: [GameTypeService],
    exports: [GameTypeService],
    controllers: []
})
export class GameTypeModule {}
