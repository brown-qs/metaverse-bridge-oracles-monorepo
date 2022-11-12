import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonLogEntity } from './summon-log.entity';
import { SummonLogService } from './summon-log.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([SummonLogEntity]))
  ],
  providers: [SummonLogService],
  exports: [SummonLogService]
})
export class SummonLogModule { }
