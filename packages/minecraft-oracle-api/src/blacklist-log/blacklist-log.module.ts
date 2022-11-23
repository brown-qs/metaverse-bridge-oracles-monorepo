import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InLogEntity } from '../in-log/in-log.entity';
import { BlacklistLogEntity } from './blacklist-log.entity';
import { BlacklistLogService } from './blacklist-log.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([BlacklistLogEntity]))
  ],
  providers: [BlacklistLogService],
  exports: [BlacklistLogService]
})
export class BlacklistLogModule { }
