import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ProviderToken } from './token';
import S3 from 'aws-sdk/clients/s3';

export const S3ClientProvider: FactoryProvider<S3> = {
    provide: ProviderToken.S3_CLIENT,
    useFactory: (configService: ConfigService) => {
        const accessKeyId = configService.get<string>('s3.accessKeyId')
        const secretAccessKey = configService.get<string>('s3.secretAccessKey')
        const region = configService.get<string>('s3.region')

        const s3 = new S3({
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            region
        })
        return s3
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};