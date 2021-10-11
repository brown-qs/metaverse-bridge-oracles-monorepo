import { Module } from '@nestjs/common';
import { TextureModule } from 'src/texture/texture.module';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
    imports: [
        UserModule,
        TextureModule
    ],
    providers: [GameService],
    exports: [GameService],
    controllers: [GameController]
})
export class GameModule {}
