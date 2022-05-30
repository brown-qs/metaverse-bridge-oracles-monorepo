import { ConfigError } from './errors';
import { privateKeyToEthereumKeys } from '../crypto';

export const loadChain = async () => {

    const pKeyString = process.env.ORACLE_PRIVATE_KEY.trim()

    if (!pKeyString) {
        throw new Error(`Please set a private key by env var: ORACLE_PRIVATE_KEY`);
    }

    const oracleKeys = privateKeyToEthereumKeys(pKeyString);

    if (!oracleKeys || !oracleKeys.address || !oracleKeys.privateKey) {
        throw new ConfigError('Oracle key is missing');
    }

    return {
        network: {
            defaultChainId: process.env.DEFAULT_CHAIN_ID,
            oracle: {
                privateKey: oracleKeys.privateKey,
                address: oracleKeys.address
            }
        }
    };
};

export const loadEnv = () => {
    return {
        mode: process.env.MODE,
        log: {
            level: process.env.LOG_LEVEL
        },
        typeorm: {
            host: process.env.TYPEORM_HOST,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            port: process.env.TYPEORM_PORT,
            database: process.env.TYPEORM_DATABASE,
            synchronize: process.env.TYPEORM_SYNCHRONIZE,
            logging: process.env.TYPEORM_LOGGING,
            connection: process.env.TYPEORM_CONNECTION
        },
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            expiration: process.env.REDIS_KEY_EXPIRE_AFTER_S,
            name: process.env.REDIS_NAME,
            keyPrefix: process.env.REDIS_KEY_PREFIX
        },
        server: {
            port: process.env.SERVER_PORT,
            host: process.env.SERVER_HOST,
            scheme: process.env.SERVER_SCHEME,
            redirect: process.env.SERVER_REDIRECT_URL
        },
        app: {
            id: process.env.AZURE_APP_ID,
            secret: process.env.AZURE_APP_SECRET,
            redirect: process.env.AUTH_REDIRECT_URL
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiration: process.env.JWT_EXPIRATION_STRING
        },
        cron: {
            confirmWatchIntervalMs: process.env.CONFIRM_WATCH_INTERVAL_MS,
            disabled: process.env.CONFIRM_WATCH_DISABLED === 'true'
        },
        s3: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION,
            bucket: process.env.S3_BUCKET
        },
        composite: {
            uriPrefix: process.env.COMPOSITE_URI_PREFIX,
            uriPostfix: process.env.COMPOSITE_URI_POSTFIX,
            mediaKeyPrefix: process.env.COMPOSITE_MEDIA_KEY_PREFIX,
            metadataPublicPath: process.env.COMPOSITE_METADATA_PUBLIC_PATH
        },
        outboundProxy: {
            enabled: process.env.OUTBOUND_PROXY,
            hostname: process.env.OUTBOUND_PROXY_HOST,
            port: process.env.OUTBOUND_PROXY_PORT,
            username: process.env.OUTBOUND_PROXY_USER,
            password: process.env.OUTBOUND_PROXY_PASSWORD
        }
    };
};

export const loadAll = async () => {
    return { ...loadEnv(), ...(await loadChain()) };
};
