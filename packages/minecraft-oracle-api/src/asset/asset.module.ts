import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './asset.entity';
import { AssetService } from './asset.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([AssetEntity]))
    ],
    providers: [AssetService],
    exports: [AssetService],
    controllers: []
})
export class AssetModule {}
