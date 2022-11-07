import { Stack, Box, VStack, Image, Fade, HStack, Button, Tag, FormControl, FormLabel, NumberInput, NumberInputField, useDimensions } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ComponentType, memo, ReactNode, useRef } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { PhotoOff, Stack3, Wallet } from "tabler-icons-react"
import { useActiveWeb3React } from "../../hooks"
import LibraryCustomizerCard from "./LibraryCustomizerCard"
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../state/slices/authSlice"
import { useGetInGameItemsQuery } from "../../state/api/bridgeApi"
import { useGetExosamaOnChainTokensQuery } from "../../state/api/generatedSquidExosamaApi"
import { useGetMarketplaceOnChainTokensQuery } from "../../state/api/generatedSquidMarketplaceApi"
import { StandardizedOnChainToken, standardizeMarketplaceOnChainTokens, standardizeExosamaOnChainTokens } from "../../utils/graphqlReformatter"

export type CustomizerAsset = {
    chainId: number,
    assetAddress: string,
    assetId: number,
    staked: boolean,
    inWallet: boolean,
    edited: boolean
}
export type CustomizerLibraryProps = {
    librarySection: string,
    children?: ReactNode,
}

const CustomizerLibrary = ({ librarySection, children }: CustomizerLibraryProps) => {
    const { account, chainId, library } = useActiveWeb3React()
    const accessToken = useSelector(selectAccessToken)
    const address: string = React.useMemo(() => account?.toLowerCase() ?? "0x999999999999999999999999999", [account])


    const { data: marketplaceOnChainTokensData, currentData: currentMarketplaceOnChainTokensData, isLoading: isMarketplaceOnChainTokensLoading, isFetching: isMarketplaceOnChainTokensFetching, isError: isMarketplaceOnChainTokensError, error: marketplaceOnChainTokensError, refetch: refetchMarketplaceOnChainTokens } = useGetMarketplaceOnChainTokensQuery({ owner: address }, { skip: !account })
    const { data: exosamaOnChainTokensData, currentData: currentExosamaOnChainTokensData, isLoading: isExosamaOnChainTokensLoading, isFetching: isExosamaOnChainTokensFetching, isError: isExosamaOnChainTokensError, error: exosamaOnChainTokensError, refetch: refetchExosamaOnChainTokens } = useGetExosamaOnChainTokensQuery({ owner: address }, { skip: !account })
    const { data: inGameItemsData, isLoading: isInGameItemsDataLoading, isFetching: isInGameItemsDataFetching, isError: isInGameItemsError, error: inGameItemsError, refetch: refetchInGameItems } = useGetInGameItemsQuery(undefined, { skip: !accessToken })

    const standardizedMarketplaceOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeMarketplaceOnChainTokens(marketplaceOnChainTokensData), [marketplaceOnChainTokensData])
    const standardizedExosamaOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeExosamaOnChainTokens(exosamaOnChainTokensData), [exosamaOnChainTokensData])


    const FixedSizeGrid = _FixedSizeGrid as ComponentType<FixedSizeGridProps>;

    const [tokenId, setTokenId] = React.useState<string>()
    const navigate = useNavigate()
    const listContainerRef = useRef<any>()
    const dimensions = useDimensions(listContainerRef, true)

    const gridWidth: number | undefined = React.useMemo(() => dimensions?.contentBox?.width, [dimensions?.contentBox?.width])
    const numColumns: number | undefined = React.useMemo(() => {
        if (!!gridWidth) {
            return Math.floor(gridWidth / 250)
        } else {
            return undefined
        }
    }, [gridWidth])

    const columnWidth: number | undefined = React.useMemo(() => (!!gridWidth && !!numColumns) ? Math.floor(gridWidth / numColumns) : undefined, [gridWidth, numColumns])

    const gridHeight: number | undefined = React.useMemo(() => dimensions?.contentBox?.height, [dimensions?.contentBox?.height])
    const rowHeight: number | undefined = React.useMemo(() => !!columnWidth ? Math.min(Math.floor(columnWidth * 1.4), 580) : undefined, [columnWidth])
    const gridDimensionsReady: boolean = React.useMemo(() => !!numColumns && !!gridWidth && !!columnWidth && !!gridHeight && !!rowHeight, [gridWidth, columnWidth, gridHeight, numColumns, rowHeight])

    const allCustomizerAssets: CustomizerAsset[] = React.useMemo(() => {
        let assets: CustomizerAsset[] = []
        for (let i = 1; i <= 10000; i++) {
            assets.push({ chainId: 1, assetAddress: "0xac5c7493036de60e63eb81c5e9a440b42f47ebf5", assetId: i, inWallet: false, staked: false, edited: false })
        }
        for (let i = 1; i <= 1000; i++) {
            assets.push({ chainId: 1285, assetAddress: "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a", assetId: i, inWallet: false, staked: false, edited: false })
        }

        if (!!inGameItemsData) {
            for (const ass of inGameItemsData) {
                const matchingAss = assets.find(a => a.assetAddress.toLowerCase() === ass.assetAddress.toLowerCase() && String(a.assetId) === ass.assetId)
                if (!!matchingAss) {
                    matchingAss.staked = true
                }
            }
        }

        for (const ass of [...standardizedMarketplaceOnChainTokens, ...standardizedExosamaOnChainTokens]) {
            const matchingAss = assets.find(a => a.assetAddress.toLowerCase() === ass.assetAddress.toLowerCase() && String(a.assetId) === String(ass.numericId))
            if (!!matchingAss) {
                matchingAss.inWallet = true
            }
        }
        return assets
    }, [inGameItemsData, standardizedMarketplaceOnChainTokens, standardizedExosamaOnChainTokens])


    const customizerAssets: CustomizerAsset[] = React.useMemo(() => {
        let assets: CustomizerAsset[] = allCustomizerAssets
        if (librarySection === "exosama") {
            assets = assets.filter(a => a.assetAddress === "0xac5c7493036de60e63eb81c5e9a440b42f47ebf5")
        } else if (librarySection === "moonsama") {
            assets = assets.filter(a => a.assetAddress === "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a")
        } else if (librarySection === "staked") {
            assets = assets.filter(a => a.staked)
        } else if (librarySection === "wallet") {
            assets = assets.filter(a => a.inWallet)
        }
        if (!!tokenId) {
            const matchingToken = assets.find(a => String(a.assetId) === String(tokenId))
            if (!!matchingToken) {
                assets = [matchingToken]
            } else {
                assets = []
            }
        }
        return assets
    }, [allCustomizerAssets, tokenId, librarySection])

    const errorMessage: string | undefined = React.useMemo(() => {
        if (librarySection === "wallet" && !account) {
            return "Please connect a wallet to see your NFTs."
        }
        if (librarySection === "staked" && !accessToken) {
            return "Please login to see your staked NFTs."
        }
        if (customizerAssets?.length === 0) {
            return "No available or matching assets."
        }
        return undefined
    }, [account, librarySection, customizerAssets])

    React.useEffect(() => {
        if (!!errorMessage && errorMessage !== "No available or matching assets.") {
            setTokenId(undefined)
        }
    }, [errorMessage])

    React.useEffect(() => {
        setTokenId("")
    }, [librarySection])


    const LibraryCell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
        const w: number = parseInt(style?.width as string) - 8
        const h: number = parseInt(style?.height as string) - 8
        console.log(style)

        const asset = customizerAssets[(data.numCols * rowIndex) + columnIndex]

        if (!!asset) {
            return (
                <Box style={style}>
                    <LibraryCustomizerCard
                        owned={asset.inWallet || asset.staked}
                        edited={false}
                        width={w}
                        height={h}
                        chainId={asset.chainId}
                        assetAddress={asset.assetAddress}
                        assetId={asset.assetId}
                        imageUrl={`${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}/customizer/${asset.chainId}/${asset.assetAddress}/${asset.assetId}.png`}
                    ></LibraryCustomizerCard>
                </Box>

            )
        } else {
            return <></>
        }

    }, areEqual);
    return (
        <Box bg="gray.900" className="moonsamaFullHeight" position="relative" left="calc(-1 * var(--moonsama-leftright-padding))" w="calc(max(320px, 100vw))" overflowX="scroll">
            <Stack spacing="0" w="100%" h="100%" direction={{ base: "column", md: "row" }} >
                {/** START Library Nav, on chain/wallet, etc */}
                <Stack fontWeight="400" fontFamily="Rubik" spacing="0" w={{ base: "100%", md: "225px" }} bg="gray.800" paddingBottom="16px" paddingLeft="var(--moonsama-leftright-padding)" direction={{ base: "row", md: "column" }} justifyContent={{ base: "space-around", md: "flex-start" }}>
                    <VStack spacing="0" alignItems="flex-start" paddingTop="16px">
                        <Box color="gray.400" fontSize="12px" lineHeight="16px">
                            MY NFTs
                        </Box>
                        <Box h="8px"></Box>
                        <Button onClick={() => navigate(`/customizer/library/staked`)} leftIcon={<Stack3 color="var(--chakra-colors-teal-200)" />} w="120px" variant="moonsamaGhost">Staked</Button>
                        <Box h="8px"></Box>
                        <Button onClick={() => navigate(`/customizer/library/wallet`)} leftIcon={<Wallet color="var(--chakra-colors-teal-200)" />} w="120px" variant="moonsamaGhost">Wallet</Button>
                    </VStack>
                    <VStack spacing="0" alignItems="flex-start" paddingTop="16px">
                        <Box color="gray.400" fontSize="12px" lineHeight="16px">
                            MULTIVERSE NFTs
                        </Box>
                        <Box h="8px"></Box>
                        <Button w="120px" onClick={() => navigate(`/customizer/library/exosama`)} variant="moonsamaGhost">Exosama&nbsp;</Button>
                        <Box h="8px"></Box>
                        <Button w="120px" onClick={() => navigate(`/customizer/library/moonsama`)} variant="moonsamaGhost">Moonsama</Button>
                    </VStack>
                </Stack>
                {/** End Library Nav, on chain/wallet, etc */}

                <VStack flex="1" bg="gray.900" padding="16px" paddingRight="var(--moonsama-leftright-padding)" w="100%" overflow="hidden" maxW="1243px">
                    <HStack spacing="0" justifyContent="space-between" paddingBottom="24px" w="100%">
                        <VStack spacing="0" alignItems="flex-start" flex="1">
                            <Box fontSize="16px" lineHeight="24px" fontFamily="Rubik" color="gray.400">{["staked", "wallet"].includes(librarySection ?? "") ? "MY NFTs" : "MULTIVERSE NFTs"}</Box>
                            <Box fontSize="30px" lineHeight="36px" fontFamily="Orbitron" color="white" wordBreak="break-all">{librarySection?.toUpperCase()}</Box>
                        </VStack>
                        <Box w="16px"></Box>
                        <VStack spacing="0" w="105px">
                            <FormControl isInvalid={false}>
                                <FormLabel>Token ID</FormLabel>
                                <NumberInput min={1} max={10000} step={1} inputMode="numeric" precision={0} value={tokenId} onChange={(e) => setTokenId(e)} isDisabled={!!errorMessage && errorMessage !== "No available or matching assets."}>
                                    <NumberInputField />
                                </NumberInput>
                            </FormControl>
                        </VStack>
                    </HStack>
                    <Box flex="1" w={{ base: "calc(100% + 6px)", md: "calc(100% + 8px)" }} ref={listContainerRef} overflow="hidden" position="relative" left={{ base: "4px", md: "4px" }} top="-4px" >
                        {!!errorMessage
                            ?
                            <Box>{errorMessage}</Box>
                            :
                            <>
                                {gridDimensionsReady

                                    ?

                                    <FixedSizeGrid
                                        style={{ overflowX: "hidden" }}
                                        columnCount={numColumns!}
                                        columnWidth={columnWidth!}
                                        rowCount={Math.ceil(customizerAssets.length / numColumns!)}
                                        rowHeight={rowHeight!}

                                        height={gridHeight!}
                                        width={gridWidth!}
                                        //traitOptionsAssets, numCols, fetchingCustomizations, selectedAsset: getSelectedAsset(expanded), onSelectAsset: selectAsset, myCustomizations
                                        itemData={{ numCols: numColumns!, rowHeight: rowHeight!, columnWidth: columnWidth! }}
                                        overscanRowCount={3}
                                    // className={grid}
                                    >
                                        {LibraryCell}
                                    </FixedSizeGrid>

                                    :
                                    <Box>Grid Dimensions not ready</Box>
                                }
                            </>}

                    </Box>
                </VStack>
            </Stack >
        </Box >
    )
}

export default CustomizerLibrary
