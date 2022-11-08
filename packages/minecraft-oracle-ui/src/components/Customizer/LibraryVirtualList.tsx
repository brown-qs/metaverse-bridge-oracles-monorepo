import { Box, VStack, Image, Fade, HStack, Button, Tag, Link } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ComponentType, memo } from "react"
import { useNavigate } from "react-router-dom"
import { GridChildComponentProps, areEqual, FixedSizeGrid as _FixedSizeGrid, FixedSizeGridProps } from "react-window"
import { PhotoOff } from "tabler-icons-react"
import CustomizerCard, { CustomizerCardProps } from "./CustomizerCard"
import { CustomizerLibraryAsset } from "./CustomizerLibrary"
import LibraryCustomizerCard from "./LibraryCustomizerCard"

type LibraryVirtualListProps = {
    numColumns: number,
    columnWidth: number,
    rowHeight: number,
    gridWidth: number,
    gridHeight: number,
    assets: CustomizerLibraryAsset[],
}

const LibraryVirtualList = ({ numColumns, columnWidth, rowHeight, gridWidth, gridHeight, assets }: LibraryVirtualListProps) => {
    const FixedSizeGrid = _FixedSizeGrid as ComponentType<FixedSizeGridProps>;
    const LibraryCell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
        const w: number = parseInt(style?.width as string) - 8
        const h: number = parseInt(style?.height as string) - 8

        const asset = data.assets[(data.numCols * rowIndex) + columnIndex]

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

    return (<FixedSizeGrid
        style={{ overflowX: "hidden" }}
        columnCount={numColumns}
        columnWidth={columnWidth}
        rowCount={Math.ceil(assets.length / numColumns)}
        rowHeight={rowHeight}

        height={gridHeight}
        width={gridWidth}
        itemData={{ numCols: numColumns, assets }}
        overscanRowCount={3}
    // className={grid}
    >
        {LibraryCell}
    </FixedSizeGrid>)
}

export default React.memo(LibraryVirtualList)
