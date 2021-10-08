import { randomBytes, createHash, createHmac, BinaryLike, KeyObject } from 'crypto';
import { sha3_256, keccak256 } from 'js-sha3';

import { toBuffer } from './utils';

export type BufferEncoding =
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'latin1'
    | 'binary'
    | 'hex';

/**
 * Generates random bytes of given length
 *
 * @param size Bytes length given
 * @param encoding Optional encoding for string return value
 * @returns The bytes generated
 */
export const rndBytes = async (
    size: number,
    encoding?: BufferEncoding
): Promise<Buffer | string> => {
    const rnd = randomBytes(size);
    return encoding ? rnd.toString(encoding) : rnd;
};

/**
 * SHA3-256 hash function
 */
export const toSha3_256 = (data: any): Buffer => {
    return Buffer.from(sha3_256.create().update(toBuffer(data)).digest());
};

/**
 *
 * SHA3-256 hashes together all elements of an input array.
 * Elements are appended together as bytes
 *
 * @param data Array-like data
 */
export const allToSha3_256 = (data: any): Buffer => {
    const buffers = data.map((x: any) => toBuffer(x));
    return Buffer.from(sha3_256.create().update(Buffer.concat(buffers)).digest());
};

/**
 * KECCAK-256 hash function
 */
export const toKeccak256 = (data: any): Buffer => {
    return Buffer.from(keccak256.create().update(toBuffer(data)).digest());
};

/**
 * SHA2-256 hash function
 */
export const toSha256 = (data: any): Buffer => {
    return createHash('sha256').update(toBuffer(data)).digest();
};

/**
 * Random SHA2-256 hash function
 */
export const randomSha256 = async (): Promise<Buffer> => {
    return createHash('sha256').update(randomBytes(32)).digest();
};

/**
 *
 * SHA2-256 hashes together all elements of an input array.
 * Elements are appended together as bytes
 *
 * @param data Array-like data
 */
export const allToSha256 = (...data: any): Buffer => {
    const buffers = data.map((x: any) => toBuffer(x));
    return createHash('sha256').update(Buffer.concat(buffers)).digest();
};

/**
 * HMAC-SHA2-256 function
 */
export const toHmacSha256 = (key: BinaryLike | KeyObject, data: BinaryLike): Buffer => {
    return createHmac('sha256', key).update(toBuffer(data)).digest();
};

/**
 *
 * HMAC-SHA2-256 hashes together all elements of an input array using a key.
 * Elements are appended together as bytes
 *
 * @param data Array-like data
 */
export const allToHmacSha256 = (key: BinaryLike | KeyObject, ...data: any[]): Buffer => {
    const buffers = data.map((x: any) => toBuffer(x));
    return createHmac('sha256', key).update(Buffer.concat(buffers)).digest();
};

/**
 * HMAC-SHA2-256 function with a random key option
 */
export const randomHmacSha256 = async (key?: BinaryLike | KeyObject): Promise<Buffer> => {
    const k = key ?? randomBytes(32);
    return createHmac('sha256', k).update(randomBytes(32)).digest();
};

/**
 * RIPEMD-160 hash function
 */
export const toRIPEMD160 = (data: any): Buffer => {
    return createHash('RIPEMD160').update(data).digest();
};
