import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositeSkeletonEntity } from './composite-skeleton.entity';
import { CompositeSkeletonService } from './composite-skeleton.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([CompositeSkeletonEntity]))
  ],
  providers: [CompositeSkeletonService],
  exports: [CompositeSkeletonService]
})
export class CompositeSkeletonModule { }
