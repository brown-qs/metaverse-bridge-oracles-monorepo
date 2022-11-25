import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnaplogMergeEntity } from './snaplog-merge.entity';
import { SnaplogMergeService } from './snaplog-merge.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([SnaplogMergeEntity])),
  ],
  providers: [SnaplogMergeService],
  exports: [SnaplogMergeService]

})
export class SnaplogMergeModule { }
