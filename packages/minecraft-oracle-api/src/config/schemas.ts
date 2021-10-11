import Joi from 'joi';

export const envValidationSchema = () => {
    return Joi.object({
        // MODE
        MODE: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        LOG_LEVEL: Joi.string()
            .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
            .default('info'),
        // CHAIN
        RPC_URL: Joi.string().required(),
        ORACLE_PRIVATE_KEY: Joi.string()
            .regex(/^(0x)?[0-9a-fA-f]+$/i)
            .required(),
        // SERVER
        SERVER_PORT: Joi.string().default('3030'),
        SERVER_HOST: Joi.string().default('localhost'),
        SERVER_SCHEME: Joi.string().default('http'), 
        // REDIRECT
        AUTH_REDIRECT_URL: Joi.string().default('http://localhost:3000/login'),
        // APP
        AZURE_APP_ID: Joi.string().required(),
        AZURE_APP_SECRET: Joi.string().required(),
        // DB
        DB_HOST: Joi.string().default('localhost'),
        DB_USER: Joi.string().default('postgres'),
        DB_PASSWORD: Joi.string().default('postgres'),
        DB_NAME: Joi.string().default('msama-mc-bridge-db'),
        DB_PORT: Joi.number().default(5432),
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
    });
};
