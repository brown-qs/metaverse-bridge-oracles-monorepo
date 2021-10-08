import { ec as EC } from 'elliptic';

/**
 * Removes leading 0x from a string if any
 */
export const remove0x = (str: string): string => {
    return str.startsWith('0x') ? str.slice(2) : `${str}`;
};

/**
 * Ensures that string has a leading 0x if needed
 */
export const ensure0x = (str: string): string => {
    return str.startsWith('0x') ? `${str}` : `0x${str}`;
};

/**
 * Checks if string is a hex string
 */
export const isHexStr = (str: string): boolean => {
    return Boolean(str.match(/^(0x)?[0-9a-f]+$/i));
};

export type BufferInput =
    | number
    | string
    | number[]
    | Uint8Array
    | Buffer
    | ArrayBuffer
    | SharedArrayBuffer
    | { valueOf(): string | object }
    | { [Symbol.toPrimitive](hint: 'string'): string };

export interface IToBufferOptions {
    stringToHexIfPossible?: boolean;
    numberToHexIfPossible?: boolean;
    bufferParams?: any[];
}

/**
 * Appends a leading 0 to a 1 digit hex-string number.
 * A byte is 2 digit hex number, so 1 digit
 * hex numbers need to be padded.
 */
const padSmallHex = (hex: string): string => {
    return hex.length === 1 ? `0${hex}` : hex;
};

/**
 * Converts unknown data to Buffer type.
 *
 * 1. Buffers inputs are left intact.
 * 2. Strings are hex encoded if they are hex strings by default.
 * 3. Numbers are utf8 encoded by default.
 * 4. Buffer.from is called on types not fitting into the previous categories
 *
 * Options object can be passed to change default settings
 */
export const toBuffer = (
    data: BufferInput,
    {
        stringToHexIfPossible = true,
        numberToHexIfPossible = false,
        bufferParams = []
    }: IToBufferOptions = {}
): Buffer => {
    if (Buffer.isBuffer(data)) {
        return Buffer.from(data, ...bufferParams);
    }
    if (typeof data === 'string' && stringToHexIfPossible && isHexStr(data)) {
        const naked = remove0x(data);
        return Buffer.from(padSmallHex(naked), 'hex');
    }
    if (typeof data === 'number') {
        return numberToHexIfPossible
            ? Buffer.from(padSmallHex(data.toString(16)), 'hex')
            : Buffer.from(data.toString(10), 'utf-8');
    }
    return Buffer.from(data as any, ...bufferParams);
};

/**
 * Converts Buffer to a string
 */
export const bufferToHexString = (data: Buffer, ensure0xPrefix = false): string => {
    return ensure0xPrefix ? ensure0x(data.toString('hex')) : data.toString('hex');
};

/**
 * Compares 2 equal length Buffers in const time
 */
export const equalConstTime = (b1: Buffer, b2: Buffer) => {
    if (b1.length !== b2.length) {
        return false;
    }
    let res = 0;
    for (let i = 0; i < b1.length; i++) {
        res |= b1[i] ^ b2[i]; // jshint ignore:line
    }
    return res === 0;
};

export type PrivateKey = string | number[] | Uint8Array | Buffer | EC.KeyPair;

export const formatPrivateKey = (key: PrivateKey): number[] | Uint8Array | Buffer | EC.KeyPair => {
    if (typeof key === 'string' || key instanceof String) {
        return toBuffer(key);
    }
    return key;
};