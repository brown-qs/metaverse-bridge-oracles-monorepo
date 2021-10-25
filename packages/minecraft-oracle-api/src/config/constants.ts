import { TextureType } from "../texture/texturetype.enum";

export enum ChainId {
  MOONRIVER = 1285
}

export const ALLOWED_CHAIN_IDS: ChainId[] = [
    ChainId.MOONRIVER
]

export const CHAIN_ID_TO_NAME: {[chainId in ChainId]?: string} = {
    1285: 'Moonriver'
}

export const SESSION_CACHE_FIELD_USER = 'USER';


export const DEFAULT_SKIN = {
  textureData: 'ewogICJ0aW1lc3RhbXAiIDogMTYzMzk3MDczMzk0NSwKICAicHJvZmlsZUlkIiA6ICJjNmE2N2QwMmY4MGM0MjhmODYyNmQ5MjhlOTNjN2FjNyIsCiAgInByb2ZpbGVOYW1lIiA6ICJHaW92YW5uaVdpamF5YSIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS82MmMzODE2NzVmN2NlODZkZWJjZWYwOWJjODRmNDZhNTEzZjllYzFhNmQzNmE5Y2NhMGFiZDQ0NGJjNDg0ZjFkIgogICAgfQogIH0KfQ==',
  textureSignature: 'LEkxB2pQ02R3Ma47rCRLvqzKmhJdY+L4FsW9ICxN+YuuVI0hYK1rJzdSFi2HZFCM6UrxJ0rsW3VjdcGEahHzJZnvmJXOsIDCwk3GtPg2cUbn4SSoFspnwjskb/jZqM4NXhRNMiNjFbMXJ8aUyGEEhwQZiIdIOo/n7WxjQd/HrQ62+Q83vZ/apkJ+u0e1JM7r+9ekezH1cJkAaiTrjm75Tl9gbN/NcIFy2XsCafJsfV5Luun+tlvE1wm8JCcptVKxrGlQbpmVnDVuWswLZZ3Og721qxEUR3WAFJxX7t2w5v6iJF6K6VCwSyqCjd0se84jkydYxq9OzJ86UbegTMXpetxyujkjbOs4VNdj6IOlhVN2qDkJtmRCIOf01NXrjJVQYuVTUxM6UCulETJAOa/GNWVAnPK3OLIlrjEwVoQVAyy08nDyH31KaFi/i/opbxUmIdUgdh8Xabyt8onndEFCxu9N+cVTZXFtJMYgOsJ5pJ++xMSPgFT8mGNWPUxI6zC12YxLbROg9H2RZnSMi3z8WW54cYKnWMbvKSc6fQzSbN9LwdkMMGP4m1NsXRFVI7flog/lskZTnAVfBOXovFxH89EaV7/4TAQ3t1xKfkTRg6EDN5bWEvEogJgSYAAZyESxnVt6zbBSh9/GHhNuumZf+6JLcStQyHufYbthmbT9oio=',
  type: TextureType.SKIN,
  assetId: '0',
  accessories: [] as string[]
}