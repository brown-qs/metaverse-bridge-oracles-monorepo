import {Inject, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { TextureType } from '../texture/texturetype.enum';
import { DEFAULT_SKIN } from '../config/constants';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { boolean } from 'fp-ts';
import { MaterialEntity } from 'src/material/material.entity';
import { TextureEntity } from 'src/texture/texture.entity';

@Injectable()
export class AdminService {

    private readonly context: string;
    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly materialService: MaterialService,
        private readonly snapshotService: SnapshotService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = AdminService.name
    }

    public async saveMaterials(materials: MaterialEntity[]): Promise<boolean> {

        if (!materials || materials.length == 0) {
            return false
        }

        const materialEntities = await this.materialService.createMultiple(materials)

        if (!materialEntities || materialEntities.length == 0) {
            this.logger.error(`saveMaterials:: error saving material entities`, this.context)
            return false
        }

        return materialEntities.length == materials.length
    }

    public async deleteMaterials(materials: MaterialEntity[]): Promise<boolean> {

        if (!materials || materials.length == 0) {
            return false
        }

        const materialEntities = await this.materialService.removeMultiple(materials)

        if (!materialEntities || materialEntities.length == 0) {
            this.logger.error(`deleteMaterials:: error saving material entities`, this.context)
            return false
        }

        return materialEntities.length == materials.length
    }

    public async saveTextures(textures: TextureEntity[]): Promise<boolean> {

        if (!textures || textures.length == 0) {
            return false
        }

        const texturesEntities = await this.textureService.createMultiple(textures)

        if (!texturesEntities || texturesEntities.length == 0) {
            this.logger.error(`saveTextures:: error saving texture entities`, this.context)
            return false
        }

        return texturesEntities.length == textures.length
    }

    public async deleteTextures(textures: TextureEntity[]): Promise<boolean> {

        if (!textures || textures.length == 0) {
            return false
        }

        const textureEntities = await this.textureService.removeMultiple(textures)

        if (!textureEntities || textureEntities.length == 0) {
            this.logger.error(`deleteTextures:: error saving texture entities`, this.context)
            return false
        }

        return textureEntities.length == textures.length
    }
}
