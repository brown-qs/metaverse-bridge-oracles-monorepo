import { Stack, Box, VStack, Image, Fade, HStack, Button, Tag, FormControl, FormLabel, NumberInput, NumberInputField, useDimensions, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Grid, SimpleGrid } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ComponentType, memo, ReactNode, useRef } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { PhotoOff, Stack3, Wallet } from "tabler-icons-react"
import { useActiveWeb3React } from "../../hooks"
import LibraryCustomizerCard from "./LibraryCustomizerCard"
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../state/slices/authSlice"
import { useCustomizerConfigQuery, useGetInGameItemsQuery } from "../../state/api/bridgeApi"
import { useGetExosamaOnChainTokensQuery } from "../../state/api/generatedSquidExosamaApi"
import { useGetMarketplaceOnChainTokensQuery } from "../../state/api/generatedSquidMarketplaceApi"
import { StandardizedOnChainToken, standardizeMarketplaceOnChainTokens, standardizeExosamaOnChainTokens } from "../../utils/graphqlReformatter"
import LibraryVirtualList from "./LibraryVirtualList"
import { selectBlockNumbers } from "../../state/slices/blockNumbersSlice"
import { ChainId } from "../../constants"
import GhostButton from "../../pages/components/GhostButton"
import TraitCard from "../../pages/components/TraitCard/TraitCard"
import { MoonsamaSpinner } from "../MoonsamaSpinner"
import IndividualCustomizerView from "./IndividualCustomizerView"

export type IndividualCustomizerProps = {
    chainId: number,
    assetAddress: string,
    assetId: number,
}


const IndividualCustomizer = ({ chainId, assetAddress, assetId }: IndividualCustomizerProps) => {
    const navigate = useNavigate()

    const blockNumbers = useSelector(selectBlockNumbers)
    const { account } = useActiveWeb3React()
    const accessToken = useSelector(selectAccessToken)

    const { data: customizerConfigData, isLoading: isCustomizerConfigLoading, isFetching: isCustomizerConfigFetching, error: customizerConfigError } = useCustomizerConfigQuery({ chainId, assetAddress: assetAddress.toLowerCase() });

    const { data: marketplaceOnChainTokensData, currentData: currentMarketplaceOnChainTokensData, isLoading: isMarketplaceOnChainTokensLoading, isFetching: isMarketplaceOnChainTokensFetching, isError: isMarketplaceOnChainTokensError, error: marketplaceOnChainTokensError, refetch: refetchMarketplaceOnChainTokens } = useGetMarketplaceOnChainTokensQuery({ owner: String(account) }, { skip: !account || chainId !== ChainId.MOONRIVER })
    const { data: exosamaOnChainTokensData, currentData: currentExosamaOnChainTokensData, isLoading: isExosamaOnChainTokensLoading, isFetching: isExosamaOnChainTokensFetching, isError: isExosamaOnChainTokensError, error: exosamaOnChainTokensError, refetch: refetchExosamaOnChainTokens } = useGetExosamaOnChainTokensQuery({ owner: String(account) }, { skip: !account || chainId !== ChainId.MAINNET })
    const { data: inGameItemsData, isLoading: isInGameItemsDataLoading, isFetching: isInGameItemsDataFetching, isError: isInGameItemsError, error: inGameItemsError, refetch: refetchInGameItems } = useGetInGameItemsQuery(undefined, { skip: !accessToken })

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

    const pageLoading: boolean = React.useMemo(() => isCustomizerConfigLoading, [isCustomizerConfigLoading])

    if (pageLoading) {
        return (<VStack className="moonsamaFullHeight"><MoonsamaSpinner></MoonsamaSpinner></VStack>)
    }

    if (!customizerConfigData) {
        return (<Box>Unable to load customizer configuration, please refresh.</Box>)
    }


    return (
        <Box>
            <IndividualCustomizerView customizerConfig={customizerConfigData}></IndividualCustomizerView>
        </Box>
    )
}

export default IndividualCustomizer
