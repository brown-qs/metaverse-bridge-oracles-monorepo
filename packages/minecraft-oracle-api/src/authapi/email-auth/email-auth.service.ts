import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import formData from "form-data"
import Mailgun from "mailgun.js"
import { EmailLoginKeyService } from '../../user/email-login-key/email-login-key.service';
import { EmailLoginKeyEntity } from '../../user/email-login-key/email-login-key.entity';
import { UserService } from '../../user/user/user.service';
import { UserEntity } from '../../user/user/user.entity';
import { EmailChangeService } from '../../user/email-change/email-change.service';
import { EmailService } from '../../user/email/email.service';
@Injectable()
export class EmailAuthService {
    private readonly context: string;
    mailgun: any;
    mg: any;

    constructor(
        private userService: UserService,
        private emailLoginKeyService: EmailLoginKeyService,
        private emailChangeService: EmailChangeService,
        private emailService: EmailService,
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




        const loginKey = makeLoginKey()
        try {
            const emEntity = await this.emailService.create(email.toLowerCase().trim())
            await this.emailLoginKeyService.createLogin(emEntity, loginKey, new Date())
        } catch (err) {
            console.log(err)
            this.logger.error(`sendAuthEmail: error upserting user into database: ${email}`, err, this.context)
            throw new UnprocessableEntityException(`Error upserting user into database`)
        }

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: this.configService.get<string>('mailgun.apiKey'), url: this.configService.get<string>('mailgun.apiUrl') });

        const mailOptions = {
            from: `Moonsama <${this.configService.get<string>('mailgun.email')}>`,
            to: [email], // list of receivers
            subject: "Your Moonsama single-use login code", // Subject line
            text: `We received your request for a single-use login code to use with Moonsama.\n\nYour single-use login code is: ${loginKey}`, // plaintext body
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

    async sendAuthChangeEmail(user: UserEntity, email: string, gRecaptchaResponse: string) {
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
        const emEntity = await this.emailService.create(email.toLowerCase().trim())
        const existingUserWithEmail = await this.userService.findByEmail(emEntity)
        if (existingUserWithEmail) {
            //if email already exists just pretend like link is being sent
            this.logger.error(`sendAuthChangeEmail: uuid: ${user.uuid} wants to change to email ${email}, but that email already exists`, this.context)
            return
        }

        const loginKey = makeLoginKey()
        try {
            await this.emailLoginKeyService.createChangeEmailLogin(user, emEntity, loginKey, new Date())
        } catch (err) {
            this.logger.error(`sendAuthChangeEmail: error upserting user into database: ${email}`, err, this.context)
            throw new UnprocessableEntityException(`Error upserting user into database`)
        }

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: this.configService.get<string>('mailgun.apiKey'), url: this.configService.get<string>('mailgun.apiUrl') });


        const mailOptions = {
            from: `Moonsama <${this.configService.get<string>('mailgun.email')}>`,
            to: [email], // list of receivers
            subject: "Moonsama change email request", // Subject line
            text: `We received your request to change your email used with Moonsama.\n\nPlease use this single-use login code: ${loginKey}`, // plaintext body
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

    async verifyLoginKey(loginKey: string): Promise<UserEntity> {
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

        this.logger.debug(`verifyAuthLink: user logged in ${timeDiff / 1000}s after login key was sent`, this.context)
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
        if (!!loginKeyEntity.changeUser) {
            user = loginKeyEntity.changeUser
            const oldEmailEntity = loginKeyEntity.changeUser.email

            this.logger.debug(`verifyAuthLink: change uuid email ${loginKeyEntity.changeUser.uuid} ${oldEmailEntity.email} > ${loginKeyEntity.email.email}`, this.context)
            try {
                await this.userService.update({ uuid: loginKeyEntity.changeUser.uuid }, { email: loginKeyEntity.email })
            } catch (err) {
                this.logger.error(`sendAuthChangeEmail: failed to update uuid: ${loginKeyEntity.changeUser.uuid} to email: ${loginKeyEntity.email.email.toLowerCase().trim()}`, err, this.context)
                throw new UnprocessableEntityException(`loginKey failure`)
            }

            //log email change
            await this.emailChangeService.create(loginKeyEntity.changeUser, loginKeyEntity.changeUser, oldEmailEntity, loginKeyEntity.email)

        } else {
            user = await this.userService.createEmail(loginKeyEntity.email)
        }
        return user
    }
}

function makeLoginKey() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return String(s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()).toLowerCase(); }