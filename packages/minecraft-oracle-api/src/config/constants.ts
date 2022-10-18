import { TextureType } from "../texture/texturetype.enum";

export enum ChainId {
  MAINNET = 1,
  MOONBEAM = 1284,
  MOONRIVER = 1285,
  VOLTA = 73799
}

export const RPC_URLS: { [chainId: number]: string } = {
  [ChainId.MOONRIVER]: 'https://rpc.api.moonriver.moonbeam.network',
  [ChainId.MOONBEAM]: 'https://moonbeam-rpc.moonsama.com',
  [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/'
};

export const CHAIN_ID_TO_NAME: { [chainId in ChainId]?: string } = {
  1: 'Mainnet',
  1284: 'Moonbeam',
  1285: 'Moonriver',
  73799: 'Volta'
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
  NONE = 'NONE',
  MOONSAMA = 'MSAMA',
  TICKET = 'TICKET',
  TEST = 'TEST',
  PLOT = 'PLOT',
  OFFHAND = 'OFFHAND',
  WEAPON_SKIN = 'WEAPON_SKIN',
  TEMPORARY_TICKET = 'TEMPORARY_TICKET',
  ITEM = 'ITEM',
  WEARABLE = 'WEARABLE',
  RESOURCE = 'RESOURCE',
  CONSUMABLE = 'CONSUMABLE',
  PONDSAMA_FISH = 'PONDSAMA_FISH',
  GROMLIN = 'GROMLIN',
  EXOSAMA = 'EXOSAMA',
  MISC_ART = 'MISC_ART'
}

export enum MultiverseVersion {
  V1 = 1,
  V2 = 2
}

export enum PlayEligibilityReason {
  NONE = 'NONE',
  MOONSAMA = 'MSAMA',
  GROMLIN = 'GROMLIN',
  EXOSAMA = 'EXOSAMA',
  TICKET = 'TICKET',
  TEMPORARY_TICKET = 'TEMPORARY_TICKET',
}

export type RecognizedAsset = {
  chainId: ChainId,
  address: string,
  type: RecognizedAssetType,
  id: string | undefined | string[],
  name: string,
  gamepass: boolean,
  expiration?: number | undefined //undefined means forever for gamepass eligibility, otherwise milisecond unix timestamp
}
// lwoercase
export const IMPORTABLE_ASSETS: RecognizedAsset[] = [
  {
    chainId: ChainId.MOONRIVER,
    address: '0xb654611F84A8dc429BA3cb4FDA9Fad236C505a1a'.toLowerCase(),
    type: RecognizedAssetType.MOONSAMA,
    id: undefined,
    name: 'Moonsama',
    gamepass: true,
    expiration: undefined
  }, /* moonsama */
  {
    address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86'.toLowerCase(),
    id: '1',
    type: RecognizedAssetType.TICKET,
    chainId: ChainId.MOONRIVER,
    name: 'VIP ticket',
    gamepass: true,
    expiration: undefined
  }, /* tickets */
  {
    address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86'.toLowerCase(),
    id: ['2', '9'],
    type: RecognizedAssetType.OFFHAND,
    chainId: ChainId.MOONRIVER,
    name: 'Moonbrella',
    gamepass: false
  }, /* moonrella offhands */
  {
    address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86'.toLowerCase(),
    id: ['10', '58'],
    type: RecognizedAssetType.WEAPON_SKIN,
    chainId: ChainId.MOONRIVER,
    name: 'Sword skin',
    gamepass: false
  }, /* swords skins from lootbox */
  {
    address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86'.toLowerCase(),
    id: ['59', '62'],
    type: RecognizedAssetType.OFFHAND,
    chainId: ChainId.MOONRIVER,
    name: 'Embassy offhands',
    gamepass: false
  }, /* embassy*/
  {
    address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86'.toLowerCase(),
    id: ['63', '67'],
    type: RecognizedAssetType.OFFHAND,
    chainId: ChainId.MOONRIVER,
    name: 'Detectore',
    gamepass: false
  }, /* embassy*/
  {
    address: '0xdea45e7c6944cb86a268661349e9c013836c79a2'.toLowerCase(),
    id: undefined,
    type: RecognizedAssetType.MOONSAMA,
    chainId: ChainId.MOONRIVER,
    name: 'Multiverse Art',
    gamepass: true,
    expiration: undefined
  }, /* multiverse art skins */
  {
    address: '0xa17A550871E5F5F692a69a3ABE26e8DBd5991B75'.toLowerCase(),
    id: undefined,
    type: RecognizedAssetType.PLOT,
    chainId: ChainId.MOONRIVER,
    name: 'Moonsama Minecraft Plots Season 1',
    gamepass: false
  }
  /*
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
  */
]

export const ENRAPTURABLE_ASSETS: RecognizedAsset[] = [
  {
    address: '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a'.toLowerCase(),
    id: undefined,
    type: RecognizedAssetType.TEMPORARY_TICKET,
    chainId: ChainId.MOONRIVER,
    name: 'Embassy game passes',
    gamepass: true,
    expiration: 1648418400
  } /* embassy NFTs */
  /*
   {
      address: '0x6E9F41ec2a43ECAe0Ada29587D4D40a3e83e4bEB'.toLowerCase(),
      id: undefined as string,
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
    }
    */
]

export const METAVERSE = '0x03b0ce3a3c09a347630b1f2803b77e8708cacbdb24f2f74961671eb476fbd57e'
export const METAVERSE_ADDRESSES: { [key: number]: string } = {
  [ChainId.VOLTA]: '0x58df3876BcE94941DE59088c5963781984EF264b',
  [ChainId.MOONRIVER]: '0x59C481548CE7BA13f3288df9f4FCf44a10A589A0'//'0x7D5ebDb88D3bd969CC909FD49f1FF3A7bA1F4878'
}
export const MULTICALL_ADDRESSES: { [key: number]: string } = {
  [ChainId.MOONRIVER]: '0x8B60499C8e99d1218Df15ba6e8f0937e1878b86c'//'0x710ddbaA47A4cCdC85A507a264865260e82c18EE'
}
export const CALLDATA_EXPIRATION_MS = 1000 * 60 * 5
export const CALLDATA_EXPIRATION_THRESHOLD = 1000 * 60 * 1

export const IMPORT_CONFIRM_CRON_INTERVAL_MS = 60 * 1000 // 1 minute
export const CLEAN_CRON_INTERVAL_MS = 15 * 60 * 1000 // 15 mins

export const IPFS_GATEWAY = 'https://moonsama.mypinata.cloud'

/*
export const GGANBU_POWERS = [
  100, 75, 50, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25
]

*/

export const GGANBU_POWERS = [
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100
]