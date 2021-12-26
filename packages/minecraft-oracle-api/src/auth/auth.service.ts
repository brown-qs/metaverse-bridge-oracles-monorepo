import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UserService } from '../user/user.service';

import {MicrosoftAccount, MicrosoftAuth} from '../minecraftauth'
import { ConfigService } from '@nestjs/config';
import { ProviderToken } from '../provider/token';
import { MicrosoftSetupParams } from '../provider';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/cache.service';
import { SkinService } from '../skin/skin.service';
import { SkinEntity } from '../skin/skin.entity';
import { TextureService } from '../texture/texture.service';
import { AssetType, StringAssetType } from '../common/enums/AssetType';

@Injectable()
export class AuthService {

    private readonly context: string;

    constructor(
        private userService: UserService,
        private textureService: TextureService,
        private skinService: SkinService,
        private configService: ConfigService,
        private cacheService: CacheService,
        private jwtService: JwtService,
        @Inject(ProviderToken.MICROSOFT_SETUP) private readonly microsoftSetupParams: MicrosoftSetupParams,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = AuthService.name;
    }

    public generateJwtToken(uuid: string, userName: string): string {
        const payload = {sub: uuid, userName};
        return this.jwtService.sign(payload);
    }

    public async getMicrosoftAuthUrl(): Promise<{ redirectUrl: string }> {

        MicrosoftAuth.setup(
            this.microsoftSetupParams.appId,
            this.microsoftSetupParams.appSecret,
            this.microsoftSetupParams.redirectUrl
        )

        const redirectUrl = MicrosoftAuth.createUrl()
        this.logger.debug(`getMicrosoftAuthUrl:: created URL: ${redirectUrl}`);

        return { redirectUrl }
    }

    public async authLogin(code: string) {

        let account = new MicrosoftAccount();

        this.logger.log(`authLogin: ${account}`, this.context);

        const successfulAuthRedirect = this.configService.get<string>('app.redirect')

        MicrosoftAuth.setup(
            this.microsoftSetupParams.appId,
            this.microsoftSetupParams.appSecret,
            this.microsoftSetupParams.redirectUrl
        )
        
        let accessToken: string
        try {
            accessToken = await account.authFlow(code)
        } catch (err: any) {
            this.logger.error('authLogin:: auth flow error', null, this.context)
            this.logger.error(err, null, this.context)
            throw new UnprocessableEntityException('Microsoft auth flow error')
        }

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000)

        try {
            await account.getProfile()
        } catch (err: any) {
            this.logger.error('authLogin:: error authenticating user', null, this.context)
            this.logger.error(err, null, this.context)
            throw new UnprocessableEntityException('User profile could not be fetched.')
        }

        if (!!account.uuid && !!account.username) {
            const userData: UserEntity = {
                uuid: account.uuid,
                userName: account.username,
                hasGame: account.ownership ?? false
            }
            let user: UserEntity
            try {
                user = await this.userService.create(userData)
            } catch (err) {
                this.logger.error(`authLogin: error upserting user into database: ${JSON.stringify(userData)}`, err, this.context)
                throw new UnprocessableEntityException(`Error upserting user into database: ${JSON.stringify(userData)}`)
            }
            this.logger.log(`Account: ${JSON.stringify(account)}`, this.context);

            const jwt = this.generateJwtToken(user.uuid, user.userName);
            const redirectLink = `${successfulAuthRedirect}/${jwt}`;
            
            // check default skins
            (async () => {
                try {
                    const userFull = await this.userService.findOne({uuid: user.uuid}, {relations: ['skins']})
                    if (!userFull.skins || userFull.skins.length < 2) {
                        await this.skinService.createMultiple([
                            {
                                id: SkinEntity.toId(user.uuid, '0x0', '0'),
                                owner: user,
                                equipped: true,
                                texture: await this.textureService.findOne({assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE})
                            },
                            {
                                id: SkinEntity.toId(user.uuid, '0x0', '1'),
                                owner: user,
                                equipped: false,
                                texture: await this.textureService.findOne({assetAddress: '0x0', assetId: '1', assetType: StringAssetType.NONE})
                            }
                        ])
                    }
                } catch (error) {
                    this.logger.warn(`authLogin:: error trying to set default skins for user ${user.uuid}`, this.context)
                }
            })()

            this.logger.log(`authLogin:: successful login for user (${user.uuid}, ${user.userName}). Redirect link: ${redirectLink}`, this.context)

            return {
                jwt,
                user,
                redirectUrl: redirectLink
            }

        } else {
            this.logger.error('authLogin:: user uuid and userName was not received', null, this.context)
            throw new UnprocessableEntityException('User profile could not be fetched.')
        }
    }
}
