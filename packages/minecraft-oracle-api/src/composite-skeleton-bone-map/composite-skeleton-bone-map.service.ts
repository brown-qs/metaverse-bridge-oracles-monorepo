import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompositeSkeletonBoneMapEntity } from './composite-skeleton-bone-map.entity';

@Injectable()
export class CompositeSkeletonBoneMapService {
    constructor(
        @InjectRepository(CompositeSkeletonBoneMapEntity)
        private readonly repository: Repository<CompositeSkeletonBoneMapEntity>
    ) { }
}
