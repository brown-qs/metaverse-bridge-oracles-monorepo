import {
  naclBoxPairFromSecret,
  blake2AsU8a,
  keyFromPath,
  naclOpen,
  naclSeal,
  sr25519PairFromSeed,
  keyExtractPath,
  mnemonicToMiniSecret,
  cryptoWaitReady,
} from '@polkadot/util-crypto'
import { Utils, Did, KeyRelationship, init, DidUri } from '@kiltprotocol/sdk-js'

export interface IKiltCtype {
  name: string,
  cTypeHash: string
}
const cTypes: IKiltCtype[] = [

  {
    name: 'peregrine email',
    cTypeHash:
      '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
  },
  {
    name: 'peregrine github',
    cTypeHash:
      '0xad52bd7a8bd8a52e03181a99d2743e00d0a5e96fdc0182626655fcf0c0a776d0',
  },
  {
    name: 'peregrine twitch',
    cTypeHash:
      '0x568ec5ffd7771c4677a5470771adcdea1ea4d6b566f060dc419ff133a0089d80',
  },
  {
    name: 'peregrine twitter',
    cTypeHash:
      '0x47d04c42bdf7fdd3fc5a194bcaa367b2f4766a6b16ae3df628927656d818f420',
  },
  {
    name: 'peregrine discord',
    cTypeHash:
      '0xd8c61a235204cb9e3c6acb1898d78880488846a7247d325b833243b46d923abe',
  },
]

export function findCtypeByName(name: string): IKiltCtype {
  const cType = cTypes.find(c => c.name === name)
  if (!cType) {
    throw new Error(`cType name ${name} not found`)
  }
  return cType
}

export async function getEncryptionKey(encryptionKeyId: string) {
  await cryptoWaitReady();
  await init({ address: process.env.KILT_WSS_ADDRESS });
  const encryptionKey = await Did.DidResolver.resolveKey(encryptionKeyId as any);
  return encryptionKey
}

export async function getAccount() {
  await cryptoWaitReady()
  const signingKeyPairType = 'sr25519'
  const keyring = new Utils.Keyring({
    ss58Format: 38,
    type: signingKeyPairType,
  })
  return keyring.addFromMnemonic(process.env.KILT_VERIFIER_MNEMONIC)
}

export async function keypairs() {
  const account = await getAccount()
  const keypairs = {
    authentication: account.derive('//did//0'),
    assertion: account.derive('//did//assertion//0'),
    keyAgreement: (function () {
      const secretKeyPair = sr25519PairFromSeed(mnemonicToMiniSecret(process.env.KILT_VERIFIER_MNEMONIC))
      const { path } = keyExtractPath('//did//keyAgreement//0')
      const { secretKey } = keyFromPath(secretKeyPair, path, 'sr25519')
      const blake = blake2AsU8a(secretKey)
      const boxPair = naclBoxPairFromSecret(blake)
      return {
        ...boxPair,
        type: 'x25519',
      }
    })(),
  }
  return keypairs
}
/*
export async function relationships() {
  return {
    [KeyRelationship.authentication]: keypairs.authentication,
    [KeyRelationship.assertionMethod]: keypairs.assertion,
    [KeyRelationship.keyAgreement]: keypairs.keyAgreement,
  }
}
*/
export async function getFullDid() {
  //TODO: don't cast as DidUri, do proper checks to make sure it is a the valid string format
  const fullDid = await Did.FullDidDetails.fromChainInfo(process.env.KILT_VERIFIER_DID_URI as DidUri)
  return fullDid
}

export async function decryptChallenge(
  encryptedChallenge: string,
  encryptionKey: { publicKey: Uint8Array },
  nonce: string
) {
  // decrypt the challenge
  const data = Utils.Crypto.coToUInt8(encryptedChallenge)
  const nonced = Utils.Crypto.coToUInt8(nonce)

  const peerPublicKey = encryptionKey.publicKey

  const keypair = await keypairs()
  const decrypted = naclOpen(
    data,
    nonced,
    peerPublicKey,
    keypair.keyAgreement.secretKey
  )
  // compare hex strings, fail if mismatch
  return Utils.Crypto.u8aToHex(decrypted)
}


export const encryptionKeystore = {
  async encrypt({ data, alg, peerPublicKey }: any) {
    const keypair = await keypairs()
    const { sealed, nonce } = naclSeal(
      data,
      keypair.keyAgreement.secretKey,
      peerPublicKey
    )
    return { data: sealed, alg, nonce }
  },
  async decrypt({ data, alg, nonce, peerPublicKey }: any) {
    const keypair = await keypairs()

    const decrypted = naclOpen(
      data,
      nonce,
      peerPublicKey,
      keypair.keyAgreement.secretKey
    )
    if (!decrypted) throw new Error('Failed to decrypt with given key')
    return { data: decrypted, alg }
  },
}
