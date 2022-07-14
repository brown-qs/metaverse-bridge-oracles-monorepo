import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinecraftUuidEntity } from './minecraft-uuid.entity';
import { MinecraftUuidService } from './minecraft-uuid.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([MinecraftUuidEntity]))
    ],
    providers: [MinecraftUuidService],
    exports: [MinecraftUuidService]
})
export class MinecraftUuidModule { }
