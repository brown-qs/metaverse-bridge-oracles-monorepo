import { ec as EC } from 'elliptic';
import BN from 'bn.js';
import { toBuffer, IToBufferOptions, ensure0x } from './utils';
import { CURVE, curveMap } from './curve';
import { formatPrivateKey, PrivateKey } from './utils';

export enum SignatureFormat {
    DER = 'DER',
    SERIALIZED = 'SERIALIZED',
    SERIALIZED_BITCOIN = 'SERIALIZED_BITCOIN'
}

export interface SignParams {
    curve?: CURVE;
    format?: SignatureFormat;
    asString?: boolean;
    ensure0xPrefix?: boolean;
}

/**
 * Signs data with a private key
 *
 * @param data Data to sign
 * @param privateKey Private key
 * @param param2 Parameters object for preferences
 * @returns The signature in the format selected
 */
export const sign = (
    data: any,
    privateKey: PrivateKey,
    {
        curve = CURVE.SECP256K1,
        format = SignatureFormat.SERIALIZED,
        asString = true,
        ensure0xPrefix = true
    }: SignParams = {}
): string | Buffer => {
    const sig = curveMap[curve].keyFromPrivate(formatPrivateKey(privateKey)).sign(toBuffer(data));
    if (format === 'DER') {
        if (asString) {
            return ensure0xPrefix ? ensure0x(sig.toDER('hex')) : sig.toDER('hex');
        }
        return Buffer.from(sig.toDER());
    }
    if (asString) {
        return ensure0xPrefix
            ? `0x${sig.r.toString(16, 64)}${sig.s.toString(16, 64)}${Buffer.alloc(
                  1,
                  sig.recoveryParam
              ).toString('hex')}`
            : `${sig.r.toString(16, 64)}${sig.s.toString(16, 64)}${Buffer.alloc(
                  1,
                  sig.recoveryParam
              ).toString('hex')}`;
    }

    return Buffer.concat([
        sig.r.toBuffer('be', 32),
        sig.s.toBuffer('be', 32),
        Buffer.alloc(1, sig.recoveryParam)
    ]);
};

/**
 * Decodes an ECDSA signature to its r,s,recovery components
 *
 * @param signature The signature to decode
 * @param format Format of the signature
 * @returns The signature object containing r,s,recoveryParam
 */
export const signatureDecode = (
    signature: any,
    format: SignatureFormat = SignatureFormat.SERIALIZED
): EC.SignatureOptions => {
    const sigbuf = toBuffer(signature);

    if (format === SignatureFormat.DER) {
        return new EC.Signature(sigbuf);
    }
    if (format === SignatureFormat.SERIALIZED_BITCOIN) {
        return {
            r: new BN(sigbuf.slice(1, 33)),
            s: new BN(sigbuf.slice(33, 65)),
            recoveryParam: new BN(sigbuf.slice(0, 1)).toNumber() - 27 - 4
        };
    }
    const recoveryParam = new BN(sigbuf.slice(64)).toNumber();
    return {
        r: new BN(sigbuf.slice(0, 32)),
        s: new BN(sigbuf.slice(32, 64)),
        // adjust for ethereum (won't work on signatures that also use chain ID)
        recoveryParam: recoveryParam > 3 ? recoveryParam - 27 : recoveryParam
    };
};

/**
 * Verifies a signature
 *
 * @param message The message that was signed
 * @param signature The signature on the message
 * @param curve The chosen curve
 * @param toBufferOptions Setting for Buffer conversion
 * @param signatureFormat Signature will be decoded based on this format
 * @returns Whether the signature is valid
 */
export const signatureVerify = (
    message: any,
    signature: any,
    curve: CURVE = CURVE.SECP256K1,
    toBufferOptions: IToBufferOptions = {},
    signatureFormat = SignatureFormat.SERIALIZED
): { result: boolean; signer: string } => {
    const sig = signatureDecode(signature, signatureFormat);
    const msgBuf = toBuffer(message, toBufferOptions);
    const pubKey = curveMap[curve].recoverPubKey(msgBuf, sig, sig.recoveryParam);
    const key = curveMap[curve].keyFromPublic(pubKey);
    return {
        result: key.verify(msgBuf, sig),
        signer: key.getPublic('hex')
    };
};
