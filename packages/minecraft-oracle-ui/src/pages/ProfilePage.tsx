
import { useAccountDialog, useActiveWeb3React } from 'hooks';
import { stringToStringAssetType } from 'utils/subgraph';
import { Fraction } from 'utils/Fraction';
import { countGamePassAssets } from 'utils';
import { useAssetDialog } from '../hooks/useAssetDialog/useAssetDialog';
import React, { ReactNode, useEffect, useState } from 'react';
import { SKIN_LABELS } from '../constants/skins';
import { BURNABLE_RESOURCES_IDS, ChainId, DEFAULT_CHAIN, NETWORK_NAME } from "../constants";
import { AssetChainDetails } from '../components/AssetChainDetails/AssetChainDetails';
import { Image, Text, Box, Container, Grid, List, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack, background, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useCheckboxGroup, useMediaQuery, CircularProgress } from '@chakra-ui/react';
import { BridgeTab } from '../components/Bridge/BridgeTab';
import { InGameItem } from '../components/Bridge/InGameItem';
import { CaretLeft, CaretRight, DeviceGamepad, UserCircle, Wallet } from 'tabler-icons-react';
import { InGameResource } from '../components/Bridge/InGameResource';
import { OnChainResource } from '../components/Bridge/OnChainResource';
import { OnChainItem } from '../components/Bridge/OnChainItem';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'
import { useSetSkinMutation, useGetSkinsQuery, useUserProfileQuery, useGetRecognizedAssetsQuery, useGetInGameItemsQuery, useGetInGameResourcesQuery } from '../state/api/bridgeApi';

import { AssetDto, CollectionFragmentDto, SkinResponse } from '../state/api/types';
import { useGetMarketplaceMetadataQuery, useGetMarketplaceOnChainTokensQuery } from '../state/api/generatedSquidMarketplaceApi';
import { Media } from '../components';
import { BigNumber, utils } from 'ethers';
import { addRegonizedTokenDataToStandardizedOnChainTokens, formatInGameTokenName, formatOnChainTokenName, inGameMetadataParams, InGameTokenMaybeMetadata, inGameTokensCombineMetadata, StandardizedMetadata, StandardizedOnChainToken, StandardizedOnChainTokenWithRecognizedTokenData, standardizeExosamaMetadata, standardizeExosamaOnChainTokens, standardizeMarketplaceMetadata, standardizeMarketplaceOnChainTokens, standardizeRaresamaMetadata, standardizeRaresamaOnChainTokens } from '../utils/graphqlReformatter';
import { useDispatch, useSelector } from 'react-redux';
import { openSummonModal } from '../state/slices/summonModalSlice';
import { SummonModal } from '../components/modals/SummonModal';
import { ExportModal } from '../components/modals/ExportModal';
import { openExportModal, setExportTokens } from '../state/slices/exportModalSlice';
import { useGetRaresamaMetadataQuery, useGetRaresamaOnChainTokensQuery } from '../state/api/generatedSquidRaresamaApi';
import { selectBlockNumbers } from '../state/slices/blockNumbersSlice';
import { openOnChainResourceModal, setOnChainResource } from '../state/slices/onChainResourceModalSlice';
import { OnChainResourceModal } from '../components/modals/OnChainResourceModal';
import { EnraptureModal } from '../components/modals/EnraptureModal';
import { ImportModal } from '../components/modals/ImportModal';
import { openEnraptureModal, setEnraptureModalTokens } from '../state/slices/enraptureModalSlice';
import { openImportModal, setImportModalTokens } from '../state/slices/importModalSlice';
import { openInGameItemModal, setInGameItemModalToken } from '../state/slices/inGameItemModalSlice';
import { InGameItemModal } from '../components/modals/InGameItemModal';
import { useGetExosamaMetadataQuery, useGetExosamaOnChainTokensQuery } from '../state/api/generatedSquidExosamaApi';


const ProfilePage = () => {
    const dispatch = useDispatch()
    const blockNumbers = useSelector(selectBlockNumbers)
    const { account, chainId } = useActiveWeb3React()

    const address: string = React.useMemo(() => account?.toLowerCase() ?? "0x999999999999999999999999999", [account])

    //profile
    const { data: profile, error, isLoading: profileLoading } = useUserProfileQuery()

    //skins
    const { data: skins, error: skinsError, isLoading: skinsLoading, refetch: refetchSkins } = useGetSkinsQuery()
    const [setSkin, { error: setSkinError, isUninitialized, isLoading, isSuccess, isError, reset: setSkinReset }] = useSetSkinMutation()

    //on chain tokens (from indexers)
    const { data: raresamaOnChainTokensData, currentData: currentRaresamaOnChainTokensData, isLoading: isRaresamaOnChainTokensDataLoading, isFetching: isRaresamaOnChainTokensDataFetching, isError: isRaresamaOnChainTokensDataError, error: raresamaOnChainTokensError, refetch: refetchRaresamaOnChainTokens } = useGetRaresamaOnChainTokensQuery({ where: { owner: { id_eq: address }, contract: { OR: [{ id_eq: "0xf27a6c72398eb7e25543d19fda370b7083474735" }, { id_eq: "0xe4bf451271d8d1b9d2a7531aa551b7c45ec95048" }] } } })
    const { data: marketplaceOnChainTokensData, currentData: currentMarketplaceOnChainTokensData, isLoading: isMarketplaceOnChainTokensLoading, isFetching: isMarketplaceOnChainTokensFetching, isError: isMarketplaceOnChainTokensError, error: marketplaceOnChainTokensError, refetch: refetchMarketplaceOnChainTokens } = useGetMarketplaceOnChainTokensQuery({ owner: address })
    const { data: exosamaOnChainTokensData, currentData: exosamaMarketplaceOnChainTokensData, isLoading: isExosamaOnChainTokensLoading, isFetching: isExosamaOnChainTokensFetching, isError: isExosamaOnChainTokensError, error: exosamaOnChainTokensError, refetch: refetchExosamaOnChainTokens } = useGetExosamaOnChainTokensQuery({ owner: address })

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

    const standardizedMarketplaceOnChainTokens: StandardizedOnChainToken[] | undefined = React.useMemo(() => standardizeMarketplaceOnChainTokens(marketplaceOnChainTokensData), [marketplaceOnChainTokensData])
    const standardizedMarketplaceOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] | undefined = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedMarketplaceOnChainTokens, recognizedAssetsData), [standardizedMarketplaceOnChainTokens, recognizedAssetsData])

    const standardizedRaresamaOnChainTokens: StandardizedOnChainToken[] | undefined = React.useMemo(() => standardizeRaresamaOnChainTokens(raresamaOnChainTokensData), [raresamaOnChainTokensData])
    const standardizedRaresamaOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] | undefined = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedRaresamaOnChainTokens, recognizedAssetsData), [standardizedRaresamaOnChainTokens, recognizedAssetsData])

    const standardizedExosamaOnChainTokens: StandardizedOnChainToken[] | undefined = React.useMemo(() => standardizeExosamaOnChainTokens(exosamaOnChainTokensData), [exosamaOnChainTokensData])
    const standardizedExosamaOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] | undefined = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedExosamaOnChainTokens, recognizedAssetsData), [standardizedExosamaOnChainTokens, recognizedAssetsData])

    const allStandardizedOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] | undefined = React.useMemo(() => {
        if (!!standardizedMarketplaceOnChainTokensWithRecognizedTokenData || !!standardizedRaresamaOnChainTokensWithRecognizedTokenData || !!standardizedExosamaOnChainTokensWithRecognizedTokenData) {
            return [
                ...(standardizedMarketplaceOnChainTokensWithRecognizedTokenData ?? []),
                ...(standardizedRaresamaOnChainTokensWithRecognizedTokenData ?? []),
                ...(standardizedExosamaOnChainTokensWithRecognizedTokenData ?? [])

            ]
        } else {
            return undefined
        }
    }, [standardizedMarketplaceOnChainTokensWithRecognizedTokenData, standardizedRaresamaOnChainTokensWithRecognizedTokenData, standardizedExosamaOnChainTokensWithRecognizedTokenData])


    const onChainItems: StandardizedOnChainTokenWithRecognizedTokenData[] | undefined = React.useMemo(() => {
        if (!!allStandardizedOnChainTokensWithRecognizedTokenData) {
            return allStandardizedOnChainTokensWithRecognizedTokenData.filter((tok) => {
                if (tok?.importable === false && tok?.enrapturable === false) {
                    return false
                }

                //if there's a connected chain, only show items on that chain
                if (!!chainId && tok.chainId !== chainId) {
                    return false
                }
                return true
            })
        } else {
            return undefined
        }
    }, [allStandardizedOnChainTokensWithRecognizedTokenData, chainId])


    const onChainResources: StandardizedOnChainTokenWithRecognizedTokenData[] | undefined = React.useMemo(() => {
        if (!!allStandardizedOnChainTokensWithRecognizedTokenData) {
            return allStandardizedOnChainTokensWithRecognizedTokenData.filter((tok) => {
                if (!!chainId && chainId !== ChainId.MOONRIVER) {
                    return false
                }
                return tok.summonable
            })
        } else {
            return undefined
        }
    }, [allStandardizedOnChainTokensWithRecognizedTokenData, chainId])


    const inGameItemsMetadata: StandardizedMetadata[] | undefined = React.useMemo(() => {
        if (!!marketplaceInGameItemsMetadata || !!raresamaInGameItemsMetadata) {
            return [
                ...(standardizeMarketplaceMetadata(marketplaceInGameItemsMetadata) ?? []),
                ...(standardizeRaresamaMetadata(raresamaInGameItemsMetadata) ?? []),
                ...(standardizeExosamaMetadata(exosamaInGameItemsMetadata) ?? [])
            ]
        } else {
            return undefined
        }
    }, [marketplaceInGameItemsMetadata, raresamaInGameItemsMetadata, exosamaInGameItemsMetadata])

    const inGameItems: InGameTokenMaybeMetadata[] | undefined = React.useMemo(() => {
        if (!!inGameItemsData) {
            return [...inGameTokensCombineMetadata(inGameItemsData, inGameItemsMetadata)]
                .sort((a, b) => `${a.assetAddress}~${a.assetId}`.localeCompare(`${b.assetAddress}~${b.assetId}`))
                .filter((tok) => {
                    if (!!chainId && tok.chainId !== chainId) {
                        return false
                    }
                    return true
                })
        } else {
            return undefined
        }
    }, [inGameItemsData, inGameItemsMetadata, chainId])


    const inGameResourcesMetadata: StandardizedMetadata[] | undefined = React.useMemo(() => {
        if (!!marketplaceInGameResourcesMetadata) {
            return [
                ...(standardizeMarketplaceMetadata(marketplaceInGameResourcesMetadata) ?? [])
            ]
        } else {
            return undefined
        }
    }, [marketplaceInGameResourcesMetadata])


    const inGameResources: InGameTokenMaybeMetadata[] | undefined = React.useMemo(() => {
        if (!!inGameResourcesData) {
            return [...inGameTokensCombineMetadata(inGameResourcesData, inGameResourcesMetadata)]
                .sort((a, b) => `${a.assetAddress}~${a.assetId}`.localeCompare(`${b.assetAddress}~${b.assetId}`))
                .filter((tok) => {
                    if (!!chainId && chainId !== ChainId.MOONRIVER) {
                        return false
                    }
                    return true
                })
        } else {
            return undefined
        }
    }, [inGameResourcesData, inGameResourcesMetadata, chainId])

    //TODO: raresama/exosama loading
    const isOnChainItemsLoading: boolean = React.useMemo(() => {
        if (isMarketplaceOnChainTokensFetching && !currentMarketplaceOnChainTokensData) {
            return true
        } else {
            return false
        }
    }, [currentMarketplaceOnChainTokensData, isMarketplaceOnChainTokensFetching])

    const isOnChainResourcesLoading: boolean = React.useMemo(() => {
        if (isMarketplaceOnChainTokensFetching && !currentMarketplaceOnChainTokensData) {
            return true
        } else {
            return false
        }
    }, [currentMarketplaceOnChainTokensData, isMarketplaceOnChainTokensFetching])



    React.useEffect(() => {

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

    return (
        <>
            <Container
                bg="#080714"
                backgroundPosition="top right"
                backgroundRepeat="no-repeat"
                backgroundSize='600px 700px'
                minWidth="100%"
                margin="0"
                padding="0"
                height="100%"
                position="relative"
                overflow="visible">
                <Box position="absolute" w="100%" h="100%" bg="#080714">
                    <Image src={BackgroundImage} w="552px" h="622px" position="absolute" top="0" right="0" filter="blur(10px)"></Image>
                </Box>
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
                                    base: "96px 11px 0 11px",
                                    md: "96px 40px 0 40px"
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
                                    base: "16px 11px 7px 11px",
                                    md: "16px 8px 7px 40px"
                                }}
                                overflow="hidden"
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 4 }}
                            >
                                <BridgeTab
                                    title="Available Skins"
                                    emptyMessage={!!skins ? undefined : "No available skins found."}
                                    icon={<UserCircle size="18px" />}
                                    isLoading={skinsLoading}
                                >
                                    {!!skins &&
                                        <Grid templateColumns='repeat(2, 1fr)' width="100%">
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
                                    }
                                </BridgeTab>
                            </GridItem>
                            {/* END SKINS */}



                            {/* START IN-GAME ITEMS */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 11px 6px 11px",
                                    md: "16px 40px 6px 8px",
                                    lg: "16px 8px 6px 8px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 4 }}
                            >
                                <BridgeTab
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
                                                dispatch(setExportTokens([value]))
                                                dispatch(openExportModal())
                                            }
                                        }}
                                        isDisabled={inGameCheckboxGroupValue.length === 0} w="100%">EXPORT TO WALLET</Button>}
                                >

                                    <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">

                                        {!!inGameItems && inGameItems.map((item, ind) => {
                                            const checkBoxProps = getInGameCheckboxGroupProps({ value: item.hash })
                                            return (
                                                <InGameItem
                                                    lineOne={formatInGameTokenName(item)}
                                                    lineTwo={item.enraptured ? "Enraptured. Not exportable." : undefined}
                                                    mediaRedOutline={item.enraptured === true}
                                                    mediaUrl={item?.metadata?.image}
                                                    isLoading={!!item?.metadata !== true}
                                                    key={item.hash}
                                                    isCheckboxDisabled={item.enraptured === true}
                                                    checkboxValue={String(item.hash)}
                                                    isChecked={inGameCheckboxGroupValue.includes(String(item.hash))}
                                                    onCheckboxChange={(e) => {
                                                        //hack for now allow only one check
                                                        if (e.target.checked) {
                                                            setInGameCheckboxGroupValue([String(item.hash)])
                                                        } else {
                                                            setInGameCheckboxGroupValue([])
                                                        }

                                                        //do this when ready for multiple values
                                                        //checkBoxProps.onChange(e)
                                                    }}
                                                    highlightable={true}
                                                    onClick={() => {
                                                        dispatch(setInGameItemModalToken(item))
                                                        dispatch(openInGameItemModal())
                                                    }}
                                                >
                                                </InGameItem>
                                            );
                                        })}
                                    </VStack>


                                </BridgeTab>
                            </GridItem>
                            {/* END IN-GAME ITEMS */}



                            {/* START ON-CHAIN ITEMS */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 11px 6px 11px",
                                    md: "8px 8px 6px 40px",
                                    lg: "16px 40px 6px 8px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 4 }}
                            >
                                <BridgeTab
                                    title="On-Chain Items"
                                    emptyMessage={onChainItems?.length ? undefined : "No items found in wallet."}
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
                                                    if (importAssets[0].enrapturable) {
                                                        dispatch(setEnraptureModalTokens(importAssets))
                                                        dispatch(openEnraptureModal())
                                                    } else {
                                                        dispatch(setImportModalTokens(importAssets))
                                                        dispatch(openImportModal())
                                                    }
                                                }


                                            }}
                                            isDisabled={onChainCheckboxGroupValue.length === 0} w="100%">IMPORT TO GAME
                                        </Button>}
                                >

                                    <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                        {!!onChainItems && onChainItems.map((item, ind) => {
                                            const checkBoxProps = getOnChainCheckboxGroupProps({ value: item.id })

                                            return (
                                                <OnChainItem
                                                    lineOne={formatOnChainTokenName(item)}
                                                    lineTwo={item.enrapturable ? "This item will be burned into your account." : undefined}
                                                    mediaRedOutline={item.enrapturable === true}
                                                    mediaUrl={item?.metadata?.image ?? ""}
                                                    isLoading={false}
                                                    key={item.id} //update key
                                                    isCheckboxDisabled={false}
                                                    checkboxValue={item.id}
                                                    isChecked={onChainCheckboxGroupValue.includes(item.id)}
                                                    onCheckboxChange={(e) => {
                                                        //hack for now allow only one check
                                                        if (e.target.checked) {
                                                            setOnChainCheckboxGroupValue([item.id])
                                                        } else {
                                                            setOnChainCheckboxGroupValue([])
                                                        }

                                                        //do this when ready for multiple values
                                                        //checkBoxProps.onChange(e)
                                                    }}
                                                >
                                                </OnChainItem>
                                            );
                                        })}
                                    </VStack>


                                </BridgeTab>
                            </GridItem>
                            {/* END ON-CHAIN ITEMS */}



                            {/* START IN-GAME RESOURCES */}
                            <GridItem
                                zIndex="2"

                                padding={{
                                    base: "16px 11px 6px 11px",
                                    md: "8px 40px 6px 8px",
                                    lg: "8px 8px 14px 40px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 6, lg: 6 }}
                            >
                                <BridgeTab
                                    title="In-Game Resources"
                                    isLoading={isInGameResourcesLoading}
                                    emptyMessage={inGameResources?.length ? undefined : "No in-game resources available."}
                                    footer={
                                        <Button
                                            rightIcon={<CaretRight></CaretRight>}
                                            onClick={() => {
                                                if (!!account) {
                                                    console.log("open summon modal")
                                                    dispatch(openSummonModal())
                                                } else {
                                                    onAccountDialogOpen()
                                                }
                                            }}
                                            isDisabled={!inGameResources?.length} w="100%">SUMMON ALL RESOURCES
                                        </Button>
                                    }
                                    icon={<DeviceGamepad size="18px" />}
                                >
                                    <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                        {!!inGameResources && inGameResources.map((item, ind) => {

                                            return (
                                                <InGameResource
                                                    isLoading={!!item?.metadata !== true}
                                                    lineOne={item?.metadata?.name}
                                                    mediaUrl={item?.metadata?.image ?? ""}
                                                    key={`${item.assetAddress}~${item.assetId}`} //update key
                                                    balanceWei={utils.parseEther(item?.amount)}
                                                >
                                                </InGameResource>
                                            );
                                        })}
                                    </VStack>
                                </BridgeTab>
                            </GridItem>
                            {/* END IN-GAME RESOURCES */}



                            {/* START ON-CHAIN RESOURCES */}
                            <GridItem
                                zIndex="2"
                                padding={{
                                    base: "16px 11px 7px 11px",
                                    md: "8px 40px 15px 40px",
                                    lg: "8px 40px 15px 8px"
                                }}
                                rowSpan={1}
                                colSpan={{ base: 12, md: 12, lg: 6 }}
                            >
                                <BridgeTab
                                    title="On-Chain Resources"
                                    emptyMessage={onChainResources?.length ? undefined : "No resources found in wallet."}
                                    isLoading={isOnChainResourcesLoading}
                                    icon={<Wallet size="18px" />}>

                                    <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">

                                        {!!onChainResources && onChainResources.map((item) => {
                                            return (
                                                <OnChainResource
                                                    lineOne={formatOnChainTokenName(item)}
                                                    mediaUrl={item?.metadata?.image}
                                                    balanceWei={BigNumber.from(item.balance)}
                                                    isLoading={false}
                                                    key={item.id}
                                                    onClick={() => {
                                                        //user will be able to see resources in their metamask wallet as under assets, nothing is moving
                                                        dispatch(setOnChainResource(item))
                                                        dispatch(openOnChainResourceModal())
                                                    }}
                                                >
                                                </OnChainResource>
                                            )
                                        })}
                                    </VStack>

                                </BridgeTab>
                            </GridItem>
                            {/* END ON-CHAIN RESOURCES */}


                        </Grid >

                        {/**  <ItemDetailsModal data={itemDetailDialogData} isOpen={isItemDetailDialogOpen} onClose={onItemDetailDialogClose}></ItemDetailsModal>*/}
                    </>
                }
            </Container >
            <InGameItemModal />
            <OnChainResourceModal />
            <ExportModal />
            <SummonModal />
            <ImportModal />
            <EnraptureModal />

        </>
    )
};

export default ProfilePage;





