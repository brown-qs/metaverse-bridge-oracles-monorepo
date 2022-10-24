import { StringAssetType } from "../../../utils/subgraph"

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

export enum MultiverseVersion {
    V1 = 1,
    V2 = 2
}

export type RecognizedAssetsDto = {
    chainId: number
    assetAddress: string
    assetType: StringAssetType
    name: string
    multiverseVersion: MultiverseVersion
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

export type BridgedAssetDto = {
    name: string
    assetAddress: string
    assetId: string
    assetType: string
    amount: string
    exportable: boolean
    summonable: boolean
    recognizedAssetType: string
    enraptured: boolean
    chainId: number
    exportAddress: string
    hash?: string
    multiverseVersion: MultiverseVersion
}

export interface Oauth2PublicClientDto {
    appName: string
    scopes: { scope: Oauth2Scope, prettyScope: string }[]
}

export enum Oauth2Scope {
    UserUuidRead = 'user:uuid.read',
    UserGamerTagRead = 'user:gamer_tag.read'
}



//ORACLE API
export interface InRequestDto {
    chainId: number

    assetType: StringAssetType

    assetAddress: string

    assetId: number

    owner: string

    amount: string

    enrapture: boolean
}

export interface InBatchRequestDto {
    requests: InRequestDto[];
}

export interface InConfirmRequestDto {
    hash: string
}

export interface InConfirmResponseDto {
    confirmed: boolean
}



export interface OutRequestDto {
    hash: string
}

export interface OutBatchRequestDto {
    requests: OutRequestDto[];
}

export interface OutConfirmRequestDto {
    hash: string
}

export interface OutConfirmResponseDto {
    confirmed: boolean
}

export interface CallparamDto {
    data: string
    signature: string
    hash: string
    confirmed: boolean
}

export interface CompositeConfigDto {
    chainId: number,
    assetAddress: string,
    assetType: StringAssetType,
    name: string,
    parts: CompositeConfigPartDto[]
}

export interface CompositeConfigPartDto {
    chainId: number,
    assetAddress: string,
    assetType: StringAssetType,
    name: string,
    synthetic: boolean,
    items: CompositeConfigItemDto[]
}

export interface CompositeConfigItemDto {
    id: string,
    assetId: number,
    previewImageUri: string,
    attributes: CompositeConfigNftAttribute[],
    layers: CompositeConfigLayer[]
}

export interface CompositeConfigNftAttribute {
    trait_name: string,
    value: string
}

export interface CompositeConfigLayer {
    id: string,
    zIndex: number,
    imageUri: string
}