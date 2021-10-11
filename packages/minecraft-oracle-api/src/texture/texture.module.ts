import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextureService } from './texture.service';
import { TextureEntity } from './texture.entity';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([TextureEntity]))
    ],
    providers: [TextureService],
    exports: [TextureService],
    controllers: []
})
export class TextureModule {}
