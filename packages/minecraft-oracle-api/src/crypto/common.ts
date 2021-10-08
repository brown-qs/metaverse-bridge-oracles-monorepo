import { BinaryLike, createCipheriv, createDecipheriv, CipherKey, randomBytes } from 'crypto';
import { ec as EC, curve as crv } from 'elliptic';
import BN from 'bn.js';
import { sha3_256 } from 'js-sha3';

import { CURVE, curveMap } from './curve';
import { formatPrivateKey, PrivateKey, toBuffer } from './utils';

/**
 * Checks whether a pivate key is valid on the chosen curve
 *
 * @param privateKey The bytes-like private key
 * @param curve The chosen curve
 * @returns Whether the key is valid
 */
export const privateKeyVerify = (
    privateKey: number | string | number[] | Buffer,
    curve: CURVE = CURVE.SECP256K1
): boolean => {
    const bn = new BN(privateKey);
    return bn.cmp(curveMap[curve].curve.n) < 0 && !bn.isZero();
};

/**
 * Hashes data to the chosen curve
 *
 * @param data Input bytes-like data
 * @param curve Chosen curve
 * @returns A private key on the chosen curve, created from the input data
 */
export const toPrivateKey = (data: string | Buffer, curve: CURVE = CURVE.SECP256K1): Buffer => {
    const input = toBuffer(data);
    let res = Buffer.from('');
    do {
        const hash = sha3_256.create();
        hash.update(Buffer.concat([input, res]));
        res = Buffer.from(hash.digest());
    } while (!privateKeyVerify(res, curve));
    return res;
};

export const assert = (condition: boolean, message: string) => {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
};

/**
 * Calculates the public key from a private key
 */
export const toPublicKey = (privateKey: PrivateKey, curve: CURVE = CURVE.SECP256K1) => {
    return curveMap[curve].keyFromPrivate(formatPrivateKey(privateKey)).getPublic();
};

/**
 * Takes an uncompressed secp256k1 public key and compresses it
 *
 * @param publicKey the uncompressed secp2556k1 public key
 * @param enc choose encoding for output
 */
export const toSecp256k1CompressedPublicKey = (publicKey: string | Buffer, enc?: 'hex') => {
    const publicKeyBuf = toBuffer(publicKey);
    if (publicKeyBuf.length !== 65) {
        throw new Error('Invalid key length. Expected 65 bytes.');
    }
    const keyCoordinates = {
        x: publicKeyBuf.slice(1, 33),
        y: publicKeyBuf.slice(33, 65)
    };
    const isEven = parseInt(keyCoordinates.y.slice(31).toString('hex')[1], 10) % 2 === 0;
    const prefix = isEven ? '02' : '03';
    if (enc) {
        return `${prefix}${keyCoordinates.x.toString(enc)}`;
    }
    return Buffer.concat([toBuffer(prefix), keyCoordinates.x]);
};

/**
 *
 * Calculates a private-public key pair from some bytes-like data
 *
 * @param data Bytes-like data that will be hashed to a curve
 * @param curve The chosen curve
 * @returns The key pair object
 */
export const toKeyPair = (data: string | Buffer, curve: CURVE = CURVE.SECP256K1): EC.KeyPair => {
    const pKey = toPrivateKey(data, curve);
    return curveMap[curve].keyFromPrivate(pKey);
};

/**
 * Generates a random private-public key pair
 *
 * @param curve The chosen curve
 * @returns The key pair object
 */
export const randomKeyPair = async (curve: CURVE = CURVE.SECP256K1): Promise<EC.KeyPair> => {
    let pKey;
    do {
        pKey = randomBytes(32);
    } while (!privateKeyVerify(pKey, curve));
    return curveMap[curve].keyFromPrivate(pKey);
};

/**
 * Calculates an shared key from private key A and public key B (they do not belong together)
 *
 * @param privateKeyA The private key
 * @param publicKeyB The public key
 * @param curve The chosen curve
 * @returns The shared key
 */
export const derive = (
    privateKeyA: PrivateKey,
    publicKeyB:
        | crv.base.BasePoint
        | Uint8Array
        | Buffer
        | string
        | number[]
        | { x: string; y: string }
        | EC.KeyPair,
    curve: CURVE = CURVE.SECP256K1
): Buffer => {
    const keyA = curveMap[curve].keyFromPrivate(formatPrivateKey(privateKeyA));
    const shared = keyA.derive(
        publicKeyB instanceof crv.base.BasePoint
            ? publicKeyB
            : curveMap[curve].keyFromPublic(publicKeyB, 'hex').getPublic()
    );
    return shared.toBuffer('be', 32);
};

/**
 * AES-128-CTR stream cipher encryption
 *
 * @param iv Initialization vector
 * @param key Cipher key
 * @param plaintext Data to encrypt
 * @returns The encrypted data
 */
export const aes128CtrEncrypt = (iv: BinaryLike, key: CipherKey, plaintext: Buffer): Buffer => {
    const cipher = createCipheriv('aes-128-ctr', key, iv);
    const firstChunk = cipher.update(plaintext);
    const secondChunk = cipher.final();
    return Buffer.concat([firstChunk, secondChunk]);
};

/**
 * AES-128-CTR stream cipher decryption
 *
 * @param iv Initialization vector
 * @param key Cipher key
 * @param ciphertext Data to decrypt
 * @returns The decrypted data
 */
export const aes128CtrDecrypt = (iv: BinaryLike, key: CipherKey, ciphertext: Buffer): Buffer => {
    const cipher = createDecipheriv('aes-128-ctr', key, iv);
    const firstChunk = cipher.update(ciphertext);
    const secondChunk = cipher.final();
    return Buffer.concat([firstChunk, secondChunk]);
};
