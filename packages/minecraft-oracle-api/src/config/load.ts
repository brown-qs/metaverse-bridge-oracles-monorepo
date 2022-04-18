import { ConfigError } from './errors';
import { ethers } from 'ethers';
import { ALLOWED_CHAIN_IDS } from './constants';
import { privateKeyToEthereumKeys } from '../crypto';

export const loadChain = async () => {
    const rpcUrl = process.env.RPC_URL.trim();

    if (!rpcUrl) {
        throw new Error(`RPC URL was not received`);
    }

    let chainIds: number[] = ALLOWED_CHAIN_IDS
    let chainId: number

    try {
        chainId = await (await ethers.getDefaultProvider(rpcUrl).getNetwork()).chainId
    } catch (e: any) {
        throw new Error(`Error reaching RPC node: ${e}`);
    }
    
    if (!ALLOWED_CHAIN_IDS.includes(chainId)) {
        throw new Error(`Chain ID ${chainId} is not permitted.`);
    }
    
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
            chainIds,
            chainId,
            rpc: rpcUrl,
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
            confirmWatchIntervalMs: process.env.CONFIRM_WATCH_INTERVAL_MS
        }
    };
};

export const loadAll = async () => {
    return { ...loadEnv(), ...(await loadChain()) };
};
