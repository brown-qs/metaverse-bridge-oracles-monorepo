import { ChainId } from "../../constants"

export enum RecognizedAssetType {
  NONE = 'NONE',
  MOONSAMA = 'MSAMA',
  TICKET = 'TICKET',
  TEST = 'TEST',
  PLOT='PLOT',
  OFFHAND='OFFHAND',
  WEAPON_SKIN='WEAPON_SKIN',
  TEMPORARY_TICKET='TEMPORARY_TICKET'
}

export type RecognizedAsset = {
  chainId: ChainId,
  address: string,
  type: RecognizedAssetType,
  id: string | undefined,
  name: string
}

export const RECOGNIZED_ASSETS: {[key: string]: RecognizedAsset} = {
  '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a': {
    chainId: ChainId.MOONRIVER,
    address: '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a',
    type: RecognizedAssetType.MOONSAMA,
    id: undefined,
    name: 'Moonsama'
  },
  '0x1974eeaf317ecf792ff307f25a3521c35eecde86': {
    address: '0x1974eeaf317ecf792ff307f25a3521c35eecde86',
    id: '1',
    type: RecognizedAssetType.TICKET,
    chainId: ChainId.MOONRIVER,
    name: 'VIP ticket'
  },
  '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a': {
    address: '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a',
    id: undefined,
    type: RecognizedAssetType.TEMPORARY_TICKET,
    chainId: ChainId.MOONRIVER,
    name: 'Temporary ticket'
  }
}
