import { ConfigError } from './errors';
import { ethers } from 'ethers';
import { ALLOWED_CHAIN_IDS } from './constants';
import { privateKeyToEthereumKeys } from 'src/crypto';

export const loadChain = async () => {
    const rpcUrl = process.env.RPC_URL.trim();

    if (!rpcUrl) {
        throw new Error(`RPC URL was not received`);
    }

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
        db: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            name: process.env.DB_NAME
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
            port: process.env.SERVER_PORT
        }
    };
};

export const loadAll = async () => {
    return { ...loadEnv(), ...(await loadChain()) };
};
