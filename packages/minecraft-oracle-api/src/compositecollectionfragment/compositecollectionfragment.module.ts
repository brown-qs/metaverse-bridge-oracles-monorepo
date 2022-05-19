import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositeCollectionFragmentEntity } from './compositecollectionfragment.entity';
import { CompositeCollectionFragmentService } from './compositecollectionfragment.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([CompositeCollectionFragmentEntity]))
    ],
    providers: [CompositeCollectionFragmentService],
    exports: [CompositeCollectionFragmentService],
    controllers: []
})
export class CompositeCollectionFragmentModule {}
