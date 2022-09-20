import { Erc1155TokenWhereInput, Erc721TokenWhereInput, GetMetadataQuery, GetMetadataQueryVariables, GetOnChainTokensQuery } from "../state/api/generatedSquidMarketplaceApi"
import { AssetDto, CollectionFragmentDto, RecognizedAssetsDto, RecognizedAssetType, StringAssetType } from "../state/api/types"

export type ERC721TokenType = GetOnChainTokensQuery["erc721Tokens"][0]
export type ERC1155TokenType = GetOnChainTokensQuery["erc1155TokenOwners"][0]

export type GraphqlTokenType = ERC721TokenType | ERC1155TokenType

export type TransformedTokenType = {
    id: string,
    assetAddress?: string,
    numericId: number,
    balance?: string,
    metadata?: NonNullable<ERC721TokenType["metadata"]>,
}
export const transformGraphqlErc721Token = (token: ERC721TokenType): TransformedTokenType => {
    return {
        id: token.id,
        assetAddress: token?.contract?.address ?? undefined,
        numericId: parseInt(token.numericId),
        balance: undefined, //non fungible
        metadata: token.metadata ?? undefined,
    }
}

export const transformGraphqlErc1155Token = (token: ERC1155TokenType): TransformedTokenType => {

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
export type OnChainTokenWithRecognizedTokenData = TransformedTokenType & RecognizedTokenDataType
export const addRegonizedTokenDataToTokens = (tokens: TransformedTokenType[], recognizedAssetData: RecognizedAssetsDto[]): OnChainTokenWithRecognizedTokenData[] => {
    const results: OnChainTokenWithRecognizedTokenData[] = []
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
                const recognizedTokenData: OnChainTokenWithRecognizedTokenData = {
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
}


export const inGameMetadataParams = (inGameItems: AssetDto[] | undefined): GetMetadataQueryVariables => {
    const erc1155Or: Erc1155TokenWhereInput[] = []
    const erc721Or: Erc721TokenWhereInput[] = []
    if (!!inGameItems) {
        for (const item of inGameItems) {
            if (item?.assetType === "ERC721") {
                erc721Or.push({ numericId_eq: item?.assetId, contract: { address_containsInsensitive: item?.assetAddress } })
            } else if (item?.assetType === "ERC1155") {
                erc1155Or.push({ numericId_eq: item?.assetId, contract: { address_containsInsensitive: item?.assetAddress } })
            }
        }
    }

    return { erc1155Where: { OR: erc1155Or }, erc721Where: { OR: erc721Or } }
}


export type InGameTokenMaybeMetadata = AssetDto & { metadata?: GetMetadataQuery["erc721Tokens"][0]["metadata"] }
export const inGameTokensCombineMetadata = (inGameTokens: AssetDto[], metadata: GetMetadataQuery | undefined): InGameTokenMaybeMetadata[] => {
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

export const formatTokenName = (token: OnChainTokenWithRecognizedTokenData): string => {
    let name = token?.metadata?.name ?? ""

    if (!!token?.numericId && token?.treatAsFungible === false) {
        name = `${name} #${token?.numericId}`
    }
    return name
}