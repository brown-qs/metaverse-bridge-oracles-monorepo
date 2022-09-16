export type EmailLoginCode = {
    email: string
    "g-recaptcha-response": string
}

export type EmailLoginCodeResponse = {
    success: true
}

export type EmailLoginCodeVerifyResponse = {
    success: true
    jwt: string
}

export enum UserRole {
    NONE = 'NONE',
    PLAYER = 'PLAYER',
    ADMIN = 'ADMIN'
}

export type UserProfileResponse = {
    uuid: string,
    email: string | null,
    gamerTag: string | null,
    minecraftUuid: string | null,
    hasGame: boolean,
    minecraftUserName: string | null,
    role: UserRole,
    allowedToPlay: boolean,
    serverId: boolean | null,
    preferredServer: boolean | null,
    numTicket: number,
    numMoonsama: number,
    allowedToPlayReason: string,
    blacklisted: boolean
}

export type SkinResponse = {
    id: string
    assetAddress: string
    assetId: string
    assetType: string
    textureData: string
    textureSignature: string
    selectable: boolean
    name?: string
    equipped: boolean
}

export type SkinSelectRequest = {
    id: string,
    assetId: string
    assetType: string
    assetAddress: string
}

export type RecognizedAssetsDto = {
    chainId: number
    assetAddress: string
    assetType: StringAssetType
    name: string
    collectionFragments: CollectionFragmentDto[]
}

export type CollectionFragmentDto = {
    recognizedAssetType: RecognizedAssetType
    decimals: number
    treatAsFungible: boolean
    enrapturable: boolean
    importable: boolean
    exportable: boolean
    summonable: boolean
    gamepass: boolean
    name: string
    idRange: number[] | null
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
    PONDSAMA_FISH = 'PONDSAMA_FISH'
}

export enum StringAssetType {
    NONE = 'NONE',
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155'
}

export type AssetDto = {
    name: string
    assetAddress: string
    assetId: string
    assetType: string
    amount: string
    exportable: boolean
    summonable: boolean
    recognizedAssetType: string
    enraptured: boolean
    exportChainId?: number
    exportAddress: string
    hash?: string
}