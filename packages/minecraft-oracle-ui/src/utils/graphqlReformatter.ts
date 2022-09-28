import { Erc1155TokenWhereInput, Erc721TokenWhereInput, GetMarketplaceMetadataQuery, GetMarketplaceMetadataQueryVariables, GetMarketplaceOnChainTokensQuery, useGetMarketplaceOnChainTokensQuery } from "../state/api/generatedSquidMarketplaceApi"
import { AssetDto, CollectionFragmentDto, RecognizedAssetsDto, RecognizedAssetType, } from "../state/api/types"
import { StringAssetType } from "./subgraph"





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

}
export type StandardizedOnChainTokenWithRecognizedTokenData = StandardizedOnChainToken & RecognizedTokenDataType

//marketplace squid
type ERC721MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc721Tokens"][0]
type ERC1155MarketplaceOnChainTokenType = GetMarketplaceOnChainTokensQuery["erc1155TokenOwners"][0]

export const standardizeMarketplaceOnChainTokens = (tokens: GetMarketplaceOnChainTokensQuery | undefined): StandardizedOnChainToken[] | undefined => {
    if (!!tokens) {
        return [
            ...tokens.erc1155TokenOwners.map(tok => standardizeMarketplaceOnChainErc1155Token(tok)),
            ...tokens.erc721Tokens.map(tok => standardizeMarketplaceOnChainErc721Token(tok))
        ]
            .filter(tok => tok?.balance !== "0")
            .sort((a, b) => a.id.localeCompare(b.id))
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


export const inGameMarketplaceMetadataParams = (inGameItems: AssetDto[] | undefined): GetMarketplaceMetadataQueryVariables => {
    const erc1155Or: Erc1155TokenWhereInput[] = []
    const erc721Or: Erc721TokenWhereInput[] = []
    if (!!inGameItems) {
        for (const item of inGameItems) {
            if (item?.assetType === "ERC721") {
                erc721Or.push({ numericId_eq: item?.assetId, contract: { address_eq: item?.assetAddress?.toLowerCase() } })
            } else if (item?.assetType === "ERC1155") {
                erc1155Or.push({ numericId_eq: item?.assetId, contract: { address_eq: item?.assetAddress?.toLowerCase() } })
            }
        }
    }

    return { erc1155Where: { OR: erc1155Or }, erc721Where: { OR: erc721Or } }
}


export type InGameTokenMaybeMetadata = AssetDto & { metadata?: GetMarketplaceMetadataQuery["erc721Tokens"][0]["metadata"] }
export const inGameTokensCombineMetadata = (inGameTokens: AssetDto[], metadata: GetMarketplaceMetadataQuery | undefined): InGameTokenMaybeMetadata[] => {
    if (!!metadata) {
        const newInGameTokens: InGameTokenMaybeMetadata[] = []
        for (const item of inGameTokens) {
            const newToken: InGameTokenMaybeMetadata = { ...item }
            if (item?.assetType === "ERC721") {
                const md = metadata?.erc721Tokens?.find(tok => (tok?.contract?.address?.toLowerCase() === item?.assetAddress?.toLowerCase() && String(tok?.numericId) === String(item?.assetId)))
                if (!!md?.metadata) {
                    newToken["metadata"] = md?.metadata
                }
            } else if (item?.assetType === "ERC1155") {
                const md = metadata?.erc1155Tokens?.find(tok => (tok?.contract?.address?.toLowerCase() === item?.assetAddress?.toLowerCase() && String(tok?.numericId) === String(item?.assetId)))
                if (!!md?.metadata) {
                    newToken["metadata"] = md?.metadata
                }
            }
            newInGameTokens.push(newToken)
        }
        return newInGameTokens
    } else {
        return inGameTokens
    }
}

export const formatTokenName = (token: StandardizedOnChainTokenWithRecognizedTokenData): string => {
    let name = token?.metadata?.name ?? ""

    if (!!token?.numericId && token?.treatAsFungible === false) {
        name = `${name} #${token?.numericId}`
    }
    return name
}