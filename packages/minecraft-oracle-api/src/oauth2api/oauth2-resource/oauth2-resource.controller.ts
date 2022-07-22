import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Oauth2Scope } from '../../common/enums/Oauth2Scope';
import { UserEntity } from '../../user/user/user.entity';
import { Oauth2RequiredScopes, Oauth2User } from '../oauth2-required-scopes.decorator';
import { Oauth2Guard } from '../oauth2.guard';
import { OauthGetUserDto } from './dto/oauthgetuser.dto';

@ApiTags('OAuth 2.0 Resource')

@UseGuards(Oauth2Guard)
@Controller('oauth2/resource')
export class Oauth2ResourceController {
    private readonly context: string;

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,

    ) {
        this.context = Oauth2ResourceController.name;
    }

    @Get('user')
    @ApiBearerAuth()
    @ApiResponse({
        description: 'User data',
        type: OauthGetUserDto
    })
    @ApiOperation({ summary: 'Get user uuid and gamertag. Required scopes: user:gamer_tag.read, user:uuid.read' })
    @ApiOAuth2([Oauth2Scope.UserUuidRead, Oauth2Scope.UserGamerTagRead])
    @Oauth2RequiredScopes(Oauth2Scope.UserUuidRead, Oauth2Scope.UserGamerTagRead)
    async getUser(@Oauth2User() user: UserEntity): Promise<OauthGetUserDto> {
        return { "uuid": user.uuid, "gamerTag": null }
    }
}
