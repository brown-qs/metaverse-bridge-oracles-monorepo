import Joi from 'joi';

export const envValidationSchema = () => {
    return Joi.object({
        // MODE
        MODE: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        LOG_LEVEL: Joi.string()
            .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
            .default('info'),
        // CHAIN
        DEFAULT_CHAIN_ID: Joi.number().default(1285),
        ORACLE_PRIVATE_KEY: Joi.string()
            .regex(/^(0x)?[0-9a-fA-f]+$/i)
            .required(),
        // SERVER
        SERVER_PORT: Joi.string().default('3030'),
        SERVER_HOST: Joi.string().default('localhost'),
        SERVER_SCHEME: Joi.string().default('http'),
        SERVER_REDIRECT_URL: Joi.string().required(),
        CONFIRM_WATCH_INTERVAL_MS: Joi.number().default(60000),
        CONFIRM_WATCH_DISABLED: Joi.boolean().default(false),
        // REDIRECT
        AUTH_REDIRECT_URL: Joi.string().default('http://localhost:3000/login'),
        // APP
        AZURE_APP_ID: Joi.string().required(),
        AZURE_APP_SECRET: Joi.string().required(),
        // TYPEORM
        TYPEORM_HOST: Joi.string().default('localhost'),
        TYPEORM_USERNAME: Joi.string().default('postgres'),
        TYPEORM_PASSWORD: Joi.string().default('postgres'),
        TYPEORM_DATABASE: Joi.string().default('msama-mc-bridge-db'),
        TYPEORM_PORT: Joi.number().default(5432),
        TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
        TYPEORM_LOGGING: Joi.boolean().default(true),
        TYPEORM_CONNECTION: Joi.string().default('postgres'),
        // REDIS
        REDIS_HOST: Joi.string().default('127.0.0.1'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().default('myPassword1111'),
        REDIS_KEY_EXPIRE_AFTER_S: Joi.number().default(900),
        REDIS_KEY_PREFIX: Joi.string().default('msama'),
        REDIS_NAME: Joi.string().default('MoonsamaMinecraftBridge'),
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_STRING: Joi.string().default('30m'),
        // S3
        S3_ACCESS_KEY_ID: Joi.string().required(),
        S3_SECRET_ACCESS_KEY: Joi.string().required(),
        S3_REGION: Joi.string().optional().default('eu-west-1'),
        S3_BUCKET: Joi.string().optional().default('moonsama-static-origin'),
        // KILT
        KILT_WSS_ADDRESS: Joi.string().required(),
        KILT_VERIFIER_MNEMONIC: Joi.string().required(),
        KILT_VERIFIER_DID_URI: Joi.string().required(),
        KILT_DAPP_NAME: Joi.string().required(),
        KILT_CTYPE_NAME: Joi.string().required(),
        KILT_CTYPE_HASH: Joi.string().required(),

        // RECAPTCHA
        RECAPTCHA_SITEKEY: Joi.string().required(),
        RECAPTCHA_SECRETKEY: Joi.string().required(),
        // COMPOSITE
        COMPOSITE_URI_PREFIX: Joi.string().optional().default('https://static.moonsama.com'),
        COMPOSITE_URI_POSTFIX: Joi.string().optional().default('.png'),
        COMPOSITE_MEDIA_KEY_PREFIX: Joi.string().optional().default('composite/media'),
        COMPOSITE_METADATA_PUBLIC_PATH: Joi.string().optional().default('http://localhost:3030/api/v1/composite/metadata'),
        OUTBOUND_PROXY_HOST: Joi.string().default(""),
        OUTBOUND_PROXY_PORT: Joi.string().default("20000"),
        OUTBOUND_PROXY_USERNAME: Joi.string().default(""),
        OUTBOUND_PROXY_PASSWORD: Joi.string().default(""),

        FRONTEND_URL: Joi.string().required(),

        // MAILGUN
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_EMAIL: Joi.string().email().required(),
        MAILGUN_API_URL: Joi.string().required()

    });
};
