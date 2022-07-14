import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MinecraftLinkEntity } from './minecraft-link.entity';
import { MinecraftLinkService } from './minecraft-link.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([MinecraftLinkEntity])),
    UserModule
  ],
  providers: [MinecraftLinkService],
  exports: [MinecraftLinkService]
})
export class MinecraftLinkModule { }
