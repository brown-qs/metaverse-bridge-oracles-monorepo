import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailChangeEntity } from './email-change.entity';
import { EmailChangeService } from './email-change.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([EmailChangeEntity]))
  ],
  providers: [EmailChangeService],
  exports: [EmailChangeService]
})
export class EmailChangeModule { }
