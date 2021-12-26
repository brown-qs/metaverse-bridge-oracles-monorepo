import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkinService } from './skin.service';
import { SkinEntity } from './skin.entity';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SkinEntity]))
    ],
    providers: [SkinService],
    exports: [SkinService],
    controllers: []
})
export class SkinModule {}
