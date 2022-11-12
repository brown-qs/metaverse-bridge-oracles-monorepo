import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationLogEntity } from './migration-log.entity';
import { MigrationLogService } from './migration-log.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([MigrationLogEntity]))
  ],
  providers: [MigrationLogService],
  exports: [MigrationLogService]
})
export class MigrationLogModule { }
