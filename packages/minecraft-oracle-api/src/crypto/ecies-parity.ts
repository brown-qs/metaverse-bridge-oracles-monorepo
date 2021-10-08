import { randomBytes } from 'crypto';
import { curve as crv } from 'elliptic';

import { CURVE } from './curve';

import {
    derive,
    toKeyPair,
    aes128CtrEncrypt,
    aes128CtrDecrypt,
    assert,
    toPublicKey,
    toSecp256k1CompressedPublicKey,
    privateKeyVerify,
    randomKeyPair,
    toPrivateKey
} from './common';
import { toSha256, toHmacSha256 } from './hash';
import { equalConstTime, PrivateKey } from './utils';

interface EciesOpts {
    iv?: Buffer;
    ephemPrivateKey?: Buffer;
}

const PARITY_DEFAULT_HMAC = Buffer.from([0, 0]);

/**
 * Parity's own kdf implementation
 *
 * @param secret Private piece of data
 * @param outputLength Desired output length
 */
export const kdf = (secret: Buffer, outputLength: number): Buffer => {
    let ctr = 1;
    let written = 0;
    let result = Buffer.from('');
    while (written < outputLength) {
        const ctrs = Buffer.from([ctr >> 24, ctr >> 16, ctr >> 8, ctr]);
        const hashResult = toSha256(Buffer.concat([ctrs, secret]));
        result = Buffer.concat([result, hashResult]);
        written += 32;
        ctr += 1;
    }
    return result;
};

/**
 * ECIES on curve25519 encrypt function
 *
 * @param message Data to encrypt
 * @param publicKeyTo Public key of recipient
 * @param eciesOpts ECIES options object
 * @returns Encrypted data
 */
export const encrypt25519 = async (
    message: Buffer,
    publicKeyTo: Buffer | crv.base.BasePoint,
    eciesOpts: EciesOpts
): Promise<Buffer> => {
    const ephemSeed = eciesOpts?.ephemPrivateKey || randomBytes(32);
    const ephemKey = toKeyPair(ephemSeed, CURVE.CURVE25519);
    const ephemPublicKey = Buffer.from(ephemKey.getPublic().encode('hex', false), 'hex');
    const sharedPx = derive(ephemKey.getPrivate().toBuffer('be', 32), publicKeyTo);
    const hash = kdf(sharedPx, 32);
    const iv = eciesOpts?.iv || randomBytes(16);
    const encryptionKey = hash.slice(0, 16);
    const macKey = toSha256(hash.slice(16));
    const ciphertext = aes128CtrEncrypt(iv, encryptionKey, message);
    const dataToMac = Buffer.concat([iv, ciphertext, Buffer.from([0, 0])]);
    const HMAC = toHmacSha256(macKey, dataToMac);
    return Buffer.concat([ephemPublicKey, iv, ciphertext, HMAC]);
};

/**
 * ECIES on curve25519 decrypt function
 *
 * @param encryptedData Encrypted data
 * @param privateKey Private key for decrypting
 * @returns Decrypted message
 */
export const decrypt25519 = async (
    encryptedData: Buffer,
    privateKey: PrivateKey
): Promise<Buffer> => {
    const metaLength = 32 + 16 + 32;
    assert(
        encryptedData.length > metaLength,
        `Invalid Ciphertext. Data is too small (${encryptedData.length})`
    );
    const ephemPublicKey = encryptedData.slice(0, 32);
    const cipherTextLength = encryptedData.length - metaLength;
    const iv = encryptedData.slice(32, 32 + 16);
    const cipherAndIv = encryptedData.slice(32, 32 + 16 + cipherTextLength);
    const ciphertext = cipherAndIv.slice(16);
    const msgMac = encryptedData.slice(32 + 16 + cipherTextLength);
    const px = derive(privateKey, ephemPublicKey, CURVE.CURVE25519);
    const hash = kdf(px, 32);
    const encryptionKey = hash.slice(0, 16);
    const macKey = toSha256(hash.slice(16));
    const dataToMac = Buffer.concat([cipherAndIv, Buffer.from([0, 0])]);
    const currentHMAC = toHmacSha256(macKey, dataToMac);
    assert(equalConstTime(currentHMAC, msgMac), 'Incorrect MAC');
    const plainText = aes128CtrDecrypt(iv, encryptionKey, ciphertext);
    return Buffer.from(new Uint8Array(plainText));
};

/**
 * ECIES on secp256k1 encrypt function
 *
 * @param message Data to encrypt
 * @param publicKeyTo Public key of recipient
 * @param eciesOpts ECIES options object
 * @returns Encrypted data
 */
export const encryptSECP256K1 = async (
    message: Buffer,
    publicKeyTo: Buffer | crv.base.BasePoint,
    eciesOpts?: EciesOpts
): Promise<Buffer> => {
    const ephemPrivateKey = eciesOpts?.ephemPrivateKey || randomBytes(32);
    const ephemPublicKey = Buffer.from(toPublicKey(ephemPrivateKey).encode('hex', false), 'hex');
    const sharedPx = derive(ephemPrivateKey, publicKeyTo);
    const hash = kdf(sharedPx, 32);
    const iv = eciesOpts?.iv || randomBytes(16);
    const encryptionKey = hash.slice(0, 16);
    const macKey = toSha256(hash.slice(16));
    const ciphertext = aes128CtrEncrypt(iv, encryptionKey, message);
    const dataToMac = Buffer.concat([iv, ciphertext, PARITY_DEFAULT_HMAC]);
    const HMAC = toHmacSha256(macKey, dataToMac);
    return Buffer.concat([ephemPublicKey, iv, ciphertext, HMAC]);
};

/**
 * ECIES on secp256k1 decrypt function
 *
 * @param encryptedData Encrypted data
 * @param privateKey Private key for decrypting
 * @returns Decrypted message
 */
export const decryptSECP256K1 = async (
    encryptedData: Buffer,
    privateKey: PrivateKey
): Promise<Buffer> => {
    const metaLength = 1 + 64 + 16 + 32;
    assert(
        encryptedData.length > metaLength,
        `Invalid Ciphertext. Data is too small (${encryptedData.length})`
    );
    assert(encryptedData[0] >= 2 && encryptedData[0] <= 4, 'Not valid ciphertext.');
    // deserialise
    const ephemPublicKey = encryptedData.slice(0, 65);
    const cipherTextLength = encryptedData.length - metaLength;
    const iv = encryptedData.slice(65, 65 + 16);
    const cipherAndIv = encryptedData.slice(65, 65 + 16 + cipherTextLength);
    const ciphertext = cipherAndIv.slice(16);
    const msgMac = encryptedData.slice(65 + 16 + cipherTextLength);
    // check HMAC
    const px = derive(privateKey, ephemPublicKey);
    const hash = kdf(px, 32);
    const encryptionKey = hash.slice(0, 16);
    const macKey = toSha256(hash.slice(16));
    const dataToMac = Buffer.concat([cipherAndIv, PARITY_DEFAULT_HMAC]);
    const currentHMAC = toHmacSha256(macKey, dataToMac);
    assert(equalConstTime(currentHMAC, msgMac), `Incorrect MAC ${currentHMAC} vs ${msgMac}`);
    // decrypt message
    const plainText = aes128CtrDecrypt(iv, encryptionKey, ciphertext);
    return Buffer.from(new Uint8Array(plainText));
};

const eciesMethods = {
    0: {
        encrypt: encryptSECP256K1,
        decrypt: decryptSECP256K1
    },
    1: {
        encrypt: encrypt25519,
        decrypt: decrypt25519
    }
};

/**
 * High level encrypt function call to abstract over
 * implementations.
 */
export const encrypt = async (
    message: Buffer,
    publicKeyTo: Buffer | crv.base.BasePoint,
    curve: CURVE = CURVE.SECP256K1,
    eciesOpts?: EciesOpts
): Promise<Buffer> => {
    return eciesMethods[curve].encrypt(message, publicKeyTo, eciesOpts);
};

/**
 * High level decrypt function call to abstract over
 * implementations.
 */
export const decrypt = async (
    encryptedData: Buffer,
    privateKey: PrivateKey,
    curve: CURVE = CURVE.SECP256K1
): Promise<Buffer> => {
    return eciesMethods[curve].decrypt(encryptedData, privateKey);
};

export {
    derive,
    PrivateKey,
    privateKeyVerify,
    randomKeyPair,
    toKeyPair,
    toSecp256k1CompressedPublicKey,
    toPrivateKey,
    toPublicKey
};
