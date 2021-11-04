import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaySessionEntity } from './playsession.entity';
import { PlaySesionService } from './playsession.service';
import { PlaySessionStatEntity } from './playsessionstat.entity';
import { PlaySessionStatService } from './playsessionstat.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([PlaySessionEntity])),
        forwardRef(() => TypeOrmModule.forFeature([PlaySessionStatEntity]))
    ],
    providers: [PlaySesionService, PlaySessionStatService],
    exports: [PlaySesionService, PlaySessionStatService],
    controllers: []
})
export class PlaySessionModule {}
