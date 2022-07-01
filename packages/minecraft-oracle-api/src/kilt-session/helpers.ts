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
