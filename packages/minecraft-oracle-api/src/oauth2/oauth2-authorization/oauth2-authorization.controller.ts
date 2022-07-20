import { BadRequestException, Body, Controller, Get, HttpCode, Inject, Post, Query, Redirect, Req, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Oauth2ClientDto } from '../oauth2-client/dtos/oauth2client.dto';
import { AuthorizeQueryDto } from './dtos/authorizequery.dto';
import OAuth2Server, {
    Token,
    OAuthError,
    TokenOptions,
    AuthorizeOptions,
    AuthorizationCode,
    AuthenticateOptions,
    Request as OAuth2Request,
    Response as OAuth2Response,
} from 'oauth2-server';
import { Oauth2ClientService } from '../oauth2-client/oauth2-client.service';
import { JwtAuthGuard } from '../../authapi/jwt-auth.guard';
import { UserEntity } from '../../user/user/user.entity';
import { User } from '../../utils/decorators';
import { Oauth2Scope } from '../../common/enums/Oauth2Scope';
import { Oauth2AuthorizationService } from './oauth2-authorization.service';
import { Oauth2GrantTypes, TokenBodyDto } from './dtos/tokenbody.dto';
import { TokenResponseDto } from './dtos/tokenresponse.dto';

@ApiTags('OAuth 2.0 Authorization')
@Controller('oauth2')
export class Oauth2AuthorizationController {
    private readonly context: string;

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        private readonly oauth2ClientService: Oauth2ClientService,
        private readonly oauth2AuthorizationService: Oauth2AuthorizationService

    ) {
        this.context = Oauth2AuthorizationController.name;
    }

    @Get('authorize')
    @ApiResponse({ status: 302, description: 'callback.uri?code=akdflajdflkj(&state=xyz) OR callback.uri?error=invalid_request|access_denied|unsupported_response_type&error_description=state%20must%20be%20alphanumeric' })
    @Redirect()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Redirect user-agent (login flow on Moonsama.com) back to client (oauth2 app) with temp code that can be used to get an access token' })
    async authorize(@User() user: UserEntity, @Query() dto: AuthorizeQueryDto) {
        const clientEntity = await this.oauth2ClientService.findOne({ clientId: dto.client_id })
        if (!clientEntity) {
            throw new BadRequestException("client not found")
        }

        //invalid redirect url
        if (dto?.redirect_uri === "") {
            return { url: `${clientEntity.redirectUri}?error=invalid_request&error_description=${encodeURI("redirect_uri cannot be blank")}` }
        } else if (!!dto?.redirect_uri && ![clientEntity.redirectUri].includes(dto.redirect_uri)) {
            return { url: `${clientEntity.redirectUri}?error=invalid_request&error_description=${encodeURI("redirect_uri is not whitelisted for client")}` }
        }

        //invalid user
        if (!user) {
            return { url: `${clientEntity.redirectUri}?error=access_denied&error_description=${encodeURI("Moonsama user is not logged in")}` }
        }

        //only support oauth2 code reponse type
        if (dto?.response_type !== "code") {
            return { url: `${clientEntity.redirectUri}?error=unsupported_response_type&error_description=${encodeURI("response_type must be code")}` }
        }

        //empty scope
        if (dto?.scope === "") {
            return { url: `${clientEntity.redirectUri}?error=invalid_request&error_description=${encodeURI("scope cannot be blank")}` }
        }
        //empty state
        if (dto?.state === "") {
            return { url: `${clientEntity.redirectUri}?error=invalid_request&error_description=${encodeURI("state cannot be blank")}` }
        } else if (!!dto?.state && /[^0-9a-zA-Z]/.test(dto?.state)) {
            return { url: `${clientEntity.redirectUri}?error=invalid_request&error_description=${encodeURI("state must be alphanumeric")}` }
        }

        let scopes: Oauth2Scope[]
        //invalid scopes
        if (!!dto?.scope) {
            const requestedScopes = dto.scope.split(" ") as Oauth2Scope[]
            const invalidScopes = []
            for (const scope of requestedScopes) {
                if (!clientEntity.scopes.includes(scope)) {
                    invalidScopes.push(scope)
                }
            }
            if (invalidScopes.length > 0) {
                return { url: `${clientEntity.redirectUri}?error=invalid_scope&error_description=${"Scopes: " + encodeURI(invalidScopes.join(",") + " are not allowed or invalid")}` }
            }
            scopes = requestedScopes
            //if scopes are not passed in we default to scopes client is allowed
        } else {
            scopes = clientEntity.scopes
        }



        let authorizationResult
        try {
            authorizationResult = await this.oauth2AuthorizationService.create(scopes, user, clientEntity, clientEntity.redirectUri, dto.state)
        } catch (e) {
            return { url: `${clientEntity.redirectUri}?error=server_error&error_description=${encodeURI("Failed to make code")}` }
        }

        let state = ""
        if (!!dto?.state) {
            state = `&state=${dto.state}`
        }
        return { url: `${clientEntity.redirectUri}?code=${authorizationResult.code}${state}` }
    }

    @Post('token')
    @HttpCode(200)
    //as per oauth2 spec
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOperation({ summary: 'Get an access token from a temp code.' })
    @ApiOkResponse({
        description: 'Code was successfully used and access token generated',
        type: TokenResponseDto,
    })
    async token(@Body() dto: TokenBodyDto): Promise<TokenResponseDto> {
        const clientEntity = await this.oauth2ClientService.findOne({ clientId: dto.client_id })
        if (!clientEntity) {
            throw new BadRequestException("clientId not found")
        }

        //sanity check to make sure client secrets are strings and of certain length for security
        if ((typeof clientEntity?.clientSecret !== "string") || (typeof dto?.client_secret !== "string") || clientEntity?.clientSecret.length < 5 || dto.client_secret.length < 5) {
            throw new BadRequestException("clientSecret invalid")
        }

        if (clientEntity.clientSecret !== dto.client_secret) {
            throw new BadRequestException("clientSecret invalid")
        }

        //AUTHORIZATION CODE
        let authorizationEntityAfterUpdate
        if (dto.grant_type === Oauth2GrantTypes.AuthorizationCode) {

            if (clientEntity.redirectUri !== dto.redirect_uri) {
                throw new BadRequestException("redirect_uri is not whitelisted")
            }

            //sanity check for code for security
            if ((typeof dto?.code !== "string") || dto?.code.length < 5) {
                throw new BadRequestException("code invalid")
            }

            const authorizationEntity = await this.oauth2AuthorizationService.findOne({ client: clientEntity, code: dto.code })
            if (!authorizationEntity) {
                throw new BadRequestException("code invalid")
            }

            if (!!authorizationEntity.accessToken) {
                throw new BadRequestException("code already used")
            }

            const codeCreateTime = authorizationEntity.codeCreatedAt.getTime();
            const timeDiff = new Date().getTime() - codeCreateTime

            //code expires after 10 mins
            if (timeDiff > 1000 * 60 * 10) {
                throw new BadRequestException("code expired")
            }

            try {
                await this.oauth2AuthorizationService.updateTokensAuthorizationCode(authorizationEntity, dto.code)
                authorizationEntityAfterUpdate = await this.oauth2AuthorizationService.findOne({ id: authorizationEntity.id, code: dto.code })
            } catch (e) {
                this.logger.debug(`oauth2authorization:token:: ${String(e)}`, this.context)
                throw new BadRequestException("unable to generate access token")
            }
        } else if (dto.grant_type === Oauth2GrantTypes.RefreshToken) {
            //REFRESH TOKEN

            //sanity check refresh token
            if ((typeof dto?.refresh_token !== "string") || dto?.refresh_token.length < 5) {
                throw new BadRequestException("refresh_token invalid")
            }
            const authorizationEntity = await this.oauth2AuthorizationService.findOne({ client: clientEntity, refreshToken: dto.refresh_token })
            if (!authorizationEntity) {
                throw new BadRequestException("refresh_token invalid")
            }

            const refreshTokenCreatedAtTime = authorizationEntity.refreshTokenCreatedAt.getTime();
            const timeDiff = new Date().getTime() - refreshTokenCreatedAtTime

            if (timeDiff > clientEntity.refreshTokenValidity) {
                throw new BadRequestException("refresh_token expired")
            }

            try {
                await this.oauth2AuthorizationService.updateTokensRefreshToken(authorizationEntity, dto.refresh_token)
                authorizationEntityAfterUpdate = await this.oauth2AuthorizationService.findOne({ id: authorizationEntity.id, code: authorizationEntity.code })
            } catch (e) {
                this.logger.debug(`oauth2authorization:token:: ${String(e)}`, this.context)
                throw new BadRequestException("unable to generate refresh_token")
            }
        }


        //pass code in so these fail if new code is generated mid stream

        if (authorizationEntityAfterUpdate.valid === false) {
            throw new BadRequestException("user revoked app")
        }

        return {
            "access_token": authorizationEntityAfterUpdate.accessToken,
            "token_type": "bearer",
            "expires_in": clientEntity.accessTokenValidity,
            "refresh_token": authorizationEntityAfterUpdate.refreshToken,
            "refresh_token_expires_in": clientEntity.refreshTokenValidity
        }
    }
}
