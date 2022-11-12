import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([AuditLogEntity]))
  ],
  providers: [AuditLogService],
  exports: [AuditLogService]
})
export class AuditLogModule { }
