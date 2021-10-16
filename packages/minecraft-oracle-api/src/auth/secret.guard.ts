import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { SecretService } from 'src/secret/secret.service';

@Injectable()
export class SharedSecretGuard implements CanActivate {

    private context: string

    constructor(
        private readonly secretService: SecretService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = SharedSecretGuard.name
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        //console.log(request)
        //console.log(request.headers)
        const secret: string = request.headers['AuthenticationHeader'] ?? request.headers['authenticationheader']
        
        //this.logger.debug('yolococo', this.context)
        //this.logger.debug(request.headers, this.context)
        //this.logger.debug(secret, this.context)
        if (!secret) {
            this.logger.debug('Shared secret was not found', this.context)
            return false
        }

        const entity = await this.secretService.findOne({secret})
        //console.log(entity)
        if (!entity) {
            this.logger.debug('Shared secret was invalid', this.context)
            return false;
        }

        return entity.secret === secret
    }
}