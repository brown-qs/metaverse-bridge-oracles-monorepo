import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Oauth2ClientDto } from '../oauth2-client/dtos/oauth2client.dto';
import { AuthorizeQueryDto } from './dtos/authorizequery.dto';
import { OAUTH2_SERVER } from '../constants';
import OAuth2Server from 'oauth2-server';

@ApiTags('oauth2/authorization')
@Controller('oauth2/authorization')
export class Oauth2AuthorizationController {
    private readonly context: string;

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @Inject(OAUTH2_SERVER) private readonly oauth2Server: OAuth2Server,

    ) {
        this.context = Oauth2AuthorizationController.name;
    }

    @Get('authorize')
    @ApiOperation({ summary: 'Redirect user-agent (login flow on Moonsama.com) back to client (oauth2 app) with temp code that can be used to get an access token' })
    @ApiCreatedResponse({
        description: 'The client has been successfully created.',
        type: Oauth2ClientDto,
    })
    async authorize(@Query() query: AuthorizeQueryDto) {

    }

    @Post('token')
    @ApiOperation({ summary: 'Get an access token from a temp code' })
    @ApiCreatedResponse({
        description: 'The client has been successfully created.',
        type: Oauth2ClientDto,
    })
    async token() {

    }
}
