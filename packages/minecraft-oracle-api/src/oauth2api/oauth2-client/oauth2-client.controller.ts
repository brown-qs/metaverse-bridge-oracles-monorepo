import { BadRequestException, Body, Controller, ForbiddenException, Get, Inject, Param, Patch, Post, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { JwtAuthGuard } from '../../authapi/jwt-auth.guard';
import { UserRole } from '../../common/enums/UserRole';
import { UserEntity } from '../../user/user/user.entity';
import { User } from '../../utils/decorators';
import { Oauth2PrettyScope, Oauth2Scope, scopeToPrettyScope } from '../../common/enums/Oauth2Scope';
import { Oauth2ClientDto } from './dtos/oauth2client.dto';
import { Oauth2ClientUpdateDto } from './dtos/oauth2clientupdate.dto';
import { Oauth2CreateClientDto } from './dtos/oauth2createclient.dto';
import { Oauth2PublicClientDto } from './dtos/oauth2publicclient.dto';
import { Oauth2ClientService } from './oauth2-client.service';
import xss from "xss"

@ApiTags('OAuth 2.0 Client')
@Controller('oauth2')
export class Oauth2ClientController {

    private readonly context: string;

    constructor(
        private readonly oauth2ClientService: Oauth2ClientService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = Oauth2ClientController.name;
    }

    @Post('client/create')
    @ApiOperation({ summary: 'Create OAuth 2.0 client. Requires admin user auth.' })
    @ApiCreatedResponse({
        description: 'The client has been successfully created.',
        type: Oauth2ClientDto,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createClient(@User() user: UserEntity, @Body() body: Oauth2CreateClientDto): Promise<Oauth2ClientDto> {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        let appName = body.appName
            .replace(/[^\x20-\x7E]/g, '') //remove ascii control characters
        appName = xss(appName, {
            whiteList: {}, // empty, means filter out all tags
            stripIgnoreTag: true, // filter out all HTML not in the whitelist
            stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
            // to filter out its content
        })
        appName = appName.trim()

        let row
        try {
            row = await this.oauth2ClientService.create(appName, body.redirectUri, [...body.scopes], user)
        } catch (e) {
            this.logger.error(`createClient:: error creating oauth client`, e, this.context)

            if (String(e).includes("duplicate key value violates")) {
                throw new BadRequestException("There is already a client with this name")
            } else {
                throw e
            }
        }
        return this.oauth2ClientService.clientEntityToDto(row)
    }



    @Get('clients')
    @ApiOperation({ summary: 'Get all OAuth 2.0 clients owned by user. Requires admin user auth.' })
    @ApiResponse({
        description: 'Clients for user',
        type: [Oauth2ClientDto]
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getClients(@User() user: UserEntity): Promise<Oauth2ClientDto[]> {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        const rows = await this.oauth2ClientService.findMany({ where: { owner: user } })
        return rows.map(row => this.oauth2ClientService.clientEntityToDto(row))
    }



    @Patch('client/:clientId/update')
    @ApiOperation({ summary: 'Update OAuth 2.0 Client. Requires admin user auth.' })
    @ApiResponse({
        description: 'Updated client.',
        type: Oauth2ClientDto
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateClient(@User() user: UserEntity, @Body() body: Oauth2ClientUpdateDto, @Param() params: { clientId: string }): Promise<Oauth2ClientDto> {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }

        const allowedProps = ["appName", "redirectUri", "scopes"]
        let hasUpdatableProp = false
        const invalidProps = []
        for (const bodyProp of Object.keys(body)) {
            if (allowedProps.includes(bodyProp)) {
                hasUpdatableProp = true
            } else {
                invalidProps.push(bodyProp)
            }
        }

        if (invalidProps.length > 0) {
            throw new BadRequestException(`${invalidProps.join(", ")} can't be updated`)
        }

        if (!hasUpdatableProp) {
            throw new BadRequestException("You didn't provide anything that can be updated")
        }

        try {
            await this.oauth2ClientService.update({ owner: user, clientId: params.clientId }, { ...body, updatedAt: new Date() })
        } catch (e) {
            this.logger.error(`updateClient:: error creating oauth client`, e, this.context)
            if (String(e).includes("duplicate key value violates")) {
                throw new BadRequestException("There is already a client with this name")
            } else {
                throw e
            }
        }
        const row = await this.oauth2ClientService.findOne({ clientId: params.clientId })
        if (!row) {
            throw new BadRequestException("Invalid clientId")
        }
        return this.oauth2ClientService.clientEntityToDto(row)
    }

    @Get('client/:clientId/public')
    @ApiOperation({ summary: 'Get public information about a client. Used for displaying client name and pretty scope names to user' })
    @ApiResponse({
        description: 'Public client info',
        type: Oauth2ClientDto
    })
    async publicClient(@Param() params: { clientId: string }): Promise<Oauth2PublicClientDto> {
        const row = await this.oauth2ClientService.findOne({ clientId: params.clientId })
        if (!row) {
            throw new BadRequestException("Invalid clientId")
        }

        if (row.approved !== true) {
            throw new BadRequestException("Client has not been approved")
        }
        const scopes = row.scopes.map(sc => ({ scope: sc, prettyScope: scopeToPrettyScope(sc) }))
        return { appName: row.appName, scopes: scopes }
    }
}



