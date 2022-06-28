import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import formData from "form-data"
import Mailgun from "mailgun.js"
import { EmailLoginKeyService } from 'src/user/email-login-key/email-login-key.service';
import { EmailLoginKeyEntity } from 'src/user/email-login-key/email-login-key.entity';
import { UserService } from 'src/user/user/user.service';
import { UserEntity } from 'src/user/user/user.entity';
@Injectable()
export class EmailAuthService {
    private readonly context: string;
    mailgun: any;
    mg: any;

    constructor(
        private userService: UserService,
        private emailLoginKeyService: EmailLoginKeyService,
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
            await this.emailLoginKeyService.createLogin(email.toLowerCase().trim(), uuid, new Date())
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

        const loginLink = `${this.configService.get<string>('frontend.url')}/account/login/email/verify/${uuid}`
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY, url: 'https://api.eu.mailgun.net' });


        const mailOptions = {
            from: 'Moonsama <no-reply@sp.moonsama.com>',
            to: [email], // list of receivers
            subject: "Your Moonsama single-use login link", // Subject line
            text: `We received your request for a single-use login link to use with Moonsama.\n\nYour single-use login link is: ${loginLink}`, // plaintext body
        };

        // send mail with defined transport object
        let result
        try {
            result = await mg.messages.create('sp.moonsama.com', mailOptions)
            console.log(result);
        } catch (e) {
            console.log(e)
            this.logger.error(`sendAuthEmail: unable to send email`, e, this.context)
            throw new UnprocessableEntityException(`Error sending email`)
        }
    }

    async verifyAuthLink(loginKey: string): Promise<UserEntity> {
        let loginKeyEntity: EmailLoginKeyEntity
        try {
            loginKeyEntity = await this.emailLoginKeyService.findByLoginKey(loginKey)
            if (!loginKeyEntity) {
                throw new Error("User with login key not found")
            }
        } catch (err) {
            this.logger.error(`sendAuthEmail: login key is not in database: ${loginKey}`, err, this.context)
            throw new UnprocessableEntityException(`loginKey invalid`)
        }

        const keyGenerationTime = loginKeyEntity.keyGenerationDate.getTime()

        //login links last for 10 mins
        const expirationTime = 1000 * 60 * 10
        const timeDiff = new Date().getTime() - keyGenerationTime
        if (timeDiff > expirationTime) {
            this.logger.error(`verifyAuthLink: loginKey has expired it has been ${timeDiff}ms`, null, this.context)
            throw new UnprocessableEntityException(`loginKey expired`)
        }

        //invalidate login key
        try {
            await this.emailLoginKeyService.spendLoginKey(loginKey)
        } catch (err) {
            this.logger.error(`verifyAuthLink: failed to invalidate login key`, err, this.context)
            throw new UnprocessableEntityException(`loginKey failure`)
        }

        const user = this.userService.createEmail(loginKeyEntity.email.toLowerCase().trim())
        return user
    }
}

function makeUuid() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return s4() + s4() + '' + s4() + '' + s4() + '' + s4() + '' + s4() + s4() + s4(); }