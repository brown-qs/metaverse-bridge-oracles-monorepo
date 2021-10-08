import { ec as EC } from 'elliptic';

const secp256k1 = new EC('secp256k1');
const curve25519 = new EC('curve25519');

export const enum CURVE {
    SECP256K1,
    CURVE25519
}

export const curveMap: { [key in CURVE]?: EC } = {
    0: secp256k1,
    1: curve25519
};
