import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextureModule } from 'src/texture/texture.module';
import { UserModule } from 'src/user/user.module';
import { MaterialEntity } from './material.entity';
import { MaterialService } from './material.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([MaterialEntity]))
    ],
    providers: [MaterialService],
    exports: [MaterialService],
    controllers: []
})
export class MaterialModule {}
