import {Inject, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { MaterialEntity } from '../material/material.entity';
import { TextureEntity } from '../texture/texture.entity';
import { SecretService } from '../secret/secret.service';

@Injectable()
export class AdminService {

    private readonly context: string;
    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly materialService: MaterialService,
        private readonly snapshotService: SnapshotService,
        private readonly secretService: SecretService,
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

    public async setSharedSecret(name: string, secret: string) {
        const entity = await this.secretService.create({
            name,
            secret
        })

        return !!entity
    }

    public async getSharedSecret(name: string) {
        const entity = await this.secretService.findOne({ name })
        return entity
    }

    public async getSharedSecrets() {
        const entities = await this.secretService.all()
        return entities;
    }

    public async setVIP(user: {uuid: string}, vip: boolean) {

        //console.log(user, vip, typeof vip)
        const res = await this.userService.update(user.uuid, {vip})
        //console.log(res)

        return (res.affected ?? 1) > 0
    }

    public async blacklist(user: {uuid: string}, blacklisted: boolean) {
        const res = await this.userService.update(user.uuid, {blacklisted})
        return (res.affected ?? 1) > 0
    }
}
