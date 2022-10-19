import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionFragmentRoutingEntity } from './collectionfragmentrouting.entity';
import { CollectionFragmentRoutingService } from './collectionfragmentrouting.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([CollectionFragmentRoutingEntity]))
    ],
    providers: [CollectionFragmentRoutingService],
    exports: [CollectionFragmentRoutingService],
    controllers: []
})
export class CollectionFragmentRoutingModule { }
