
export enum ChainId {
  MOONRIVER = 1285
}

export const ALLOWED_CHAIN_IDS: ChainId[] = [
    ChainId.MOONRIVER
]

export const CHAIN_ID_TO_NAME: {[chainId in ChainId]?: string} = {
    1285: 'Moonriver'
}