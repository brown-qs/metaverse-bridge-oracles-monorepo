import React, { ComponentType, memo } from "react"
import { CompositeConfigPartDto } from "../../state/api/types"
import { GridChildComponentProps, areEqual, FixedSizeGrid as _FixedSizeGrid, FixedSizeGridProps } from "react-window"
import { Box } from "@chakra-ui/react"
import TraitCustomizerCard from "./TraitCustomizerCard"
import { ChainId } from "../../constants"
import { useDispatch, useSelector } from "react-redux"
import { addCustomizerAssets, CustomizerCustomization, removeCustomizerAssets, selectCustomizerCustomizations } from "../../state/slices/customizerSlice"

export type TraitVirtualListProps = {
    numColumns: number,
    columnWidth: number,
    rowHeight: number,
    gridWidth: number,
    gridHeight: number,
    part: CompositeConfigPartDto,
    parentChainId: ChainId,
    parentAssetAddress: string,
    parentAssetId: number,
}


const TraitVirtualList = ({ numColumns, columnWidth, rowHeight, gridWidth, gridHeight, part, parentChainId, parentAssetAddress, parentAssetId }: TraitVirtualListProps) => {



    const FixedSizeGrid = _FixedSizeGrid as ComponentType<FixedSizeGridProps>;
    const TraitCell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
        let w: number = parseInt(style?.width as string) - 8
        let h: number = parseInt(style?.height as string) - 8
        const part: CompositeConfigPartDto = data.part
        //   w = w + 8
        //h = h + 8
        const asset = part.items[(data.numCols * rowIndex) + columnIndex]
        const traitValue = asset?.attributes?.[0]?.value ?? ""


        if (!!asset) {
            return (
                <Box style={style}>
                    <TraitCustomizerCard
                        owned={false}
                        synthetic={data.part.synthetic}
                        default={true}
                        width={w}
                        height={h}
                        chainId={part.chainId}
                        assetAddress={part.assetAddress}
                        assetId={asset.assetId}
                        traitValue={traitValue}
                        imageUrl={`${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}/customizer/${part.chainId}/${part.assetAddress}/${asset.assetId}.png`}
                        parentChainId={parentChainId}
                        parentAssetAddress={parentAssetAddress}
                        parentAssetId={parentAssetId}
                    ></TraitCustomizerCard>
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
        rowCount={Math.ceil(part.items.length / numColumns)}
        rowHeight={rowHeight}

        height={gridHeight}
        width={gridWidth}
        itemData={{ numCols: numColumns, part }}
        overscanRowCount={3}
    // className={grid}
    >
        {TraitCell}
    </FixedSizeGrid>)
}
export default React.memo(TraitVirtualList)