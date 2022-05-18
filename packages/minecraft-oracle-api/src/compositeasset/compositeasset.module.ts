import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositeAssetEntity } from './compositeasset.entity';
import { CompositeAssetService } from './compositeasset.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([CompositeAssetEntity]))
    ],
    providers: [CompositeAssetService],
    exports: [CompositeAssetService],
    controllers: []
})
export class CompositeAssetModule {}
