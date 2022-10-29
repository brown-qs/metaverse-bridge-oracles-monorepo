import { GetExosamaMetadataQuery, GetExosamaMetadataQueryVariables, GetExosamaOnChainTokensQuery } from "../state/api/generatedSquidExosamaApi"
import { Erc1155TokenWhereInput, Erc721TokenWhereInput, GetMarketplaceMetadataQuery, GetMarketplaceMetadataQueryVariables, GetMarketplaceOnChainTokensQuery, useGetMarketplaceOnChainTokensQuery } from "../state/api/generatedSquidMarketplaceApi"
import { GetRaresamaMetadataQuery, GetRaresamaMetadataQueryVariables, GetRaresamaOnChainTokensQuery, TokenWhereInput } from "../state/api/generatedSquidRaresamaApi"
import { BridgedAssetDto, CollectionFragmentDto, MultiverseVersion, RecognizedAssetsDto, RecognizedAssetType, } from "../state/api/types"
import { StringAssetType } from "./subgraph"




//generic on chain token stuff for all squids
export type StandardizedOnChainToken = {
    id: string,
    assetAddress: string,
    numericId: number,
    balance?: string,
    metadata?: NonNullable<ERC721MarketplaceOnChainTokenType["metadata"]>,
}

const isStandardizedOnChainToken = (token: StandardizedOnChainToken | undefined): token is StandardizedOnChainToken => {
    return !!token
}

export type RecognizedTokenDataType = {
    chainId: number,
    assetType: StringAssetType,
    recognizedCollectionName: string,
    recognizedCollectionFragmentName: string
    recognizedAssetType: RecognizedAssetType
    decimals: number
    treatAsFungible: boolean
    enrapturable: boolean
    importable: boolean
    exportable: boolean
    summonable: boolean
    gamepass: boolean
    multiverseVersion: MultiverseVersion
}
export type StandardizedOnChainTokenWithRecognizedTokenData = StandardizedOnChainToken & RecognizedTokenDataType

const sortAndFilterStandardizedOnChainTokens = (tokens: StandardizedOnChainToken[]): StandardizedOnChainToken[] => {
    return tokens
        .filter(tok => tok?.balance !== "0")
        .sort((a, b) => a.id.localeCompare(b.id))
}

export const addRegonizedTokenDataToStandardizedOnChainTokens = (tokens: StandardizedOnChainToken[], recognizedAssetData: RecognizedAssetsDto[] | undefined): StandardizedOnChainTokenWithRecognizedTokenData[] => {
    const results: StandardizedOnChainTokenWithRecognizedTokenData[] = []
    const ra = recognizedAssetData ?? []
    for (const tok of tokens) {
        const recognizedAsset = ra.find(ra => ra?.assetAddress?.toLowerCase() === tok?.assetAddress?.toLowerCase())
        if (!!recognizedAsset) {
            const collectionFragment = recognizedAsset.collectionFragments.find((cf) => {
                if (!!cf.idRange && !(Array.isArray(cf.idRange) && cf.idRange.length === 0)) {
                    return cf.idRange?.includes(tok?.numericId)
                } else {
                    //if no id range everything accepted
                    return true
                }
            })
            if (!!collectionFragment) {
                const recognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData = {
                    chainId: recognizedAsset.chainId,
                    assetType: recognizedAsset.assetType,
                    recognizedCollectionName: recognizedAsset.name,
                    recognizedCollectionFragmentName: collectionFragment.name,
                    recognizedAssetType: collectionFragment.recognizedAssetType,
                    decimals: collectionFragment.decimals,
                    treatAsFungible: collectionFragment.treatAsFungible,
                    enrapturable: collectionFragment.enrapturable,
                    importable: collectionFragment.importable,
                    exportable: collectionFragment.exportable,
                    summonable: collectionFragment.summonable,
                    gamepass: collectionFragment.gamepass,
                    multiverseVersion: recognizedAsset.multiverseVersion,
                    ...tok
                }
                results.push(recognizedTokenData)
            }
        }
    }

    return results

}

export const formatOnChainTokenName = (token: StandardizedOnChainTokenWithRecognizedTokenData): string | undefined => {
    let name = token?.metadata?.name ?? undefined
    const assAddress = token?.assetAddress?.toLowerCase()

    if (!!name && ["0xb654611f84a8dc429ba3cb4fda9fad236c505a1a"].includes(assAddress)) {
        name = name.split(` #`)[0]
    }
    return name
}

export const formatOnChainTokenSuffix = (token: StandardizedOnChainTokenWithRecognizedTokenData): string | undefined => {
    if (![StringAssetType.ERC1155, StringAssetType.ERC721].includes(token.assetType)) {
        return undefined
    }
    let suffix = !!token?.numericId ? String(token?.numericId) : undefined
    const assAddress = token?.assetAddress?.toLowerCase()

    if (!!suffix && ["0xb654611f84a8dc429ba3cb4fda9fad236c505a1a"].includes(assAddress)) {
        suffix = `${token?.metadata?.name?.split(` #`)[1]}`
    }
    return `#${suffix}`
}

export const formatInGameTokenName = (token: InGameTokenMaybeMetadata): string | undefined => {
    let name = token?.metadata?.name ?? undefined
    const assAddress = token?.assetAddress?.toLowerCase()

    if (!!name && ["0xb654611f84a8dc429ba3cb4fda9fad236c505a1a"].includes(assAddress)) {
        name = name.split(` #`)[0]
    }
    return name
}

export const formatInGameTokenSuffix = (token: InGameTokenMaybeMetadata): string | undefined => {
    if (!["ERC721", "ERC1155"].includes(token.assetType)) {
        return undefined
    }
    let suffix = !!token?.assetId ? String(token?.assetId) : undefined
    const assAddress = token?.assetAddress?.toLowerCase()

    if (!!suffix && ["0xb654611f84a8dc429ba3cb4fda9fad236c505a1a"].includes(assAddress)) {
        suffix = `${token?.metadata?.name?.split(` #`)[1]}`
    }
    return `#${suffix}`
}

//marketplace squid
type ERC721MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc721Tokens"][0]
type ERC1155MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc1155TokenOwners"][0]

export const standardizeExosamaOnChainTokens = (tokens: GetExosamaOnChainTokensQuery | undefined): StandardizedOnChainToken[] => {
    if (!!tokens) {
        return sortAndFilterStandardizedOnChainTokens([
            ...tokens.erc721Tokens.map(tok => standardizeMarketplaceOnChainErc721Token(tok)).filter(isStandardizedOnChainToken)
        ])
    } else {
        return []
    }
}


export const standardizeMarketplaceOnChainTokens = (tokens: GetMarketplaceOnChainTokensQuery | undefined): StandardizedOnChainToken[] => {
    if (!!tokens) {
        return sortAndFilterStandardizedOnChainTokens([
            ...tokens.erc1155TokenOwners.map(tok => standardizeMarketplaceOnChainErc1155Token(tok)).filter(isStandardizedOnChainToken),
            ...tokens.erc721Tokens.map(tok => standardizeMarketplaceOnChainErc721Token(tok)).filter(isStandardizedOnChainToken)
        ])
    } else {
        return []
    }
}

const standardizeMarketplaceOnChainErc721Token = (token: ERC721MarketplaceOnChainTokenType): StandardizedOnChainToken | undefined => {
    if (!!token?.contract?.address) {
        return {
            id: token.id,
            assetAddress: token.contract.address,
            numericId: parseInt(token.numericId),
            balance: undefined, //non fungible
            metadata: token.metadata ?? undefined,
        }
    }
}

const standardizeMarketplaceOnChainErc1155Token = (token: ERC1155MarketplaceOnChainTokenType): StandardizedOnChainToken | undefined => {
    let bal: string | undefined
    if (typeof token.balance === "string") {
        bal = token.balance
    }

    if (!!token?.token?.contract?.address) {
        return {
            id: token.id,
            assetAddress: token.token.contract.address,
            numericId: parseInt(token.token.numericId),
            balance: bal,
            metadata: token.token.metadata ?? undefined,
        }
    }
}


//raresama squid
type RaresamaOnChainTokenType = GetRaresamaOnChainTokensQuery["tokens"][0]

export const standardizeRaresamaOnChainTokens = (tokens: GetRaresamaOnChainTokensQuery | undefined): StandardizedOnChainToken[] => {
    if (!!tokens) {
        return [...sortAndFilterStandardizedOnChainTokens(tokens.tokens.map(standardizeRaresamaOnChainToken).filter(isStandardizedOnChainToken))]
    } else {
        return []
    }
}

const standardizeRaresamaOnChainToken = (token: RaresamaOnChainTokenType): StandardizedOnChainToken | undefined => {
    if (!!token?.contract?.address) {
        return {
            id: token.id,
            assetAddress: token.contract.address,
            numericId: parseInt(token.numericId),
            balance: undefined, //non fungible
            metadata: token.metadata ?? undefined,
        }
    }

}



//in game items
export type InGameMetadataParams = {
    marketplace: GetMarketplaceMetadataQueryVariables,
    raresama: GetRaresamaMetadataQueryVariables,
    exosama: GetExosamaMetadataQueryVariables
}

export const inGameMetadataParams = (inGameItems: BridgedAssetDto[] | undefined): InGameMetadataParams => {
    const erc1155Or: Erc1155TokenWhereInput[] = []
    const erc721Or: Erc721TokenWhereInput[] = []
    const raresamaOr: TokenWhereInput[] = []
    if (!!inGameItems) {
        for (const item of inGameItems) {
            raresamaOr.push({ numericId_eq: item?.assetId, contract: { id_eq: item?.assetAddress?.toLowerCase() } })
            if (item?.assetType === "ERC721") {
                erc721Or.push({ numericId_eq: item?.assetId, contract: { address_eq: item?.assetAddress?.toLowerCase() } })
            } else if (item?.assetType === "ERC1155") {
                erc1155Or.push({ numericId_eq: item?.assetId, contract: { address_eq: item?.assetAddress?.toLowerCase() } })
            }
        }
    }

    return {
        marketplace: { erc1155Where: { OR: erc1155Or }, erc721Where: { OR: erc721Or } },
        raresama: { where: { OR: raresamaOr } },
        exosama: { erc721Where: { OR: erc721Or } }
    }
}

export type SquidMetadata = GetMarketplaceMetadataQuery["erc721Tokens"][0]["metadata"]
export type InGameTokenMaybeMetadata = BridgedAssetDto & { metadata?: SquidMetadata }
export const inGameTokensCombineMetadata = (inGameTokens: BridgedAssetDto[], metadata: StandardizedMetadata[]): InGameTokenMaybeMetadata[] => {
    const newInGameTokens: InGameTokenMaybeMetadata[] = []
    for (const item of inGameTokens) {
        const newToken: InGameTokenMaybeMetadata = { ...item }
        const md = metadata?.find(tok => (tok?.assetAddress?.toLowerCase() === item?.assetAddress?.toLowerCase() && String(tok?.assetId) === String(item?.assetId)))

        if (!!md?.metadata) {
            newToken["metadata"] = md?.metadata
        }
        newInGameTokens.push(newToken)
    }
    return newInGameTokens

}

export type StandardizedMetadata = {
    assetAddress: string,
    assetId: number,
    metadata: SquidMetadata
}
export const standardizeMarketplaceMetadata = (metadata: GetMarketplaceMetadataQuery | undefined): StandardizedMetadata[] => {
    const combinedMetadata: StandardizedMetadata[] = []
    if (!!metadata?.erc721Tokens) {
        for (const tok of metadata.erc721Tokens) {
            if (!!tok?.metadata && !!tok?.contract?.address && !isNaN(parseInt(tok?.numericId))) {
                const standardizedMetadata = {
                    assetAddress: tok.contract.address.toLowerCase(),
                    assetId: parseInt(tok.numericId),
                    metadata: tok.metadata
                }
                combinedMetadata.push(standardizedMetadata)
            }
        }
    }

    if (!!metadata?.erc1155Tokens) {
        for (const tok of metadata.erc1155Tokens) {
            if (!!tok?.metadata && !!tok?.contract?.address && !isNaN(parseInt(tok?.numericId))) {
                const standardizedMetadata = {
                    assetAddress: tok.contract.address.toLowerCase(),
                    assetId: parseInt(tok.numericId),
                    metadata: tok.metadata
                }
                combinedMetadata.push(standardizedMetadata)
            }
        }
    }
    return combinedMetadata;
}

export const standardizeExosamaMetadata = (metadata: GetExosamaMetadataQuery | undefined): StandardizedMetadata[] => {
    const combinedMetadata: StandardizedMetadata[] = []
    if (!!metadata?.erc721Tokens) {
        for (const tok of metadata.erc721Tokens) {
            if (!!tok?.metadata && !!tok?.contract?.address && !isNaN(parseInt(tok?.numericId))) {
                const standardizedMetadata = {
                    assetAddress: tok.contract.address.toLowerCase(),
                    assetId: parseInt(tok.numericId),
                    metadata: tok.metadata
                }
                combinedMetadata.push(standardizedMetadata)
            }
        }
    }
    return combinedMetadata;

}

export const standardizeRaresamaMetadata = (metadata: GetRaresamaMetadataQuery | undefined): StandardizedMetadata[] => {
    const combinedMetadata: StandardizedMetadata[] = []
    if (!!metadata?.tokens) {
        for (const tok of metadata.tokens) {
            if (!!tok?.metadata && !!tok?.contract?.address && !isNaN(parseInt(tok?.numericId))) {
                const standardizedMetadata = {
                    assetAddress: tok.contract.address.toLowerCase(),
                    assetId: parseInt(tok.numericId),
                    metadata: tok.metadata
                }
                combinedMetadata.push(standardizedMetadata)
            }
        }
    }
    return combinedMetadata;
}


//indexer is laggy, check our in game items to see if the import has completed
export const checkOnChainItemNotImported = (onChainToken: StandardizedOnChainTokenWithRecognizedTokenData, multiverseTokens: InGameTokenMaybeMetadata[]): boolean => {
    if ([StringAssetType.ERC1155, StringAssetType.ERC721].includes(onChainToken.assetType)) {
        if (onChainToken.treatAsFungible) {
            return true
        }

        const matchingToken = multiverseTokens.find(t => t?.assetAddress?.toLowerCase() === onChainToken?.assetAddress?.toLowerCase() && String(t?.assetId) === String(onChainToken?.numericId))
        if (!!matchingToken) {
            return false
        } else {
            return true
        }
    } else {
        return true
    }
}