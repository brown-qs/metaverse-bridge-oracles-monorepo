import { Box, useDimensions } from "@chakra-ui/react"
import React, { useRef } from "react"
import { ChainId } from "../../constants"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { CompositeConfigPartDto } from "../../state/api/types"
import TraitVirtualList from "./TraitVirtualList"

export type TraitSectionProps = {
    parentChainId: ChainId,
    parentAssetAddress: string,
    parentAssetId: number,
    part: CompositeConfigPartDto
}


const TraitSection = ({ parentChainId, parentAssetAddress, parentAssetId, part }: TraitSectionProps) => {

    const { width } = useWindowDimensions();

    const gridWidth: number = React.useMemo(() => {
        let twoCol = false
        if (width >= 992) {
            twoCol = true
        }

        const lrPadding = twoCol ? 48 : 16
        const colWidth = twoCol ? Math.floor(width / 2) : width
        let padSubtract = twoCol ? lrPadding : lrPadding * 2
        if (twoCol) {
            padSubtract = padSubtract + 10
        }
        let gWidth = Math.floor(colWidth - padSubtract)
        return Math.min(gWidth, 758)
    }, [width])

    const numColumns: number = React.useMemo(() => {
        return Math.floor(gridWidth / 200)
    }, [gridWidth])

    const columnWidth: number = React.useMemo(() => Math.floor(gridWidth / numColumns), [gridWidth, numColumns])

    const rowHeight: number = React.useMemo(() => columnWidth + 96, [columnWidth, numColumns])


    return <Box w={gridWidth} h="300px" minH="300px" overflow="hidden">
        <TraitVirtualList numColumns={numColumns} columnWidth={columnWidth} rowHeight={rowHeight} gridWidth={gridWidth} gridHeight={300} part={part} parentChainId={parentChainId} parentAssetAddress={parentAssetAddress} parentAssetId={parentAssetId}></TraitVirtualList>
    </Box>
}
export default TraitSection