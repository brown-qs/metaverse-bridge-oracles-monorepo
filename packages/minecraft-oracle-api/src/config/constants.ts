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
  textureData: 'ewogICJ0aW1lc3RhbXAiIDogMTYzMzk3MDczMzk0NSwKICAicHJvZmlsZUlkIiA6ICJjNmE2N2QwMmY4MGM0MjhmODYyNmQ5MjhlOTNjN2FjNyIsCiAgInByb2ZpbGVOYW1lIiA6ICJHaW92YW5uaVdpamF5YSIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS82MmMzODE2NzVmN2NlODZkZWJjZWYwOWJjODRmNDZhNTEzZjllYzFhNmQzNmE5Y2NhMGFiZDQ0NGJjNDg0ZjFkIgogICAgfQogIH0KfQ==',
  textureSignature: 'LEkxB2pQ02R3Ma47rCRLvqzKmhJdY+L4FsW9ICxN+YuuVI0hYK1rJzdSFi2HZFCM6UrxJ0rsW3VjdcGEahHzJZnvmJXOsIDCwk3GtPg2cUbn4SSoFspnwjskb/jZqM4NXhRNMiNjFbMXJ8aUyGEEhwQZiIdIOo/n7WxjQd/HrQ62+Q83vZ/apkJ+u0e1JM7r+9ekezH1cJkAaiTrjm75Tl9gbN/NcIFy2XsCafJsfV5Luun+tlvE1wm8JCcptVKxrGlQbpmVnDVuWswLZZ3Og721qxEUR3WAFJxX7t2w5v6iJF6K6VCwSyqCjd0se84jkydYxq9OzJ86UbegTMXpetxyujkjbOs4VNdj6IOlhVN2qDkJtmRCIOf01NXrjJVQYuVTUxM6UCulETJAOa/GNWVAnPK3OLIlrjEwVoQVAyy08nDyH31KaFi/i/opbxUmIdUgdh8Xabyt8onndEFCxu9N+cVTZXFtJMYgOsJ5pJ++xMSPgFT8mGNWPUxI6zC12YxLbROg9H2RZnSMi3z8WW54cYKnWMbvKSc6fQzSbN9LwdkMMGP4m1NsXRFVI7flog/lskZTnAVfBOXovFxH89EaV7/4TAQ3t1xKfkTRg6EDN5bWEvEogJgSYAAZyESxnVt6zbBSh9/GHhNuumZf+6JLcStQyHufYbthmbT9oio=',
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
    id: string | undefined
}
// lwoercase
export const IMPORTABLE_ASSETS: RecognizedAsset[] = [
    {
      chainId: ChainId.MOONRIVER,
      address: '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a',
      type: RecognizedAssetType.MOONSAMA,
      id: undefined
    }, /* moonsama */
    {
      address: '0x1974eeaf317ecf792ff307f25a3521c35eecde86',
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.MOONRIVER,
    }, /* tickets */
    {
      address: '0x6E9F41ec2a43ECAe0Ada29587D4D40a3e83e4bEB'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.TEST,
      chainId: ChainId.VOLTA,
    },
    {
      address: '0x564482cFeC68454f078d0CEF27cb930cBa93d05C'.toLowerCase(),
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.VOLTA,
    },
    {
      address: '0x6A89CafD0a25bCf92De623209f8899eA4B8E30B1'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.MOONSAMA,
      chainId: ChainId.VOLTA,
    }
]

export const ENRAPTURABLE_ASSETS: RecognizedAsset[] = [
   {
      address: '0x6E9F41ec2a43ECAe0Ada29587D4D40a3e83e4bEB'.toLowerCase(),
      id: undefined as string,
      type: RecognizedAssetType.TEST,
      chainId: ChainId.VOLTA,
    }, /* tickets */
    {
      address: '0x564482cFeC68454f078d0CEF27cb930cBa93d05C'.toLowerCase(),
      id: '1',
      type: RecognizedAssetType.TICKET,
      chainId: ChainId.VOLTA,
    },
    {
      address: '0x6A89CafD0a25bCf92De623209f8899eA4B8E30B1'.toLowerCase(),
      id: undefined,
      type: RecognizedAssetType.MOONSAMA,
      chainId: ChainId.VOLTA,
    }
]

export const METAVERSE = '0x03b0ce3a3c09a347630b1f2803b77e8708cacbdb24f2f74961671eb476fbd57e'
export const METAVERSE_ADDRESSES: {[key: number]: string} = {
  [ChainId.VOLTA]: '0x58df3876BcE94941DE59088c5963781984EF264b',
  [ChainId.MOONRIVER]: '0x61d8070126a95CaE67cc6e897eFA0fdb17432C14'
}
export const CALLDATA_EXPIRATION_MS = 1000 * 60 * 5
export const CALLDATA_EXPIRATION_THRESHOLD = 1000 * 60 * 1