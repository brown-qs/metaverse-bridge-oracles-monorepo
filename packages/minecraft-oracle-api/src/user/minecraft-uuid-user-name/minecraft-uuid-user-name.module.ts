import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinecraftUuidUserNameEntity } from './minecraft-uuid-user-name.entity';
import { MinecraftUuidUserNameService } from './minecraft-uuid-user-name.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([MinecraftUuidUserNameEntity]))
  ],
  providers: [MinecraftUuidUserNameService],
  exports: [MinecraftUuidUserNameService]
})
export class MinecraftUuidUserNameModule { }
