import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositeSkeletonBoneMapEntity } from './composite-skeleton-bone-map.entity';
import { CompositeSkeletonBoneMapService } from './composite-skeleton-bone-map.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([CompositeSkeletonBoneMapEntity]))
  ],
  providers: [CompositeSkeletonBoneMapService],
  exports: [CompositeSkeletonBoneMapService]
})
export class CompositeSkeletonBoneMapModule { }
