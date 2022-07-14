import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinecraftUserNameEntity } from './minecraft-user-name.entity';
import { MinecraftUserNameService } from './minecraft-user-name.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([MinecraftUserNameEntity]))
    ],
    providers: [MinecraftUserNameService],
    exports: [MinecraftUserNameService]

})
export class MinecraftUserNameModule { }
