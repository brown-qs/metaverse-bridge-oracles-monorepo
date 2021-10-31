import { TextureType } from "../texture/texturetype.enum";

export enum ChainId {
  MOONRIVER = 1285,
  VOLTA = 73799
}

export const ALLOWED_CHAIN_IDS: ChainId[] = [
    ChainId.MOONRIVER,
    ChainId.VOLTA
]

export const CHAIN_ID_TO_NAME: {[chainId in ChainId]?: string} = {
    1285: 'Moonriver',
    73799:'Volta'
}

export const SESSION_CACHE_FIELD_USER = 'USER';

export const DEFAULT_SKIN = {
  textureData: 'ewogICJ0aW1lc3RhbXAiIDogMTYyMTEyNTk4NDYwMSwKICAicHJvZmlsZUlkIiA6ICJmMjU5MTFiOTZkZDU0MjJhYTcwNzNiOTBmOGI4MTUyMyIsCiAgInByb2ZpbGVOYW1lIiA6ICJmYXJsb3VjaDEwMCIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS8zYjYwYTFmNmQ1NjJmNTJhYWViYmYxNDM0ZjFkZTE0NzkzM2EzYWZmZTBlNzY0ZmE0OWVhMDU3NTM2NjIzY2QzIiwKICAgICAgIm1ldGFkYXRhIiA6IHsKICAgICAgICAibW9kZWwiIDogInNsaW0iCiAgICAgIH0KICAgIH0KICB9Cn0=',
  textureSignature: 'f0PDKOurW0R6yjlqgQOKHlUEKDnHPEq2v969J5JWrXt7tGC2CLwTx+kEiGdDPT1LePgTOL5gJynAPipfq8UhOT8iF0yoF7LeBa6kQ/wzK5lNbFWPbq+CTGC2jrMg9SCGc8yeSn056mYUGrTEo05eiS2/TD25OoZT4vUVdRiZJKHpPpgOwgAgTesiZDxy8/4fbRmO90eU4vEXya4CVZqapGW1NIuneM3bxfocA1KC+BiZjwFHw3YHvm5d3yWXi7TP+8H1sRgdNPFxYIR6HkD8IFNPDuORMx0j0rBr5Ul+hkOizZkSkSVd1vgK0O95CppQAnXAs9aYVcnrCcaCkoozrhE8REZa2j6oJ8gVoUL8UndfzP/GZhUhPkXz86ZMdLxx2PLoz7WwbWA2ERUqtGh0NF9CgTLEKL+YLPva6ri6RW/wvO8X1obGd3Am97fO9Z7ZJH0zWuzFoCKqSHoRAJPaaUqilDvsnK+rI2nE9C0ZXLUlPAPBCmNGoZdOZdGH4G6TW5NXUXiNIXwEsrKSUOrQ0gyqVAVIzmoHIDVCP2FL4EuAKeNIF3K1pkqgSz/iAZwVRlaf+84hkdBcAvD4SlDqRaPh+fNrsK2P2aP58hnrYQ3e11Xez+3g5C89RkThXoe3aDG+QAQCG7hHBE6HE+TA2r6M0/yDLzCGVoNEDXWcxgA=',
  type: TextureType.SKIN,
  assetId: '0',
  accessories: [] as string[]
}

export enum RecognizedAssetType {
  NONE='NONE',
  MOONSAMA='MSAMA',
  TICKET='TICKET',
  TEST='TEST',
}


export type RecognizedAsset = {
    chainId: ChainId,
    address: string,
    type: RecognizedAssetType,
    id: string | undefined,
    name: string
}
// lwoercase
export const IMPORTABLE_ASSETS: RecognizedAsset[] = [
    {
      chainId: ChainId.MOONRIVER,
      address: '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a',
      type: RecognizedAssetType.MOONSAMA,
      id: undefined,
      name: 'Moonsama'
    }, /* moonsama */
    {
      address: '0x1974eeaf317ecf792ff307f25a3521c35eecde86',
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.MOONRIVER,
      name: 'Golden ticket'
    }, /* tickets */
    {
      address: '0x6E9F41ec2a43ECAe0Ada29587D4D40a3e83e4bEB'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.TEST,
      chainId: ChainId.VOLTA,
      name: 'Test'
    },
    {
      address: '0x564482cFeC68454f078d0CEF27cb930cBa93d05C'.toLowerCase(),
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.VOLTA,
      name: 'Golden ticket'
    },
    {
      address: '0x6A89CafD0a25bCf92De623209f8899eA4B8E30B1'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.MOONSAMA,
      chainId: ChainId.VOLTA,
      name: 'Moonsama'
    },
    {
      address: '0x63228048121877A9e0f52020834A135074e8207C'.toLowerCase(),
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.MOONRIVER,
      name: 'Golden ticket'
    },
    {
      address: '0xaF1F85aD24Bc45fb19f5F8B5166e1Aed41c60844'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.MOONSAMA,
      chainId: ChainId.MOONRIVER,
      name: 'Moonsama'
    }
]

export const ENRAPTURABLE_ASSETS: RecognizedAsset[] = [
   {
      address: '0x6E9F41ec2a43ECAe0Ada29587D4D40a3e83e4bEB'.toLowerCase(),
      id: undefined as string,
      type: RecognizedAssetType.TEST,
      chainId: ChainId.VOLTA,
      name: 'Test'
    }, /* tickets */
    {
      address: '0x564482cFeC68454f078d0CEF27cb930cBa93d05C'.toLowerCase(),
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.VOLTA,
      name: 'Golden ticket'
    },
    {
      address: '0x6A89CafD0a25bCf92De623209f8899eA4B8E30B1'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.MOONSAMA,
      chainId: ChainId.VOLTA,
      name: 'Moonsama'
    }
]

export const METAVERSE = '0x03b0ce3a3c09a347630b1f2803b77e8708cacbdb24f2f74961671eb476fbd57e'
export const METAVERSE_ADDRESSES: {[key: number]: string} = {
  [ChainId.VOLTA]: '0x58df3876BcE94941DE59088c5963781984EF264b',
  [ChainId.MOONRIVER]: '0x710ddbaA47A4cCdC85A507a264865260e82c18EE'
}
export const CALLDATA_EXPIRATION_MS = 1000 * 60 * 5
export const CALLDATA_EXPIRATION_THRESHOLD = 1000 * 60 * 1