import { GetExosamaMetadataQuery, GetExosamaMetadataQueryVariables, GetExosamaOnChainTokensQuery } from "../state/api/generatedSquidExosamaApi"
import { Erc1155TokenWhereInput, Erc721TokenWhereInput, GetMarketplaceMetadataQuery, GetMarketplaceMetadataQueryVariables, GetMarketplaceOnChainTokensQuery, useGetMarketplaceOnChainTokensQuery } from "../state/api/generatedSquidMarketplaceApi"
import { GetRaresamaMetadataQuery, GetRaresamaMetadataQueryVariables, GetRaresamaOnChainTokensQuery, TokenWhereInput } from "../state/api/generatedSquidRaresamaApi"
import { AssetDto, CollectionFragmentDto, MultiverseVersion, RecognizedAssetsDto, RecognizedAssetType, } from "../state/api/types"
import { StringAssetType } from "./subgraph"




//generic on chain token stuff for all squids
export type StandardizedOnChainToken = {
    id: string,
    assetAddress?: string,
    numericId: number,
    balance?: string,
    metadata?: NonNullable<ERC721MarketplaceOnChainTokenType["metadata"]>,
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

export const addRegonizedTokenDataToStandardizedOnChainTokens = (tokens: StandardizedOnChainToken[] | undefined, recognizedAssetData: RecognizedAssetsDto[] | undefined): StandardizedOnChainTokenWithRecognizedTokenData[] | undefined => {
    if (!!tokens && !!recognizedAssetData) {
        const results: StandardizedOnChainTokenWithRecognizedTokenData[] = []
        for (const tok of tokens) {
            const recognizedAsset = recognizedAssetData.find(ra => ra?.assetAddress?.toLowerCase() === tok?.assetAddress?.toLowerCase())
            if (!!recognizedAsset) {
                const collectionFragment = recognizedAsset.collectionFragments.find((cf) => {
                    if (!!cf.idRange) {
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
    } else {
        return undefined
    }
}

export const formatTokenName = (token: StandardizedOnChainTokenWithRecognizedTokenData): string => {
    let name = token?.metadata?.name ?? ""

    if (!!token?.numericId && token?.treatAsFungible === false) {
        name = `${name} #${token?.numericId}`
    }
    return name
}

//marketplace squid
type ERC721MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc721Tokens"][0]
type ERC1155MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc1155TokenOwners"][0]

export const standardizeExosamaOnChainTokens = (tokens: GetExosamaOnChainTokensQuery | undefined): StandardizedOnChainToken[] | undefined => {
    if (!!tokens) {
        return sortAndFilterStandardizedOnChainTokens([
            ...tokens.erc721Tokens.map(tok => standardizeMarketplaceOnChainErc721Token(tok))
        ])
    } else {
        return undefined
    }
}


export const standardizeMarketplaceOnChainTokens = (tokens: GetMarketplaceOnChainTokensQuery | undefined): StandardizedOnChainToken[] | undefined => {
    if (!!tokens) {
        return sortAndFilterStandardizedOnChainTokens([
            ...tokens.erc1155TokenOwners.map(tok => standardizeMarketplaceOnChainErc1155Token(tok)),
            ...tokens.erc721Tokens.map(tok => standardizeMarketplaceOnChainErc721Token(tok))
        ])
    } else {
        return undefined
    }
}

const standardizeMarketplaceOnChainErc721Token = (token: ERC721MarketplaceOnChainTokenType): StandardizedOnChainToken => {
    return {
        id: token.id,
        assetAddress: token?.contract?.address ?? undefined,
        numericId: parseInt(token.numericId),
        balance: undefined, //non fungible
        metadata: token.metadata ?? undefined,
    }
}

const standardizeMarketplaceOnChainErc1155Token = (token: ERC1155MarketplaceOnChainTokenType): StandardizedOnChainToken => {
    let bal: string | undefined
    if (typeof token.balance === "string") {
        bal = token.balance
    }
    return {
        id: token.id,
        assetAddress: token?.token?.contract?.address ?? undefined,
        numericId: parseInt(token.token.numericId),
        balance: bal,
        metadata: token.token.metadata ?? undefined,
    }
}


//raresama squid
type RaresamaOnChainTokenType = GetRaresamaOnChainTokensQuery["tokens"][0]

export const standardizeRaresamaOnChainTokens = (tokens: GetRaresamaOnChainTokensQuery | undefined): StandardizedOnChainToken[] | undefined => {
    const tok = tokens?.tokens[0]
    if (!!tokens?.tokens) {
        return [...sortAndFilterStandardizedOnChainTokens(tokens.tokens.map(standardizeRaresamaOnChainToken))]
    } else {
        return undefined
    }
}

const standardizeRaresamaOnChainToken = (token: RaresamaOnChainTokenType): StandardizedOnChainToken => {
    return {
        id: token.id,
        assetAddress: token?.contract?.address ?? undefined,
        numericId: parseInt(token.numericId),
        balance: undefined, //non fungible
        metadata: token.metadata ?? undefined,
    }
}



//in game items
export type InGameMetadataParams = {
    marketplace: GetMarketplaceMetadataQueryVariables,
    raresama: GetRaresamaMetadataQueryVariables,
    exosama: GetExosamaMetadataQueryVariables
}

export const inGameMetadataParams = (inGameItems: AssetDto[] | undefined): InGameMetadataParams => {
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
export type InGameTokenMaybeMetadata = AssetDto & { metadata?: SquidMetadata }
export const inGameTokensCombineMetadata = (inGameTokens: AssetDto[], metadata: StandardizedMetadata[] | undefined): InGameTokenMaybeMetadata[] => {
    if (!!metadata) {
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
    } else {
        return inGameTokens
    }
}

export type StandardizedMetadata = {
    assetAddress: string,
    assetId: number,
    metadata: SquidMetadata
}
export const standardizeMarketplaceMetadata = (metadata: GetMarketplaceMetadataQuery | undefined): StandardizedMetadata[] | undefined => {
    if (!!metadata) {
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
    } else {
        return undefined
    }
}

export const standardizeExosamaMetadata = (metadata: GetExosamaMetadataQuery | undefined): StandardizedMetadata[] | undefined => {
    if (!!metadata) {
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
    } else {
        return undefined
    }
}

export const standardizeRaresamaMetadata = (metadata: GetRaresamaMetadataQuery | undefined): StandardizedMetadata[] | undefined => {
    if (!!metadata) {
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
    } else {
        return undefined
    }
}


