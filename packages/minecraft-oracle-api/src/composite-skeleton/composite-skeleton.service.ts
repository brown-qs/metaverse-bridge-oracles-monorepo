import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompositeSkeletonEntity } from './composite-skeleton.entity';

@Injectable()
export class CompositeSkeletonService {
    constructor(
        @InjectRepository(CompositeSkeletonEntity)
        private readonly repository: Repository<CompositeSkeletonEntity>
    ) { }
}
