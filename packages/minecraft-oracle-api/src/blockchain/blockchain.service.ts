import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { GameSessionService } from 'src/gamesession/gamesession.service';

@Injectable()
export class BlockchainService {

    private readonly context: string;
    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly materialService: MaterialService,
        private readonly snapshotService: SnapshotService,
        private readonly gameSessionService: GameSessionService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = BlockchainService.name
    }

    public async userExport(user: UserEntity): Promise<[string, string]> {
        const textures = user.textures ?? []

        return ['','']
    }

    public async userSummon(user: UserEntity): Promise<[string, string]> {
        const textures = user.textures ?? []

        return ['','']
    }

    public async userImport(user: UserEntity): Promise<[string, string]> {
        const textures = user.textures ?? []

        return ['','']
    }

    public async userEnrapture(user: UserEntity): Promise<[string, string]> {
        const textures = user.textures ?? []

        return ['','']
    }

}
