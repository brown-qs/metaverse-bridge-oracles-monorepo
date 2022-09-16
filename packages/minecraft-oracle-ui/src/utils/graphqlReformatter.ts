import { GetOnChainTokensQuery } from "../state/api/generatedSquidMarketplaceApi"
import { CollectionFragmentDto, RecognizedAssetsDto, RecognizedAssetType, StringAssetType } from "../state/api/types"

export type ERC721TokenType = GetOnChainTokensQuery["erc721Tokens"][0]
export type ERC1155TokenType = GetOnChainTokensQuery["erc1155TokenOwners"][0]

export type GraphqlTokenType = ERC721TokenType | ERC1155TokenType

export type TransformedTokenType = {
    id: string,
    assetAddress?: string,
    numericId: number,
    balance?: string,
    metadata?: NonNullable<ERC721TokenType["metadata"]>,
    lastTransferredToAddress?: string
}
export const transformGraphqlErc721Token = (token: ERC721TokenType): TransformedTokenType => {
    return {
        id: token.id,
        assetAddress: token?.contract?.address ?? undefined,
        numericId: parseInt(token.numericId),
        balance: undefined, //non fungible
        metadata: token.metadata ?? undefined,
        lastTransferredToAddress: undefined //not relevant here dont need this to determine ownership
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
        lastTransferredToAddress: token?.token?.transfers?.[0].to?.id?.toLowerCase()
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
export type TokenWithRecognizedTokenData = TransformedTokenType & RecognizedTokenDataType
export const addRegonizedTokenDataToTokens = (tokens: TransformedTokenType[], recognizedAssetData: RecognizedAssetsDto[]): TokenWithRecognizedTokenData[] => {
    const results: TokenWithRecognizedTokenData[] = []
    for (const tok of tokens) {
        const recognizedAsset = recognizedAssetData.find(ra => ra?.assetAddress?.toLowerCase() === tok?.assetAddress?.toLowerCase())
        if (!!recognizedAsset) {
            const collectionFragment = recognizedAsset.collectionFragments.find((cf) => cf.idRange?.includes(tok?.numericId))
            if (!!collectionFragment) {
                const recognizedTokenData: TokenWithRecognizedTokenData = {
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