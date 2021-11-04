import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaySessionEntity } from './playsession.entity';
import { PlaySesionService } from './playsession.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([PlaySessionEntity]))
    ],
    providers: [PlaySesionService],
    exports: [PlaySesionService],
    controllers: []
})
export class PlaySessionModule {}
