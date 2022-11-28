import { Stack, Box, VStack, Image, Fade, HStack, Button, Tag, FormControl, FormLabel, NumberInput, NumberInputField, useDimensions, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Grid, SimpleGrid } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ComponentType, memo, ReactNode, useRef } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { PhotoOff, Stack3, Wallet } from "tabler-icons-react"
import { useActiveWeb3React } from "../../hooks"
import LibraryCustomizerCard from "./LibraryCustomizerCard"
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';
import { useDispatch, useSelector } from "react-redux"
import { selectAccessToken } from "../../state/slices/authSlice"
import { useCustomizerConfigQuery, useGetInGameItemsQuery } from "../../state/api/bridgeApi"
import { useGetExosamaMetadataQuery, useGetExosamaOnChainTokensQuery } from "../../state/api/generatedSquidExosamaApi"
import { useGetMarketplaceMetadataQuery, useGetMarketplaceOnChainTokensQuery } from "../../state/api/generatedSquidMarketplaceApi"
import { StandardizedOnChainToken, standardizeMarketplaceOnChainTokens, standardizeExosamaOnChainTokens, StandardizedMetadata, standardizeExosamaMetadata, standardizeMarketplaceMetadata } from "../../utils/graphqlReformatter"
import LibraryVirtualList from "./LibraryVirtualList"
import { selectBlockNumbers } from "../../state/slices/blockNumbersSlice"
import { ChainId } from "../../constants"
import GhostButton from "../../pages/components/GhostButton"
import TraitCard from "../../pages/components/TraitCard/TraitCard"
import { MoonsamaSpinner } from "../MoonsamaSpinner"
import IndividualCustomizerView from "./IndividualCustomizerView"
import { addCustomization, CustomizerAsset, CustomizerCustomization } from "../../state/slices/customizerSlice"
import { CompositeConfigDto, CompositeConfigItemDto } from "../../state/api/types"

export type IndividualCustomizerProps = {
    chainId: number,
    assetAddress: string,
    assetId: number,
}


const IndividualCustomizer = ({ chainId, assetAddress, assetId }: IndividualCustomizerProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const blockNumbers = useSelector(selectBlockNumbers)
    const { account } = useActiveWeb3React()
    const accessToken = useSelector(selectAccessToken)

    const { data: customizerConfigData, isLoading: isCustomizerConfigLoading, isFetching: isCustomizerConfigFetching, error: customizerConfigError } = useCustomizerConfigQuery({ chainId, assetAddress: assetAddress.toLowerCase() });

    const { data: marketplaceOnChainTokensData, currentData: currentMarketplaceOnChainTokensData, isLoading: isMarketplaceOnChainTokensLoading, isFetching: isMarketplaceOnChainTokensFetching, isError: isMarketplaceOnChainTokensError, error: marketplaceOnChainTokensError, refetch: refetchMarketplaceOnChainTokens } = useGetMarketplaceOnChainTokensQuery({ owner: String(account) }, { skip: !account || chainId !== ChainId.MOONRIVER })
    const { data: exosamaOnChainTokensData, currentData: currentExosamaOnChainTokensData, isLoading: isExosamaOnChainTokensLoading, isFetching: isExosamaOnChainTokensFetching, isError: isExosamaOnChainTokensError, error: exosamaOnChainTokensError, refetch: refetchExosamaOnChainTokens } = useGetExosamaOnChainTokensQuery({ owner: String(account) }, { skip: !account || chainId !== ChainId.MAINNET })
    const { data: inGameItemsData, isLoading: isInGameItemsDataLoading, isFetching: isInGameItemsDataFetching, isError: isInGameItemsError, error: inGameItemsError, refetch: refetchInGameItems } = useGetInGameItemsQuery(undefined, { skip: !accessToken })

    const { data: moonsamaMetadata, isLoading: isMoonsamaMetadataLoading, isFetching: isMoonsamaMetadataFetching, isError: isMoonsamaMetadataError, error: moonsamaMetadataError } = useGetMarketplaceMetadataQuery({}, { skip: chainId !== ChainId.MOONRIVER })

    const { data: exosamaMetadata, isLoading: isExosamaMetadataLoading, isFetching: isExosamaMetadataFetching, isError: isExosamaMetadataError, error: exosamaMetadataError } = useGetExosamaMetadataQuery({ erc721Where: { numericId_eq: assetId } }, { skip: chainId !== ChainId.MAINNET })


    const standardizedMarketplaceOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeMarketplaceOnChainTokens(marketplaceOnChainTokensData), [marketplaceOnChainTokensData])
    const standardizedExosamaOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeExosamaOnChainTokens(exosamaOnChainTokensData), [exosamaOnChainTokensData])

    React.useEffect(() => {
        refetchExosamaOnChainTokens()
    }, [blockNumbers[ChainId.MAINNET]])

    React.useEffect(() => {
        refetchMarketplaceOnChainTokens()
    }, [blockNumbers[ChainId.MOONRIVER]])

    React.useEffect(() => {
        refetchInGameItems()
    }, [blockNumbers[ChainId.MOONRIVER], blockNumbers[ChainId.MOONBEAM], blockNumbers[ChainId.MAINNET]])

    const ownedOnChain: boolean = React.useMemo(() => {
        const onChainTokens = [...standardizedMarketplaceOnChainTokens, ...standardizedExosamaOnChainTokens]
        const matchingToken = onChainTokens.find(t => t.assetAddress.toLowerCase() === assetAddress.toLowerCase() && t.numericId === assetId)
        return !!matchingToken
    }, [standardizedMarketplaceOnChainTokens, standardizedExosamaOnChainTokens])

    const ownedInPortal: boolean = React.useMemo(() => {
        const matchingToken = inGameItemsData?.find(t => t.assetAddress.toLowerCase() === assetAddress.toLowerCase() && t.assetId === String(assetId))
        return !!matchingToken
    }, [inGameItemsData])

    const pageLoading: boolean = React.useMemo(() => {
        if (isCustomizerConfigLoading) {
            return true
        }

        if (chainId === ChainId.MAINNET && isExosamaMetadataLoading) {
            return true
        }

        if (chainId === ChainId.MOONRIVER && isMoonsamaMetadataLoading) {
            return true
        }

        return false
    }, [isCustomizerConfigLoading, isExosamaMetadataLoading, isMoonsamaMetadataLoading, chainId])

    const metadataArray: StandardizedMetadata[] = React.useMemo(() => {
        return [
            ...standardizeMarketplaceMetadata(moonsamaMetadata),
            ...standardizeExosamaMetadata(exosamaMetadata),
        ]
    }, [moonsamaMetadata, exosamaMetadata])

    const metadata: StandardizedMetadata | undefined = React.useMemo(() => {
        for (const m of metadataArray) {
            if (m?.assetAddress?.toLowerCase() === assetAddress.toLowerCase() && m?.assetId === assetId) {
                return m
            }
        }
        return undefined
    }, [metadataArray])

    //a CompositeConfigItemDto can have multiple attributes eg expression, vibe, body type for exos
    //attributes that depend on each other, 
    type MetaAttribute = {
        traitType: string,
        value: string
    }
    const attributeToCustomizerAsset = (customizerConfig: CompositeConfigDto, allAttributes: MetaAttribute[], traitType: string, traitValue: string): CustomizerAsset | undefined => {
        for (const part of customizerConfig.parts) {
            for (const item of part.items) {
                const attrs = item.attributes
                if (attrs[0].trait_type !== traitType || attrs[0].value !== traitValue) {
                    continue
                }
                //if multiple attributes make sure they are contained in metadata
                let allAttributesMatch = true
                for (const attr of attrs) {
                    const matchingAttr = allAttributes.some(a => a.traitType === attr.trait_type && a.value === attr.value)
                    if (!matchingAttr) {
                        allAttributesMatch = false
                        break;
                    }
                }

                if (allAttributesMatch) {
                    const customizerAsset: CustomizerAsset = {
                        chainId: part.chainId,
                        assetAddress: part.assetAddress,
                        assetId: item.assetId
                    }
                    return customizerAsset
                }
            }
        }

        return undefined
    }
    //if its the first time with the NFT, set the metadata to the default metadata
    React.useEffect(() => {
        if (!!metadata?.metadata?.attributes && !!customizerConfigData) {
            const defaultAssets: CustomizerAsset[] = []
            const attributes = metadata.metadata.attributes
            for (const attribute of attributes) {
                const customizerAsset = attributeToCustomizerAsset(customizerConfigData, attributes, attribute.traitType, attribute.value)
                if (!!customizerAsset) {
                    defaultAssets.push(customizerAsset)
                }
            }
            const customization: CustomizerCustomization = {
                parentChainId: chainId,
                parentAssetAddress: assetAddress.toLowerCase(),
                parentAssetId: assetId,
                defaultAssets,
                assets: defaultAssets
            }
            dispatch(addCustomization(customization))
        }
    }, [metadata, customizerConfigData])


    if (pageLoading) {
        return (<VStack className="moonsamaFullHeight"><MoonsamaSpinner></MoonsamaSpinner></VStack>)
    }

    if (!customizerConfigData) {
        return (<Box>Unable to load customizer configuration, please refresh.</Box>)
    }

    if (!(!!metadata?.metadata?.attributes)) {
        return (<Box>Unable to get starting metadata, please refresh.</Box>)
    }


    return (
        <Box>
            <IndividualCustomizerView customizerConfig={customizerConfigData} assetId={assetId}></IndividualCustomizerView>
        </Box>
    )
}

export default IndividualCustomizer
