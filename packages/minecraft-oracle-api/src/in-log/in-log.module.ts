import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InLogEntity } from './in-log.entity';
import { InLogService } from './in-log.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([InLogEntity]))
  ],
  providers: [InLogService],
  exports: [InLogService]
})
export class InLogModule { }
