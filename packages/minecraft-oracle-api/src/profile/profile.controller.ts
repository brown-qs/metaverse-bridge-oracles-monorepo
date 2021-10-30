import {
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './dtos/profile.dto';
import { User } from 'src/utils/decorators';
import { UserEntity } from '../user/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileItemsDto } from 'src/profile/dtos/profileItem.dto';


@ApiTags('user')
@Controller('user')
export class ProfileController {

    private readonly context: string;

    constructor(
        private readonly profileService: ProfileService,
        private readonly jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = ProfileController.name;
    }

    @Get('profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async profile(@User() user: UserEntity): Promise<ProfileDto> {
        return this.profileService.userProfile(user)
    }

    @Get('resources')
    @HttpCode(200)
    @ApiOperation({ summary: 'User resources available to summon from the Metaverse' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async resources(@User() user: UserEntity): Promise<ProfileItemsDto> {
        return this.profileService.getPlayeritems(user)   
    }

    
    @Get('verifyjwt/:jwttoken')
    @HttpCode(200)
    @ApiModelProperty()
    @ApiOperation({ summary: 'Verifies jwt token' })
    async verify(@Param('jwttoken') jwt: string) {
        try {
            return this.jwtService.verify(jwt, {ignoreExpiration: false})
        } catch (err) {
            this.logger.error(`verifyjwt:: error`, err, this.context)
            throw new UnprocessableEntityException(err?.message ?? 'JWT verification error')
        }
    }

    @Get('inprogress')
    @HttpCode(200)
    @ApiOperation({ summary: 'Returns whether there is an active game in progress or not' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getGameInProgress(): Promise<boolean> {
        const inprogress = await this.profileService.getGameInProgress()
        return inprogress
    }
}
