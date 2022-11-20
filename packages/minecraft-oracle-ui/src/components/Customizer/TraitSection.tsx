import { Box, useDimensions } from "@chakra-ui/react"
import React, { useRef } from "react"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { CompositeConfigPartDto } from "../../state/api/types"
import TraitVirtualList from "./TraitVirtualList"

export type TraitSectionProps = {
    part: CompositeConfigPartDto
}


const TraitSection = ({ part }: TraitSectionProps) => {

    const { width } = useWindowDimensions();

    React.useEffect(() => {
        console.log("WINDOW DIMENSIONS CHANGE")
    }, [width])

    const gridWidth: number = React.useMemo(() => {
        let twoCol = false
        if (width >= 992) {
            twoCol = true
        }

        const lrPadding = twoCol ? 48 : 16
        const colWidth = twoCol ? Math.floor(width / 2) : width
        let padSubtract = twoCol ? lrPadding : lrPadding * 2
        if (twoCol) {
            padSubtract = padSubtract + 20
        }
        return Math.floor(colWidth - padSubtract)
    }, [width])

    const numColumns: number = React.useMemo(() => {
        return Math.floor(gridWidth / 200)
    }, [gridWidth])

    const columnWidth: number = React.useMemo(() => Math.floor(gridWidth / numColumns), [gridWidth, numColumns])

    const rowHeight: number = React.useMemo(() => columnWidth + 96, [columnWidth, numColumns])


    return <Box w={gridWidth} h="300px" minH="300px" overflow="hidden">
        <TraitVirtualList numColumns={numColumns} columnWidth={columnWidth} rowHeight={rowHeight} gridWidth={gridWidth} gridHeight={300} part={part}></TraitVirtualList>

    </Box>
}
export default TraitSection