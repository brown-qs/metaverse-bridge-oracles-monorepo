import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionFragmentEntity } from './collectionfragment.entity';
import { CollectionFragmentService } from './collectionfragment.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([CollectionFragmentEntity]))
    ],
    providers: [CollectionFragmentService],
    exports: [CollectionFragmentService],
    controllers: []
})
export class CollectionFragmentModule {}
