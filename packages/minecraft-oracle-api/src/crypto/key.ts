import * as curve from './curve'
import * as eciesParity from './ecies-parity';
import * as hash from './hash';
import { ensure0x, isHexStr, remove0x, toBuffer } from '../utils';
import { ec as EC } from 'elliptic';
import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import bs58 from 'bs58';

export type StringOrBuffer = string | Buffer;

export interface IKeyFormat {
    privateKey: string;
    publicKey?: string;
    address?: string;
    export?: string;
    mnemonic?: string;
}

// if unknown private key
export interface IPublicKeyFormat {
    publicKey: string;
    compressedPublicKey: string;
    address: string;
}

export enum AddressFormat {
    BITCOIN = 'BITCOIN',
    ETHEREUM = 'ETHEREUM'
}

/**
 * Calculates Ethereum account components, like address and public key from a private key.
 *
 * @param key Ethereum (secp256k1 curve) private key.
 * @returns The private key, public key, address, and the export string of an Ethereum account.
 */
export const privateKeyToEthereumKeys = (key: EC.KeyPair | string | Buffer): IKeyFormat => {
    // input key is a buffer
    if (Buffer.isBuffer(key)) {
        const pubkey = eciesParity.toPublicKey(key);
        return {
            privateKey: ensure0x(key.toString('hex').padStart(64, '0')).toLowerCase(),
            publicKey: ensure0x(pubkey.encode('hex', false).slice(2).toLowerCase()),
            address: ensure0x(
                hash
                    .toKeccak256(pubkey.encode('hex', false).slice(2))
                    .toString('hex')
                    .slice(-40)
                    .toLowerCase()
            ),
            export: key.toString('hex').padStart(64, '0').toUpperCase()
        };
    }

    // input key is a hex string
    if (typeof key === 'string') {
        if (remove0x(key).length !== 64) {
            throw new Error('Private key length is incorrect');
        }
        const pubkey = eciesParity.toPublicKey(Buffer.from(remove0x(key), 'hex'));
        return {
            privateKey: ensure0x(key).toLowerCase(),
            publicKey: ensure0x(pubkey.encode('hex', false).slice(2).toLowerCase()),
            address: ensure0x(
                hash
                    .toKeccak256(pubkey.encode('hex', false).slice(2))
                    .toString('hex')
                    .slice(-40)
                    .toLowerCase()
            ),
            export: remove0x(key).toUpperCase()
        };
    }

    // input key is a keypair
    return {
        privateKey: ensure0x(key.getPrivate().toString(16, 32)).toLowerCase(),
        publicKey: ensure0x(
            eciesParity
                .toPublicKey(key.getPrivate().toBuffer('be', 32))
                .encode('hex', false)
                .slice(2)
                .toLowerCase()
        ),
        address: ensure0x(
            hash
                .toKeccak256(Buffer.from(key.getPublic().encode('hex', false).slice(2), 'hex'))
                .toString('hex')
                .slice(-40)
                .toLowerCase()
        ),
        export: key.getPrivate().toString(16, 32).toUpperCase()
    };
};

/**
 * Calculates Ethereum account components from an account key.
 * Account key is used as entropy for bip39 seed word generation.
 *
 * @param accountKey Hex-encoded 32 byte string.
 * @returns The private key, public key, address, export string and mnemonic of an Ethereum account.
 */
export const accountKeyToEthereumKeys = (accountKey: string): IKeyFormat => {
    if (remove0x(accountKey).length !== 64) {
        throw new Error('Account key length is incorrect');
    }

    if (!isHexStr(accountKey)) {
        throw new Error('Account key is not hex');
    }

    // we pass buffer otehrwise bip39 lib interprets the hex string as utf8
    const mnemonic = bip39.entropyToMnemonic(toBuffer(accountKey));

    // we use the default ethereum derivation path with account 0
    const ethWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");
    return {
        ...privateKeyToEthereumKeys(ethWallet.privateKey),
        mnemonic
    };
};

export const randomEthereumKey = async (): Promise<IKeyFormat> => {
    const keyPair = await eciesParity.randomKeyPair(curve.CURVE.SECP256K1);
    return privateKeyToEthereumKeys(keyPair);
};

export const decryptSSKey = async (
    encryptedSSKey: string | Buffer,
    privateKey: eciesParity.PrivateKey
): Promise<Buffer> => {
    return eciesParity.decrypt(toBuffer(encryptedSSKey), privateKey);
};

/**
 * Returns a special private key to control a user Key from the secret store.
 *
 * @param privateInputs Private ingredients to create the control key from.
 * @returns Control Key for a user key, as a hex string without 0x prefix.
 * Usually it is used to create or fetch a key from the secret store.
 */
export const privateInputsToUserControlKey = (privateInputs: any[]): string => {
    return eciesParity
        .toPrivateKey(hash.allToSha3_256(privateInputs))
        .toString('hex')
        .padStart(64, '0');
};

/**
 * Returns a special private key to control a wallet Key from the secret store.
 *
 * @param userKeyPrivate The 512 bit user key (decrypted), or a 256 bit private key derived from the user key.
 * If a 512 bit user key is passed, it's fit to the secp256k1 curve and a private key is derived.
 * @param walletNumber Number of the wallet. Must be >= 0.
 * @returns Control Key for a wallet key, as a hex string without 0x prefix.
 * Usually it is used to create or fetch a key from the secret store.
 */
export const userKeyToWalletControlKey = (
    userKeyPrivate: StringOrBuffer,
    walletNumber: number
): string => {
    const bitLength = Buffer.isBuffer(userKeyPrivate)
        ? userKeyPrivate.length * 8
        : remove0x(userKeyPrivate).length * 4;
    const userAccountPrivateKey =
        bitLength !== 256
            ? eciesParity.toPrivateKey(userKeyPrivate)
            : privateKeyToEthereumKeys(userKeyPrivate).privateKey;
    return eciesParity
        .toPrivateKey(hash.allToSha3_256([userAccountPrivateKey, walletNumber]))
        .toString('hex')
        .padStart(64, '0');
};

/**
 * Returns an Ethereum account private key.
 *
 * @param walletKeyPrivate The 512 bit wallet key (decrypted), or a 256 bit private key derived from the wallet key.
 * If a 512 bit wallet key is passed, it's fit to the secp256k1 curve and a private key is derived.
 * @param accountNumber Number of the account. Must be >= 0.
 * @returns Ethereum address private key, as a hex string without 0x prefix.
 */
export const walletKeyToAccountKey = (
    walletKeyPrivate: StringOrBuffer,
    accountNumber: number
): string => {
    const bitLength = Buffer.isBuffer(walletKeyPrivate)
        ? walletKeyPrivate.length * 8
        : remove0x(walletKeyPrivate).length * 4;
    const walletAccountPrivateKey =
        bitLength !== 256
            ? eciesParity.toPrivateKey(walletKeyPrivate)
            : privateKeyToEthereumKeys(walletKeyPrivate).privateKey;
    return eciesParity
        .toPrivateKey(hash.allToSha3_256([walletAccountPrivateKey, accountNumber]))
        .toString('hex')
        .padStart(64, '0');
};

/**
 * Allows to generate multiple Ethereum accounts in one go, by specifying a range of account numbers.
 *
 * @param walletKeyPrivate The 512 bit wallet key (decrypted), or a 256 bit private key derived from the wallet key.
 * If a 512 bit wallet key is passed, it's fit to the secp256k1 curve and a private key is derived.
 * @param startOrLength Either a length of how many accounts to generate with account numbering starting from 0,
 * or start of a range, given by a "from"-"to" account numbers.
 * @param end If you gave a range, this is the account number as upper bound.
 * @returns List of Ethereum address private keys, as a hex strings without 0x prefix.
 */
export const walletKeyToAccountKeys = (
    walletKeyPrivate: StringOrBuffer,
    startOrLength: number,
    end?: number
): string[] => {
    const bitLength = Buffer.isBuffer(walletKeyPrivate)
        ? walletKeyPrivate.length * 8
        : remove0x(walletKeyPrivate).length * 4;
    const walletAccountPrivateKey =
        bitLength !== 256
            ? eciesParity.toPrivateKey(walletKeyPrivate)
            : privateKeyToEthereumKeys(walletKeyPrivate).privateKey;
    if (!end) {
        return Array.from({ length: startOrLength }, (_, i) =>
            walletKeyToAccountKey(walletAccountPrivateKey, i)
        );
    }
    if (startOrLength >= end) {
        throw new Error(`Range is incorrect (start:${startOrLength}, end:${end})`);
    }
    return Array.from({ length: end - startOrLength }, (_, i) =>
        walletKeyToAccountKey(walletAccountPrivateKey, startOrLength + i)
    );
};

/**
 * Converts secp256k1 public key to address on bitcoin mainnet
 *
 * @param publicKey uncompressed public key (not 0x prefixed)
 */
export const publicKeyToBitcoinAddress = (publicKey: StringOrBuffer): string => {
    const publicKeyBuf = toBuffer(publicKey);
    const compressedPublicKeyBuf = eciesParity.toSecp256k1CompressedPublicKey(publicKeyBuf);
    const ripemdDigest = hash.toRIPEMD160(hash.toSha256(compressedPublicKeyBuf));
    const network = toBuffer('00');
    const networkedRipemdDigest = Buffer.concat([network, ripemdDigest]);
    const checksum = hash.toSha256(hash.toSha256(networkedRipemdDigest)).slice(0, 4);
    const p2pkh = Buffer.concat([networkedRipemdDigest, checksum]);
    const address = bs58.encode(p2pkh);
    return address;
};

/**
 * Converts secp256k1 public key to address on ethereum chains
 *
 * @param publicKey uncompressed public key (not 0x prefixed)
 */
export const publicKeyToEthereumAddress = (publicKey: StringOrBuffer): string => {
    const publicKeyBuf = toBuffer(publicKey).slice(1);
    const address = hash.toKeccak256(publicKeyBuf).slice(-20);
    return ensure0x(address.toString('hex'));
};

/**
 * Converts secp256k1 public key to address on chosen network
 *
 * @param publicKey uncompressed public key (not 0x prefixed)
 * @param format the network address format
 */
export const publicKeyToAddress = (
    publicKey: string,
    format?: AddressFormat
): string | undefined => {
    if (!format) {
        return undefined;
    }
    switch (format) {
        case AddressFormat.BITCOIN:
            return publicKeyToBitcoinAddress(publicKey);
        default:
            return publicKeyToEthereumAddress(publicKey);
    }
};
