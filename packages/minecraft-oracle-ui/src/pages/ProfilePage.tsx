
import { useAccountDialog, useActiveWeb3React } from 'hooks';

import { useAssetDialog } from '../hooks/useAssetDialog/useAssetDialog';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { SKIN_LABELS } from '../constants/skins';
import { BURNABLE_RESOURCES_IDS, ChainId, DEFAULT_CHAIN, EXN_RSS, NETWORK_NAME, PERMISSIONED_CHAINS, RARESAMA_POOP, SAMA, SHIT_FART } from "../constants";
import { AssetChainDetails } from '../components/AssetChainDetails/AssetChainDetails';
import { Image, Text, Box, Container, Grid, List as ChakraList, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack, background, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useCheckboxGroup, useMediaQuery, CircularProgress } from '@chakra-ui/react';
import { InGameItem } from '../components/Portal/InGameItem';
import { CaretLeft, CaretRight, DeviceGamepad, UserCircle, Wallet } from 'tabler-icons-react';
import { InGameResource } from '../components/Portal/InGameResource';
import { OnChainResource } from '../components/Portal/OnChainResource';
import { OnChainItem } from '../components/Portal/OnChainItem';
import { useSetSkinMutation, useGetSkinsQuery, useUserProfileQuery, useGetRecognizedAssetsQuery, useGetInGameItemsQuery, useGetInGameResourcesQuery, useGetExosMutation } from '../state/api/bridgeApi';
import { Virtuoso } from 'react-virtuoso'
import { CollectionFragmentDto, MultiverseVersion, SkinResponse } from '../state/api/types';
import { useGetMarketplaceMetadataQuery, useGetMarketplaceOnChainTokensQuery } from '../state/api/generatedSquidMarketplaceApi';
import { Media } from '../components';
import { BigNumber, utils } from 'ethers';
import { addRegonizedTokenDataToStandardizedOnChainTokens, checkOnChainItemNotImported, formatInGameTokenName, formatOnChainTokenName, inGameMetadataParams, InGameTokenMaybeMetadata, inGameTokensCombineMetadata, StandardizedMetadata, StandardizedOnChainToken, StandardizedOnChainTokenWithRecognizedTokenData, standardizeExnSubgraphOnChainTokens, standardizeExosamaMetadata, standardizeExosamaOnChainTokens, standardizeMarketplaceMetadata, standardizeMarketplaceOnChainTokens, standardizeRaresamaMetadata, standardizeRaresamaOnChainTokens } from '../utils/graphqlReformatter';
import { useDispatch, useSelector } from 'react-redux';
import { openSummonModal, selectSummonModalOpen, setSummonModalSummonAddresses } from '../state/slices/summonModalSlice';
import { SummonModal } from '../components/modals/SummonModal';
import { useGetRaresamaMetadataQuery, useGetRaresamaOnChainTokensQuery } from '../state/api/generatedSquidRaresamaApi';
import { selectBlockNumbers } from '../state/slices/blockNumbersSlice';
import { openOnChainResourceModal, setOnChainResource } from '../state/slices/onChainResourceModalSlice';
import { OnChainResourceModal } from '../components/modals/OnChainResourceModal';

import { openInGameItemModal, setInGameItemModalToken } from '../state/slices/inGameItemModalSlice';
import { InGameItemModal } from '../components/modals/InGameItemModal';
import { useGetExosamaMetadataQuery, useGetExosamaOnChainTokensQuery } from '../state/api/generatedSquidExosamaApi';
import { useQuery } from 'react-query';
import { getAssetBalance } from '../hooks/useBalances/useBalances';
import { InModal } from '../components/modals/InModal';
import { openInModal, setInModalTokens } from '../state/slices/inModalSlice';
import { openOutModal, setOutModalTokens } from '../state/slices/outModalSlice';
import { OutModal } from '../components/modals/OutModal';
import { PortalTab } from '../components/Portal/PortalTab';
import { useGetExnSubraphOnChainTokensQuery } from '../state/api/generatedSubgraphExnApi';

export type SummonAddress = {
    address: string,
    gamePassesFromAddress: InGameTokenMaybeMetadata[]
}
const ProfilePage = () => {
    const dispatch = useDispatch()
    const blockNumbers = useSelector(selectBlockNumbers)
    const summonModalOpen = useSelector(selectSummonModalOpen)

    const { account, chainId, library } = useActiveWeb3React()


    //profile
    const { data: profile, error, isLoading: profileLoading } = useUserProfileQuery()

    //erc20 token balances
    const { isLoading: isPoopBalanceLoading, data: poopBalanceData, refetch: refetchPoopBalance } = useQuery(
        ['getAssetBalance', RARESAMA_POOP, account?.toLowerCase()],
        () => getAssetBalance(RARESAMA_POOP, library!, account!),
        {
            enabled: !!library && !!account && chainId === ChainId.MOONBEAM
        }
    )

    const { isLoading: isShitFartBalanceLoading, data: shitFartBalanceData, refetch: refetchShitFartBalance } = useQuery( //test token, wont show up if you dont have it
        ['getAssetBalance', SHIT_FART, account?.toLowerCase()],
        () => getAssetBalance(SHIT_FART, library!, account!),
        {
            enabled: !!library && !!account && chainId === ChainId.MOONRIVER
        }
    )

    const standardizedErc20Tokens: StandardizedOnChainToken[] = React.useMemo(() => {
        const resultTokens: StandardizedOnChainToken[] = []
        if (!!shitFartBalanceData && shitFartBalanceData.gt("0")) {
            const token: StandardizedOnChainToken = {
                id: "SHIT_FART_TOKEN",
                assetAddress: SHIT_FART.assetAddress,
                numericId: 0,
                balance: shitFartBalanceData.toString(),
                metadata: {
                    name: "$SFT",
                    image: SHIT_FART?.metadata?.image!
                }
            }
            resultTokens.push(token)
        }
        if (!!poopBalanceData && poopBalanceData.gt("0")) {
            const token: StandardizedOnChainToken = {
                id: "POOP_TOKEN",
                assetAddress: RARESAMA_POOP.assetAddress,
                numericId: 0,
                balance: poopBalanceData.toString(),
                metadata: {
                    name: "$POOP",
                    image: RARESAMA_POOP?.metadata?.image!
                }
            }
            resultTokens.push(token)
        }
        return resultTokens
    }, [shitFartBalanceData, poopBalanceData])



    //skins
    const { data: skins, error: skinsError, isLoading: skinsLoading, refetch: refetchSkins } = useGetSkinsQuery()
    const [setSkin, { error: setSkinError, isUninitialized, isLoading, isSuccess, isError, reset: setSkinReset }] = useSetSkinMutation()

    //OPENSEA API HACK
    // const [getExos, { data: getExosData, error: getExosError, isUninitialized: isGetExosUninitialized, isLoading: isGetExosLoading, isSuccess: isGetExosSuccess, isError: isGetExosError, reset: resetGetExos }] = useGetExosMutation()

    //on chain tokens (from indexers)
    const { data: raresamaOnChainTokensData, currentData: currentRaresamaOnChainTokensData, isLoading: isRaresamaOnChainTokensDataLoading, isFetching: isRaresamaOnChainTokensDataFetching, isError: isRaresamaOnChainTokensDataError, error: raresamaOnChainTokensError, refetch: refetchRaresamaOnChainTokens } = useGetRaresamaOnChainTokensQuery({ where: { owner: { id_eq: account?.toLowerCase()! }, contract: { OR: [{ id_eq: "0xf27a6c72398eb7e25543d19fda370b7083474735" }, { id_eq: "0xe4bf451271d8d1b9d2a7531aa551b7c45ec95048" }] } } }, { skip: !account })
    const { data: marketplaceOnChainTokensData, currentData: currentMarketplaceOnChainTokensData, isLoading: isMarketplaceOnChainTokensLoading, isFetching: isMarketplaceOnChainTokensFetching, isError: isMarketplaceOnChainTokensError, error: marketplaceOnChainTokensError, refetch: refetchMarketplaceOnChainTokens } = useGetMarketplaceOnChainTokensQuery({ owner: account?.toLowerCase()! }, { skip: !account })
    const { data: exosamaOnChainTokensData, currentData: currentExosamaOnChainTokensData, isLoading: isExosamaOnChainTokensLoading, isFetching: isExosamaOnChainTokensFetching, isError: isExosamaOnChainTokensError, error: exosamaOnChainTokensError, refetch: refetchExosamaOnChainTokens } = useGetExosamaOnChainTokensQuery({ owner: account?.toLowerCase()! }, { skip: !account })
    const { data: exnSubgraphOnChainTokensData, currentData: currentExnSubgraphOnChainTokensData, isLoading: isExnSubgraphOnChainTokensLoading, isFetching: isExnSubgraphOnChainTokensFetching, isError: isExnSubgraphOnChainTokensError, error: exnSubgraphOnChainTokensError, refetch: refetchExnSubgraphOnChainTokens } = useGetExnSubraphOnChainTokensQuery({ owner: account?.toLowerCase()! }, { skip: !account })


    //useGetExnSubraphOnChainTokensQuery
    //in game tokens (from nestjs server)
    const { data: recognizedAssetsData, isLoading: isRecognizedAssetsLoading, isFetching: isRecognizedAssetsFetching, isError: isRecognizedAssetsError, error: recognizedAssetsError, refetch: refetchRecognizedAssets } = useGetRecognizedAssetsQuery()
    const { data: inGameItemsData, isLoading: isInGameItemsDataLoading, isFetching: isInGameItemsDataFetching, isError: isInGameItemsError, error: inGameItemsError, refetch: refetchInGameItems } = useGetInGameItemsQuery()
    const { data: inGameResourcesData, isLoading: isInGameResourcesLoading, isFetching: isInGameResourcesFetching, isError: isInGameResourcesError, error: inGameResourcesError, refetch: refetchInGameResources } = useGetInGameResourcesQuery()

    //metadata
    const inGameItemsMetadataQuery = React.useMemo(() => inGameMetadataParams(inGameItemsData), [inGameItemsData])
    const inGameResourcesMetadataQuery = React.useMemo(() => inGameMetadataParams(inGameResourcesData), [inGameResourcesData])
    const { data: marketplaceInGameItemsMetadata, isLoading: isMarketplaceInGameItemsMetadataLoading, isFetching: isMarketplaceInGameItemsMetadataFetching, isError: isMarketplaceInGameItemsMetadataError, error: marketplaceInGameItemsMetadataError } = useGetMarketplaceMetadataQuery(inGameItemsMetadataQuery.marketplace)
    const { data: marketplaceInGameResourcesMetadata, isLoading: isMarketplaceInGameResourcesMetadataLoading, isFetching: isMarketplaceInGameResourcesMetadataFetching, isError: isMarketplaceInGameResourcesMetadataError, error: marketplaceInGameResourcesMetadataError } = useGetMarketplaceMetadataQuery(inGameResourcesMetadataQuery.marketplace)

    const { data: raresamaInGameItemsMetadata, isLoading: isRaresamaInGameItemsMetadataLoading, isFetching: isRaresamaInGameItemsMetadataFetching, isError: isRaresamaInGameItemsMetadataError, error: raresamaInGameItemsMetadataError } = useGetRaresamaMetadataQuery(inGameItemsMetadataQuery.raresama)
    const { data: exosamaInGameItemsMetadata, isLoading: isExosamaInGameItemsMetadataLoading, isFetching: isExosamaInGameItemsMetadataFetching, isError: isExosamaInGameItemsMetadataError, error: exosamaInGameItemsMetadataError } = useGetExosamaMetadataQuery(inGameItemsMetadataQuery.exosama)



    const playAllowedReasonTexts: any = {
        'MSAMA': 'You are eligible to play because you imported a Moonsama.',
        'TICKET': 'You are eligible to play because you imported a VIP ticket.',
        'TEMPORARY_TICKET': 'You are eligible to play because you imported a game pass.',
        'DEFAULT': 'You are eligible to play because you were given permanent access.',
    }
    const { isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose } = useAccountDialog();


    // Group checkbox hooks for batch import/export
    const { value: inGameCheckboxGroupValue, isDisabled: isInGameCheckboxGroupDisabled, onChange: onInGameCheckboxGroupChange, setValue: setInGameCheckboxGroupValue, getCheckboxProps: getInGameCheckboxGroupProps } = useCheckboxGroup()
    const { value: onChainCheckboxGroupValue, isDisabled: isOnChainCheckboxGroupDisabled, onChange: onOnChainCheckboxGroupChange, setValue: setOnChainCheckboxGroupValue, getCheckboxProps: getOnChainCheckboxGroupProps } = useCheckboxGroup()

    const [isSmallerThan285] = useMediaQuery('(max-width: 285px)')

    const skinToImageUrl = (skin: SkinResponse): string | undefined => {
        const decoded = Buffer.from(skin.textureData, 'base64').toString()
        const textureURL = !!decoded ? JSON.parse(decoded)?.textures?.SKIN?.url : undefined
        const coverURL = !!textureURL ? `https://api.mineskin.org/render/skin?url=${textureURL}` : undefined
        return coverURL
    }

    const standardizedMarketplaceOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeMarketplaceOnChainTokens(marketplaceOnChainTokensData), [marketplaceOnChainTokensData])
    const standardizedMarketplaceOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedMarketplaceOnChainTokens, recognizedAssetsData), [standardizedMarketplaceOnChainTokens, recognizedAssetsData])

    const standardizedRaresamaOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeRaresamaOnChainTokens(raresamaOnChainTokensData), [raresamaOnChainTokensData])
    const standardizedRaresamaOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedRaresamaOnChainTokens, recognizedAssetsData), [standardizedRaresamaOnChainTokens, recognizedAssetsData])

    const standardizedExosamaOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeExosamaOnChainTokens(exosamaOnChainTokensData), [exosamaOnChainTokensData])
    const standardizedExosamaOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedExosamaOnChainTokens, recognizedAssetsData), [standardizedExosamaOnChainTokens, recognizedAssetsData])

    const standardizedExnSubgraphOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeExnSubgraphOnChainTokens(exnSubgraphOnChainTokensData), [exnSubgraphOnChainTokensData])
    const standardizedExnSubgraphOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedExnSubgraphOnChainTokens, recognizedAssetsData), [standardizedExnSubgraphOnChainTokens, recognizedAssetsData])


    const standardizedErc20OnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedErc20Tokens, recognizedAssetsData), [standardizedErc20Tokens, recognizedAssetsData])

    //OPENSEA API HACK
    //const tempExosOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(getExosData ?? [], recognizedAssetsData), [getExosData, recognizedAssetsData])

    const inGameItemsMetadata: StandardizedMetadata[] = React.useMemo(() => {
        return [
            ...standardizeMarketplaceMetadata(marketplaceInGameItemsMetadata),
            ...standardizeRaresamaMetadata(raresamaInGameItemsMetadata),
            ...standardizeExosamaMetadata(exosamaInGameItemsMetadata),
            RARESAMA_POOP,
            SHIT_FART,
        ]
    }, [marketplaceInGameItemsMetadata, raresamaInGameItemsMetadata, exosamaInGameItemsMetadata])

    const inGameItems: InGameTokenMaybeMetadata[] = React.useMemo(() => {
        return [...inGameTokensCombineMetadata(inGameItemsData ?? [], inGameItemsMetadata)]
            .sort((a, b) => `${a.assetAddress}~${a.assetId}`.localeCompare(`${b.assetAddress}~${b.assetId}`, 'en', { numeric: true }))

    }, [inGameItemsData, inGameItemsMetadata])

    const allStandardizedOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => {
        return [
            ...standardizedErc20OnChainTokensWithRecognizedTokenData,
            ...standardizedMarketplaceOnChainTokensWithRecognizedTokenData,
            ...standardizedRaresamaOnChainTokensWithRecognizedTokenData,
            ...standardizedExosamaOnChainTokensWithRecognizedTokenData,
            ...standardizedExnSubgraphOnChainTokensWithRecognizedTokenData, //subgraph with hardcoded metadata
            //   ...tempExosOnChainTokensWithRecognizedTokenData //OPENSEA API HACK
        ].filter(tok => checkOnChainItemNotImported(tok, inGameItems))

    }, [standardizedExnSubgraphOnChainTokensWithRecognizedTokenData, standardizedMarketplaceOnChainTokensWithRecognizedTokenData, standardizedRaresamaOnChainTokensWithRecognizedTokenData, standardizedExosamaOnChainTokensWithRecognizedTokenData, standardizedErc20OnChainTokensWithRecognizedTokenData, inGameItems])


    const inGameResourcesMetadata: StandardizedMetadata[] = React.useMemo(() => {
        return [
            ...standardizeMarketplaceMetadata(marketplaceInGameResourcesMetadata),
            ...EXN_RSS,
            SAMA

        ]
    }, [marketplaceInGameResourcesMetadata])


    const inGameResources: InGameTokenMaybeMetadata[] = React.useMemo(() => {
        return [...inGameTokensCombineMetadata(inGameResourcesData ?? [], inGameResourcesMetadata)]
            .sort((a, b) => `${a.assetAddress}~${a.assetId}`.localeCompare(`${b.assetAddress}~${b.assetId}`, 'en', { numeric: true }))

    }, [inGameResourcesData, inGameResourcesMetadata])

    const isSummonButtonDisabled: boolean = React.useMemo(() => {

        const summonableResources = inGameResources.filter(r => r.inventorySummonEnabled === true)

        if (inGameResources.length === 0 || summonableResources.length === 0) {
            return true
        }
        return false
    }, [inGameResources])


    const onChainItems: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => {
        return (allStandardizedOnChainTokensWithRecognizedTokenData ?? []).filter((tok) => {
            if (tok?.importable === false && tok?.enrapturable === false) {
                return false
            }

            //if there's a connected chain, only show items on that chain
            if (!!chainId && tok.chainId !== chainId) {
                return false
            }
            return true
        })

    }, [allStandardizedOnChainTokensWithRecognizedTokenData, chainId])


    const onChainResources: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => {
        return allStandardizedOnChainTokensWithRecognizedTokenData.filter((tok) => {
            if (!!chainId && ![ChainId.MOONRIVER, ChainId.EXOSAMANETWORK].includes(chainId)) {
                return false
            }

            return tok.summonable && tok.chainId === chainId
        })

    }, [allStandardizedOnChainTokensWithRecognizedTokenData, chainId])


    const isOnChainItemsLoading: boolean = React.useMemo(() => {
        if (!!chainId) {
            if (chainId === ChainId.MOONRIVER && isMarketplaceOnChainTokensFetching && !currentMarketplaceOnChainTokensData) {
                return true
            } else if (chainId === ChainId.MOONBEAM && isRaresamaOnChainTokensDataFetching && !currentRaresamaOnChainTokensData && !isPoopBalanceLoading) {
                return true
            } else if (chainId === ChainId.MAINNET && isExosamaOnChainTokensFetching && !currentExosamaOnChainTokensData) {
                return true
            }
            return false
        } else {
            return false
        }
    }, [isPoopBalanceLoading, currentMarketplaceOnChainTokensData, isMarketplaceOnChainTokensFetching, isRaresamaOnChainTokensDataFetching, currentRaresamaOnChainTokensData, isExosamaOnChainTokensFetching, currentExosamaOnChainTokensData, chainId])

    const isOnChainResourcesLoading: boolean = React.useMemo(() => {
        if (!!chainId && chainId === ChainId.MOONRIVER && isMarketplaceOnChainTokensFetching && !currentMarketplaceOnChainTokensData) {
            return true
        } else if (!!chainId && chainId === ChainId.EXOSAMANETWORK && isExnSubgraphOnChainTokensFetching && !currentExosamaOnChainTokensData) {
            return true
        } else {
            return false
        }
    }, [currentMarketplaceOnChainTokensData, isMarketplaceOnChainTokensFetching, isExnSubgraphOnChainTokensFetching, currentExosamaOnChainTokensData, chainId])


    const emptyOnChainItemsMessage: string | undefined = React.useMemo(() => {
        if (!!onChainItems?.[0]) {
            return undefined
        } else {
            if (!!account) {
                if (!!chainId && PERMISSIONED_CHAINS.includes(chainId)) {
                    const networkName = NETWORK_NAME[chainId]
                    return `There are no on-chain items on ${networkName}. You may need to change networks.`
                } else {
                    return 'Please change to a supported network to see your on-chain items.'
                }
            } else {
                return 'Please connect a wallet on a supported network to see your on-chain items.'
            }
        }
    }, [onChainItems, account, chainId])


    const emptyOnChainResourcesMessage: string | undefined = React.useMemo(() => {
        if (!!onChainResources?.[0]) {
            return undefined
        } else {
            if (!!account) {
                if (!!chainId && PERMISSIONED_CHAINS.includes(chainId)) {
                    const networkName = NETWORK_NAME[chainId]
                    return `There are no on-chain resources on ${networkName}. You may need to change networks.`
                } else {
                    return 'Please change to a supported network to see your on-chain resources.'
                }
            } else {
                return 'Please connect a wallet on a supported network to see your on-chain resources.'
            }
        }
    }, [onChainResources, account, chainId])


    const summonAddresses: SummonAddress[] = React.useMemo(() => {
        const summonGroups: SummonAddress[] = []
        for (const asset of inGameItems) {
            if (!asset.gamepass) {
                continue
            }
            const exportAddress = asset.exportAddress.toLowerCase()
            const existingEntry = summonGroups.find(s => s.address.toLowerCase() === exportAddress)
            if (!!existingEntry) {
                existingEntry.gamePassesFromAddress.push(asset)
            } else {
                summonGroups.push({ address: exportAddress, gamePassesFromAddress: [asset] })
            }
        }

        return summonGroups
    }, [inGameItems])




    React.useEffect(() => {
        if (!!account && chainId === ChainId.MOONRIVER) {
            refetchShitFartBalance()
        }
    }, [account, blockNumbers[ChainId.MOONRIVER], chainId])

    React.useEffect(() => {
        if (!!account && chainId === ChainId.MOONBEAM) {
            refetchPoopBalance()
        }
    }, [account, blockNumbers[ChainId.MOONBEAM], chainId])

    React.useEffect(() => {
        refetchExosamaOnChainTokens()
    }, [blockNumbers[ChainId.MAINNET]])

    React.useEffect(() => {
        refetchRaresamaOnChainTokens()
    }, [blockNumbers[ChainId.MOONBEAM]])

    React.useEffect(() => {
        refetchMarketplaceOnChainTokens()
    }, [blockNumbers[ChainId.MOONRIVER]])

    React.useEffect(() => {
        refetchInGameItems()
        refetchInGameResources()
        refetchSkins()
    }, [blockNumbers[ChainId.MOONRIVER], blockNumbers[ChainId.MOONBEAM], blockNumbers[ChainId.MAINNET]])


    //metadata isn't necessary loaded on tokens, so refresh is things change
    React.useEffect(() => {
        if (summonModalOpen) {
            dispatch(setSummonModalSummonAddresses(summonAddresses))
        }
    }, [summonAddresses, summonModalOpen])
    //opensea api hack
    /* React.useEffect(() => {
         if (!!account && !!chainId && chainId === ChainId.MAINNET) {
             getExos(account.toLowerCase())
         }
     }, [account, chainId])*/

    return (
        <>
            <Container

                backgroundPosition="top right"
                backgroundRepeat="no-repeat"
                backgroundSize='600px 700px'
                minWidth="100%"
                margin="0"
                padding="0"
                height="100%"
                position="relative"
                overflow="visible">
                {profileLoading
                    ?
                    <VStack className="moonsamaFullHeight">
                        <HStack h="100%">
                            <CircularProgress isIndeterminate color="teal"></CircularProgress>
                        </HStack>

                    </VStack>
                    :
                    <>
                        <Grid
                            zIndex="2"
                            templateRows={{ base: "275px repeat(5, 450px)", md: '275px repeat(3, 700px)', lg: '275px repeat(2, 700px)' }}
                            templateColumns='repeat(12, 1fr)'
                            maxW="1440px"
                            margin="auto"
                            height="100%"
                        >




                            {/* START WELCOME MESSAGE & PLAYER ELIGIBILITY */}
                            <GridItem
                                zIndex="2"
                                padding={{
                                    base: "96px 0 0 0",
                                    md: "96px 0 0 0"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 12, lg: 12 }}
                                overflow="hidden"
                            >
                                <Stack lineHeight="40px" fontSize="32px" textAlign="left" direction={{ base: "column" }}>
                                    <Box fontFamily="heading" color="white" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                                        Welcome back,
                                    </Box>
                                    <Box fontFamily="heading" color="yellow.300" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" flex="1">
                                        {profile?.email}
                                    </Box>
                                </Stack>
                                <HStack marginTop="20px" fontSize="12px">
                                    {!profile?.allowedToPlay &&
                                        <Box fontFamily="heading" padding="4px 8px" borderRadius="4px" color="white" bg="red.500">BUY YOUR TICKET AT THE MARKETPLACE TO PLAY</Box>
                                    }
                                    {profile?.allowedToPlay && !profile?.blacklisted &&
                                        <Box fontFamily="heading" padding="4px 8px" borderRadius="4px" color="#1B1B3A" bg="teal.200">YOU ARE ELIGIBLE TO PLAY</Box>
                                    }
                                    {profile?.allowedToPlay && profile?.blacklisted &&
                                        <Box fontFamily="heading" padding="4px 8px" borderRadius="4px" color="#1B1B3A" bg="yellow.300">BLACKLISTED, BUT ALLOWED TO PLAY</Box>
                                    }
                                </HStack>
                            </GridItem>
                            {/* END WELCOME MESSAGE & PLAYER ELIGIBILITY */}



                            {/* START SKINS */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 0 7px 0",
                                    md: "16px 8px 7px 0"
                                }}
                                overflow="hidden"
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 4 }}
                            >
                                <PortalTab
                                    title="Available Skins"
                                    emptyMessage={!!skins ? undefined : "No available skins found."}
                                    icon={<UserCircle size="18px" />}
                                    isLoading={skinsLoading}
                                >
                                    {!!skins &&
                                        <VStack spacing="0" overflowY="scroll" h="100%">
                                            <Grid templateColumns='repeat(2, 1fr)' width="100%" height="100%">
                                                {[...skins].sort((t1, t2) => t1.assetAddress.localeCompare(t2.assetAddress)).map((value, ind) => {
                                                    const skinLabel = SKIN_LABELS[value.assetAddress.toLowerCase()]
                                                    const firstColumn = ind % 2 === 0
                                                    const firstRow = ind < 2
                                                    return (
                                                        < GridItem
                                                            paddingTop="100%"
                                                            position="relative"
                                                            key={`${value?.assetAddress}-${value?.assetId}-${ind}`}

                                                            onClick={() => {
                                                                //dont set a skin thats already set
                                                                if (!value.equipped) {
                                                                    setSkin({
                                                                        id: value.id,
                                                                        assetAddress: value.assetAddress,
                                                                        assetId: value.assetId,
                                                                        assetType: value.assetType
                                                                    })
                                                                }
                                                            }}
                                                        >
                                                            <Box
                                                                overflow="visible"
                                                                position="absolute"
                                                                top={firstRow ? "12px" : "4px"}
                                                                right="12px"
                                                                bottom="12px"
                                                                left={firstColumn ? "12px" : "4px"}
                                                                bg={value.equipped ? "rgba(14, 235, 168, 0.1)" : "inherit"}
                                                                _hover={value.equipped ? {} : { bg: "rgba(255, 255, 255, 0.06)" }}
                                                                _after={(value.equipped && !isSmallerThan285) ? { fontFamily: "heading", content: `"EQUIPPED"`, fontSize: "12px", bg: "teal.400", color: "#16132B", padding: "4px 8px", borderRadius: "8px 0px 4px 0px", marginTop: "100px", position: "absolute", bottom: "-1px", right: "-1px" } : {}}
                                                                cursor={value.equipped ? "default" : "pointer"}
                                                                borderRadius="4px"
                                                                border={value.equipped ? "1px solid" : "1px solid"}
                                                                borderColor={value.equipped ? "teal.400" : "transparent"}
                                                            >
                                                                <Media imageProps={{ objectFit: "contain" }} padding="12%" uri={skinToImageUrl(value)} />
                                                            </Box>
                                                        </GridItem >
                                                    );
                                                })}

                                            </Grid>
                                        </VStack>
                                    }
                                </PortalTab>
                            </GridItem>
                            {/* END SKINS */}



                            {/* START IN-GAME ITEMS */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 0 6px 0",
                                    md: "16px 0 6px 8px",
                                    lg: "16px 8px 6px 8px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 4 }}
                            >
                                <PortalTab
                                    isLoading={isInGameItemsDataLoading}
                                    title="In-Game Items"
                                    emptyMessage={inGameItems?.length ? undefined : "No in-game items found."}
                                    icon={<DeviceGamepad size="18px" />}
                                    footer={<Button
                                        rightIcon={<CaretRight></CaretRight>}
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            const exportAssets = []
                                            for (const hash of inGameCheckboxGroupValue) {
                                                const ass = inGameItems?.find(ass => ass.hash === hash)
                                                if (!!ass) {
                                                    exportAssets.push(ass)
                                                }
                                            }

                                            //just export one items now but we are setup for multiple later
                                            if (exportAssets.length > 0) {
                                                const value = exportAssets[0]
                                                dispatch(setOutModalTokens(exportAssets))
                                                dispatch(openOutModal())
                                            }
                                        }}
                                        isDisabled={inGameCheckboxGroupValue.length === 0} w="100%">EXPORT TO WALLET</Button>}
                                >
                                    {!!inGameItems &&
                                        <Virtuoso
                                            style={{ height: "100%", }}
                                            totalCount={inGameItems.length}
                                            itemContent={(index) => {
                                                const token = inGameItems[index]

                                                const isCheckBoxDisabled = (token: InGameTokenMaybeMetadata) => {
                                                    if (token.enraptured) {
                                                        return true
                                                    }

                                                    const isChecked = inGameCheckboxGroupValue.includes(token.hash!)
                                                    if (!isChecked) {
                                                        if (inGameCheckboxGroupValue.length >= 20) {
                                                            return true
                                                        }
                                                        const firstCheck = inGameItems.find(tok => tok.hash === inGameCheckboxGroupValue[0])
                                                        if (!!firstCheck) {
                                                            if (token.multiverseVersion === MultiverseVersion.V1) {
                                                                return true
                                                            }
                                                            const firstCheckChainId = firstCheck?.chainId
                                                            if (!!firstCheckChainId && (String(firstCheckChainId) !== String(token?.chainId))) {
                                                                return true
                                                            }
                                                        }
                                                    }

                                                    return false
                                                }
                                                return (
                                                    <InGameItem
                                                        token={token}

                                                        key={token.hash}

                                                        //checkbox props
                                                        onClick={() => {
                                                            dispatch(setInGameItemModalToken(token))
                                                            dispatch(openInGameItemModal())
                                                        }}

                                                        onCheckboxChange={(e) => {
                                                            if (e.target.checked) {
                                                                setInGameCheckboxGroupValue([...inGameCheckboxGroupValue, token.hash!])
                                                            } else {
                                                                setInGameCheckboxGroupValue([...inGameCheckboxGroupValue.filter(id => id !== token.hash)])
                                                            }
                                                        }}
                                                        isChecked={inGameCheckboxGroupValue.includes(String(token.hash))}
                                                        checkboxValue={String(token.hash)}
                                                        isCheckboxDisabled={isCheckBoxDisabled(token)}
                                                    >
                                                    </InGameItem>

                                                )
                                            }}
                                        >
                                        </Virtuoso>
                                    }

                                </PortalTab>
                            </GridItem>
                            {/* END IN-GAME ITEMS */}



                            {/* START ON-CHAIN ITEMS */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 0 6px 0",
                                    md: "8px 8px 6px 0",
                                    lg: "16px 0 6px 8px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 4 }}
                            >
                                <PortalTab
                                    title="On-Chain Items"
                                    emptyMessage={emptyOnChainItemsMessage}
                                    isLoading={isOnChainItemsLoading}
                                    icon={<Wallet size="18px" />}
                                    footer={
                                        <Button
                                            leftIcon={<CaretLeft></CaretLeft>}
                                            onClick={(e) => {

                                                e.stopPropagation();

                                                const importAssets: StandardizedOnChainTokenWithRecognizedTokenData[] = []
                                                for (const id of onChainCheckboxGroupValue) {
                                                    const ass = onChainItems?.find(ass => ass.id === id)
                                                    if (!!ass) {
                                                        importAssets.push(ass)
                                                    }
                                                }
                                                if (importAssets.length > 0) {
                                                    dispatch(setInModalTokens(importAssets))
                                                    dispatch(openInModal())
                                                }


                                            }}
                                            isDisabled={onChainCheckboxGroupValue.length === 0} w="100%">IMPORT TO GAME
                                        </Button>}
                                >

                                    {!!onChainItems &&
                                        <Virtuoso
                                            style={{ height: "100%" }}
                                            totalCount={onChainItems.length}
                                            itemContent={(index) => {
                                                const token = onChainItems[index]

                                                const isCheckBoxDisabled = (token: StandardizedOnChainTokenWithRecognizedTokenData) => {
                                                    const isChecked = onChainCheckboxGroupValue.includes(token.id)
                                                    if (!isChecked) {
                                                        if (onChainCheckboxGroupValue.length >= 20) {
                                                            return true
                                                        }
                                                        const firstCheck = onChainItems.find(tok => tok.id === onChainCheckboxGroupValue[0])
                                                        if (!!firstCheck) {
                                                            if (token.multiverseVersion === MultiverseVersion.V1) {
                                                                return true
                                                            }
                                                            const firstCheckAssetAddress = firstCheck?.assetAddress?.toLowerCase()
                                                            //fungible one at a time for now
                                                            if (firstCheck.treatAsFungible) {
                                                                return true
                                                            }

                                                            if (!!firstCheckAssetAddress && firstCheckAssetAddress !== token?.assetAddress?.toLowerCase()) {
                                                                return true
                                                            }
                                                        }

                                                    }
                                                    return false
                                                }
                                                return (
                                                    <OnChainItem
                                                        token={token}

                                                        key={token.id}

                                                        onCheckboxChange={(e) => {
                                                            if (e.target.checked) {
                                                                setOnChainCheckboxGroupValue([...onChainCheckboxGroupValue, token.id])
                                                            } else {
                                                                setOnChainCheckboxGroupValue([...onChainCheckboxGroupValue.filter(id => id !== token.id)])
                                                            }
                                                        }}
                                                        isChecked={onChainCheckboxGroupValue.includes(token.id)}
                                                        checkboxValue={token.id}
                                                        isCheckboxDisabled={isCheckBoxDisabled(token)}
                                                    >
                                                    </OnChainItem>
                                                )
                                            }}
                                        >
                                        </Virtuoso>
                                    }
                                </PortalTab>
                            </GridItem>
                            {/* END ON-CHAIN ITEMS */}



                            {/* START IN-GAME RESOURCES */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 0 6px 0",
                                    md: "8px 0 6px 8px",
                                    lg: "8px 8px 14px 0"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 6 }}
                            >
                                <PortalTab
                                    title="In-Game Resources"
                                    isLoading={isInGameResourcesLoading}
                                    emptyMessage={inGameResources?.length ? undefined : "No in-game resources available."}
                                    footer={
                                        <Button
                                            rightIcon={<CaretRight></CaretRight>}
                                            onClick={() => {
                                                dispatch(setSummonModalSummonAddresses(summonAddresses))
                                                dispatch(openSummonModal())
                                            }}
                                            isDisabled={isSummonButtonDisabled} w="100%">SUMMON ALL RESOURCES
                                        </Button>
                                    }
                                    icon={<DeviceGamepad size="18px" />}
                                >
                                    {!!inGameResources &&
                                        <Virtuoso
                                            style={{ height: "100%", }}
                                            totalCount={inGameResources.length}
                                            itemContent={(index) => {
                                                const token = inGameResources[index]
                                                return (
                                                    <InGameResource
                                                        token={token}

                                                        key={`${token.assetAddress}~${token.assetId}`} //update key
                                                    >
                                                    </InGameResource>
                                                )
                                            }}
                                        >
                                        </Virtuoso>
                                    }
                                </PortalTab>
                            </GridItem>
                            {/* END IN-GAME RESOURCES */}



                            {/* START ON-CHAIN RESOURCES */}
                            <GridItem
                                zIndex="2"
                                padding={{
                                    base: "16px 0 7px 0",
                                    md: "8px 0 15px 0",
                                    lg: "8px 0 15px 8px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 12, lg: 6 }}
                            >
                                <PortalTab
                                    title="On-Chain Resources"
                                    emptyMessage={emptyOnChainResourcesMessage}
                                    isLoading={isOnChainResourcesLoading}
                                    icon={<Wallet size="18px" />}>
                                    {!!onChainResources &&
                                        <Virtuoso
                                            style={{ height: "100%", }}
                                            totalCount={onChainResources.length}
                                            itemContent={(index) => {
                                                const token = onChainResources[index]
                                                return (
                                                    <OnChainResource
                                                        token={token}

                                                        key={token.id}

                                                        onClick={() => {
                                                            //user will be able to see resources in their metamask wallet as under assets, nothing is moving
                                                            dispatch(setOnChainResource(token))
                                                            dispatch(openOnChainResourceModal())
                                                        }}
                                                    >
                                                    </OnChainResource>

                                                )
                                            }}
                                        >
                                        </Virtuoso>
                                    }
                                </PortalTab>
                            </GridItem>
                            {/* END ON-CHAIN RESOURCES */}


                        </Grid >

                        {/**  <ItemDetailsModal data={itemDetailDialogData} isOpen={isItemDetailDialogOpen} onClose={onItemDetailDialogClose}></ItemDetailsModal>*/}
                    </>
                }
            </Container >
            <InGameItemModal />
            <OnChainResourceModal />
            <OutModal />
            <SummonModal />
            <InModal />

        </>
    )
};

export default ProfilePage;





