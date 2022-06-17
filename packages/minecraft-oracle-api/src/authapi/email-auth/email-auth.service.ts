import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { EmailUserEntity } from 'src/user/email-user/email-user.entity';
import { EmailUserService } from 'src/user/email-user/email-user.service';
import { Repository } from 'typeorm';

@Injectable()
export class EmailAuthService {
    private readonly context: string;

    constructor(
        private emailUserService: EmailUserService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = EmailAuthService.name
    }
    async sendAuthEmail(email: string, gRecaptchaResponse: string) {
        const recaptchaSecret = this.configService.get<string>('recaptcha.secret')

        if (recaptchaSecret === "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe") {
            this.logger.warn(`sendAuthEmail: using test recaptcha secret! Don't use in production!`, this.context)
        }

        try {
            let result = await axios({
                method: 'post',
                url: 'https://www.google.com/recaptcha/api/siteverify',
                params: {
                    secret: recaptchaSecret,
                    response: gRecaptchaResponse
                }
            });
            let data = result.data || {};

            //TO DO: check data.hostname
            if (data.success !== true) {
                throw new Error("captcha rejected")
            }
        } catch (err) {
            this.logger.error(`sendAuthEmail: captcha did verify`, err, this.context)
            throw new UnprocessableEntityException(`Invalid captcha`)
        }




        const uuid = makeUuid() + makeUuid()
        try {
            await this.emailUserService.createLogin(email.toLowerCase().trim(), uuid, new Date())
        } catch (err) {
            this.logger.error(`sendAuthEmail: error upserting user into database: ${email}`, err, this.context)
            throw new UnprocessableEntityException(`Error upserting user into database`)
        }

        const serverScheme = this.configService.get<string>('server.scheme')
        const serverHost = this.configService.get<string>('server.host')
        let serverPort = this.configService.get<string>('server.port')
        if (serverPort && serverPort !== "80") {
            serverPort = ":" + serverPort
        } else {
            serverPort = ""
        }

        const loginLink = `${serverScheme}://${serverHost}${serverPort}/api/v1/auth/email/verify?loginKey=${uuid}`
        console.log("login link: " + loginLink)
    }

    async verifyAuthLink(loginKey: string): Promise<EmailUserEntity> {
        let user: EmailUserEntity
        try {
            user = await this.emailUserService.findByLoginKey(loginKey)
            if (!user) {
                throw new Error("User with login key not found")
            }
        } catch (err) {
            this.logger.error(`sendAuthEmail: login key is not in database: ${loginKey}`, err, this.context)
            throw new UnprocessableEntityException(`loginKey invalid`)
        }

        const keyGenerationTime = user.keyGenerationDate.getTime()

        //login links last for 10 mins
        const expirationTime = 1000 * 60 * 10
        const timeDiff = new Date().getTime() - keyGenerationTime
        if (timeDiff > expirationTime) {
            this.logger.error(`verifyAuthLink: loginKey has expired it has been ${timeDiff}ms`, null, this.context)
            throw new UnprocessableEntityException(`loginKey expired`)
        }

        //invalidate login key
        try {
            await this.emailUserService.spendLoginKey(loginKey)
        } catch (err) {
            this.logger.error(`verifyAuthLink: failed to invalidate login key`, err, this.context)
            throw new UnprocessableEntityException(`loginKey failure`)
        }
        return user

    }
}

function makeUuid() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return s4() + s4() + '' + s4() + '' + s4() + '' + s4() + '' + s4() + s4() + s4(); }