import {Inject, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from 'src/texture/texture.service';
import { UserEntity } from 'src/user/user.entity';
import { TextureType } from 'src/texture/texturetype.enum';
import { DEFAULT_SKIN } from 'src/config/constants';

export type PlayerTextureMapDto = {
    [key: string]: {
        textureData: string
        textureSignature: string
        type: TextureType
    }
}

@Injectable()
export class GameService {
    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {}

    public async getTexture(user: UserEntity): Promise<PlayerTextureMapDto> {
        const textures = user.textures ?? []
        
        const textureMap: PlayerTextureMapDto = {}
        
        textures.map(texture => {
            textureMap[texture.type] = {
                textureData: texture.textureData,
                textureSignature: texture.textureSignature,
                type: texture.type
            }
        })

        // at least we need to get the default skin
        if (!textureMap[TextureType.SKIN]) {
            textureMap[TextureType.SKIN] = DEFAULT_SKIN
        }

        return textureMap
    }
}
