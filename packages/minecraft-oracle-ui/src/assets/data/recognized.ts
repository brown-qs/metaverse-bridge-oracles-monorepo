import { ChainId } from "../../constants"

export enum RecognizedAssetType {
  NONE = 'NONE',
  MOONSAMA = 'MSAMA',
  TICKET = 'TICKET',
  TEST = 'TEST',
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
  }
}
