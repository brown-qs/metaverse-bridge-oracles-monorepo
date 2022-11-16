import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import axios from "axios"
@Injectable()
export class CaptchaService {
    private readonly context: string;
    constructor(
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
    ) {
        this.context = CaptchaService.name
    }
    public async validateCaptcha(gRecaptchaResponse: string) {

        const recaptchaSecret = this.configService.get<string>('recaptcha.secret')

        if (recaptchaSecret === "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe") {
            this.logger.warn(`validateCaptcha:: using test recaptcha secret! Don't use in production!`, this.context)
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
                this.logger.debug(`validateCaptcha:: captcha did verify success=false data: ${JSON.stringify(data)}`, this.context)
                throw new BadRequestException(`Invalid captcha`)
            }
        } catch (err) {
            this.logger.error(`validateCaptcha:: captcha did verify ${String(err)}`, err, this.context)
            throw new BadRequestException(`Invalid captcha`)
        }
    }
}
