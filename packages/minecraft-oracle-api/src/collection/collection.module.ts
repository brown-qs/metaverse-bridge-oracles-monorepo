import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './collection.entity';
import { CollectionService } from './collection.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([CollectionEntity]))
    ],
    providers: [CollectionService],
    exports: [CollectionService],
    controllers: []
})
export class CollectionModule {}
