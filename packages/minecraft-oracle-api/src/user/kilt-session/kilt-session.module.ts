import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KiltSessionEntity } from './kilt-session.entity';
import { KiltSessionService } from './kilt-session.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([KiltSessionEntity]))
  ],
  providers: [KiltSessionService],
  exports: [KiltSessionService],
  controllers: []
})
export class KiltSessionModule { }
