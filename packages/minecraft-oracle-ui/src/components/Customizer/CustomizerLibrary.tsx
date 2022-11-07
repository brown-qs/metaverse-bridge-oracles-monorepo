import { Stack, Box, VStack, Image, Fade, HStack, Button, Tag, FormControl, FormLabel, NumberInput, NumberInputField, useDimensions } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ComponentType, memo, ReactNode, useRef } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { PhotoOff, Stack3, Wallet } from "tabler-icons-react"
import { useActiveWeb3React } from "../../hooks"
import LibraryCustomizerCard from "./LibraryCustomizerCard"
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';


export type CustomizerLibraryProps = {
    librarySection: string,
    children?: ReactNode,
}

const CustomizerLibrary = ({ librarySection, children }: CustomizerLibraryProps) => {
    const FixedSizeGrid = _FixedSizeGrid as ComponentType<FixedSizeGridProps>;

    const navigate = useNavigate()
    const listContainerRef = useRef<any>()
    const dimensions = useDimensions(listContainerRef, true)
    console.log(dimensions)
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
    const rowHeight: number | undefined = React.useMemo(() => !!columnWidth ? Math.floor(columnWidth * 1.35) : undefined, [columnWidth])
    const gridDimensionsReady: boolean = React.useMemo(() => !!numColumns && !!gridWidth && !!columnWidth && !!gridHeight && !!rowHeight, [gridWidth, columnWidth, gridHeight, numColumns, rowHeight])

    console.log(`gridWidth: ${gridWidth} numCol: ${numColumns} columWidth: ${columnWidth}`)
    const NUM_COLS = 2
    const LibraryCell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
        const w = style.width
        console.log(style)
        const assetId = ((data.numCols * rowIndex) + columnIndex) + 1;
        return (
            <Box style={style}>
                <LibraryCustomizerCard
                    owned={true}
                    edited={true}
                    width={parseInt(style?.width as any) ?? 280}
                    chainId={1}
                    assetAddress={"0xac5c7493036de60e63eb81c5e9a440b42f47ebf5"}
                    assetId={assetId}
                    imageUrl={`${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}/customizer/1/0xac5c7493036de60e63eb81c5e9a440b42f47ebf5/${assetId}.png`}
                ></LibraryCustomizerCard>
            </Box>

        )
    }, areEqual);
    return (
        <Box bg="gray.800" className="moonsamaFullHeight" position="relative" left="calc(-1 * var(--moonsama-leftright-padding))" w="100vw">
            <Stack spacing="0" w="100%" h="100%" direction={{ base: "column", md: "row" }}>
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

                <VStack flex="1" bg="gray.900" padding="16px" paddingRight="var(--moonsama-leftright-padding)" w="100%" border="1px solid orange" >
                    <HStack spacing="0" justifyContent="space-between" paddingBottom="24px" w="100%">
                        <VStack spacing="0" alignItems="flex-start" flex="1">
                            <Box fontSize="16px" lineHeight="24px" fontFamily="Rubik" color="gray.400">{["staked", "wallet"].includes(librarySection ?? "") ? "MY NFTs" : "MULTIVERSE NFTs"}</Box>
                            <Box fontSize="30px" lineHeight="36px" fontFamily="Orbitron" color="white" wordBreak="break-all">{librarySection?.toUpperCase()}</Box>
                        </VStack>
                        <Box w="16px"></Box>
                        <VStack spacing="0" w="105px">
                            <FormControl isInvalid={false}>
                                <FormLabel>Token ID</FormLabel>
                                <NumberInput min={1} max={10000} step={1} inputMode="numeric" precision={0}>
                                    <NumberInputField />
                                </NumberInput>
                            </FormControl>
                        </VStack>
                    </HStack>
                    <Box flex="1" w="100%" border="1px solid red" alignContent="stretch" ref={listContainerRef} overflow="hidden">
                        {gridDimensionsReady

                            ?

                            <FixedSizeGrid
                                columnCount={numColumns!}
                                columnWidth={columnWidth!}
                                rowCount={Math.ceil(10000 / columnWidth!)}
                                rowHeight={rowHeight!}

                                height={gridHeight!}
                                width={gridWidth!}
                                //traitOptionsAssets, numCols, fetchingCustomizations, selectedAsset: getSelectedAsset(expanded), onSelectAsset: selectAsset, myCustomizations
                                itemData={{ numCols: NUM_COLS }}
                                overscanRowCount={3}
                            // className={grid}
                            >
                                {LibraryCell}
                            </FixedSizeGrid>

                            :
                            <Box>Grid Dimensions not ready</Box>
                        }
                    </Box>
                </VStack>
            </Stack >
        </Box >
    )
}

export default CustomizerLibrary
