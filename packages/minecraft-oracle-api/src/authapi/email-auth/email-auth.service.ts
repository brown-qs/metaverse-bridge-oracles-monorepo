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
import { EmailChangeService } from 'src/user/email-change/email-change.service';
@Injectable()
export class EmailAuthService {
    private readonly context: string;
    mailgun: any;
    mg: any;

    constructor(
        private userService: UserService,
        private emailLoginKeyService: EmailLoginKeyService,
        private emailChangeService: EmailChangeService,
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

    async sendAuthChangeEmail(userUuid: string, email: string, gRecaptchaResponse: string) {
        const recaptchaSecret = this.configService.get<string>('recaptcha.secret')

        if (recaptchaSecret === "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe") {
            this.logger.warn(`sendAuthChangeEmail: using test recaptcha secret! Don't use in production!`, this.context)
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
            this.logger.error(`sendAuthChangeEmail: captcha did verify`, err, this.context)
            throw new UnprocessableEntityException(`Invalid captcha`)
        }

        //check that email is not already in use
        const existingUserWithEmail = await this.userService.findByEmail(email.toLowerCase().trim())
        if (existingUserWithEmail) {
            //if email already exists just pretend like link is being sent
            this.logger.error(`sendAuthChangeEmail: uuid: ${userUuid} wants to change to email ${email}, but that email already exists`, this.context)
            return
        }

        const uuid = makeUuid() + makeUuid()
        try {
            await this.emailLoginKeyService.createChangeEmailLogin(userUuid, email.toLowerCase().trim(), uuid, new Date())
        } catch (err) {
            this.logger.error(`sendAuthChangeEmail: error upserting user into database: ${email}`, err, this.context)
            throw new UnprocessableEntityException(`Error upserting user into database`)
        }

        const loginLink = `${this.configService.get<string>('frontend.url')}/account/login/email/verify/${uuid}`
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY, url: 'https://api.eu.mailgun.net' });


        const mailOptions = {
            from: 'Moonsama <no-reply@sp.moonsama.com>',
            to: [email], // list of receivers
            subject: "Moonsama change email request", // Subject line
            text: `We received your request to change your email used with Moonsama.\n\nPlease use this single-use login link: ${loginLink}`, // plaintext body
        };

        // send mail with defined transport object
        let result
        try {
            result = await mg.messages.create('sp.moonsama.com', mailOptions)
            console.log(result);
        } catch (e) {
            console.log(e)
            this.logger.error(`sendAuthChangeEmail: unable to send email`, e, this.context)
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
            this.logger.error(`verifyAuthLink: login key is not in database: ${loginKey}`, err, this.context)
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

        let user
        if (loginKeyEntity.changeUuid) {
            let userBeforeUpdate
            try {
                userBeforeUpdate = await this.userService.findByUuid(loginKeyEntity.changeUuid)
            } catch (err) {
                this.logger.error(`verifyAuthLink: cant find user uuid ${loginKeyEntity.changeUuid} in database`, err, this.context)
                throw new UnprocessableEntityException(`Can't find existing user with uuid`)

            }
            const oldEmail = userBeforeUpdate.email.toLowerCase().trim()

            this.logger.debug(`verifyAuthLink: change uuid email ${loginKeyEntity.changeUuid} ${oldEmail} > ${loginKeyEntity.email}`, this.context)
            try {
                await this.userService.update({ uuid: loginKeyEntity.changeUuid }, { email: loginKeyEntity.email.toLowerCase().trim() })
            } catch (err) {
                this.logger.error(`sendAuthChangeEmail: failed to update uuid: ${loginKeyEntity.changeUuid} to email: ${loginKeyEntity.email.toLowerCase().trim()}`, err, this.context)
                throw new UnprocessableEntityException(`loginKey failure`)
            }

            //log email change
            await this.emailChangeService.create(loginKeyEntity.changeUuid, oldEmail, loginKeyEntity.email.toLowerCase().trim())
            user = await this.userService.findByEmail(loginKeyEntity.email.toLowerCase().trim())
        } else {
            user = await this.userService.createEmail(loginKeyEntity.email.toLowerCase().trim())
        }
        return user
    }
}

function makeUuid() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return s4() + s4() + '' + s4() + '' + s4() + '' + s4() + '' + s4() + s4() + s4(); }