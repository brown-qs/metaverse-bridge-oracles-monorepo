import { Body, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Oauth2Scope } from '../../common/enums/Oauth2Scope';
import { UserEntity } from '../../user/user/user.entity';
import { UserService } from '../../user/user/user.service';
import { Oauth2RequiredScopes, Oauth2User } from '../oauth2-required-scopes.decorator';
import { Oauth2Guard } from '../oauth2.guard';
import { OauthGetUserDto } from './dto/oauthgetuser.dto';
import { OauthSetGamerTagDto } from './dto/oauthsetgamertag.dto';
import { OauthSetGamerTagRequestDto } from './dto/oauthsetgamertagrequest.dto';

@ApiTags('OAuth 2.0 Resource')

@UseGuards(Oauth2Guard)
@Controller('oauth2/resource')
export class Oauth2ResourceController {
    private readonly context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        private readonly userService: UserService,

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
        return { "uuid": user.uuid, "gamerTag": user.gamerTag }
    }

    @Put('gamertag')
    @ApiBearerAuth()
    @ApiResponse({
        description: 'Returns sanitized gamer tag that was used',
        type: OauthSetGamerTagDto
    })
    @ApiOperation({ summary: 'Set gamertag and returned sanitized one that was set. Will error http 400 if gamer tag already in use etc. Required scopes: user:gamer_tag.read, user:gamer_tag.write' })
    @ApiOAuth2([Oauth2Scope.UserGamerTagRead, Oauth2Scope.UserGamerTagWrite])
    @Oauth2RequiredScopes(Oauth2Scope.UserGamerTagRead, Oauth2Scope.UserGamerTagWrite)
    async setGamerTag(@Oauth2User() user: UserEntity, @Body() dto: OauthSetGamerTagRequestDto): Promise<OauthSetGamerTagDto> {
        const newGamerTag = await this.userService.setGamerTag(user.uuid, dto.gamerTag)
        return { gamerTag: newGamerTag }
    }
}
