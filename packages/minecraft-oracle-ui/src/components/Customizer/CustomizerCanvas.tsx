import { Box, VStack, Image, Fade, HStack, Button, Tag } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ReactNode } from "react"
import { PhotoOff } from "tabler-icons-react"
import { ChainId } from "../../constants"
import { CompositeConfigItemDto } from "../../state/api/types"



export type CustomizerCanvasProps = {
    chainId: ChainId,
    assetAddress: string,
    assetId: number
}

const CustomizerCanvas = ({ chainId, assetAddress, assetId }: CustomizerCanvasProps) => {
    return <></>
}

export default CustomizerCanvas
