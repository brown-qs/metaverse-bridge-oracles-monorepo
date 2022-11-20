import { Box, VStack, Image, Fade, HStack, Button, Tag } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ReactNode } from "react"
import { PhotoOff } from "tabler-icons-react"


const ImgFallback = () => {
    return (<VStack h="100%" justifyContent="space-around"><Box alignSelf="center"><PhotoOff color="white"></PhotoOff></Box></VStack>)
}
const ImageFallback = React.memo(ImgFallback)

export type CustomizerCardProps = {
    imageUrl: string,
    width: number,
    height: number,
    children?: ReactNode,
}

const CustomizerCard = ({ imageUrl, height, width, children }: CustomizerCardProps) => {
    /* const smallImageLoadRef = React.useRef<boolean>(false)
     const smallImageErrorRef = React.useRef<boolean>(false)
     const fullImageLoadRef = React.useRef<boolean>(false)
     const fullImageErrorRef = React.useRef<boolean>(false)*/

    const [smallImageLoaded, setSmallImageLoaded] = React.useState<boolean>(false)
    const [smallImageError, setSmallImageError] = React.useState<boolean>(false)
    const [fullImageLoaded, setFullImageLoaded] = React.useState<boolean>(false)
    const [fullImageError, setFullImageError] = React.useState<boolean>(false)

    const fullImageUrl: string = React.useMemo(() => imageUrl, [imageUrl])
    const smallImageUrl: string = React.useMemo(() => fullImageUrl.replace(".png", "_small.png"), [fullImageUrl])

    const smallImageLoadCb = React.useCallback(() => setSmallImageLoaded(true), [])
    const smallImageErrorCb = React.useCallback(() => setSmallImageError(true), [])
    const fullImageLoadCb = React.useCallback(() => setFullImageLoaded(true), [])
    const fullImageErrorCb = React.useCallback(() => setFullImageError(true), [])



    const gradient = "linear-gradient(90deg, rgba(255, 255, 255, .01) 0px, rgba(255, 255, 255, .1) 40px, rgba(255, 255, 255, .01) 80px)"
    const skeletonAnimation = keyframes`
  0% {
    background-image: ${gradient};
    background-size: 600px;
    background-position: -100px;
  }
  100%, 40% {
    background-image: ${gradient};
    background-size: 600px;
    background-position: ${width}px;
  }`
    return (
        <VStack spacing="0" w={width} minH={height} h={height} borderRadius="12px" overflow="hidden" boxShadow="md">
            <Box w={width} h={width} bg="whiteAlpha.50" position="relative">
                <Box opacity={(fullImageLoaded || fullImageError || smallImageLoaded) ? "0" : "1"} top="0" right="0" bottom="0" left="0" position="absolute" animation={`${skeletonAnimation} 1.6s linear infinite`}></Box>
                <Box opacity={(smallImageLoaded && !smallImageError) ? "1" : "0"} top="0" right="0" bottom="0" left="0" position="absolute">
                    <Image transform="scale(1.02)" htmlWidth={width} htmlHeight={width} src={smallImageUrl} onError={smallImageErrorCb} onLoad={smallImageLoadCb}></Image>
                </Box>
                <Fade in={fullImageLoaded}>
                    <Box opacity={(fullImageLoaded || fullImageError) ? "1" : "0"} top="0" right="0" bottom="0" left="0" position="absolute">
                        <Image transform="scale(1.02)" fallback={<ImageFallback></ImageFallback>} htmlWidth={width} htmlHeight={width} src={fullImageUrl} onError={fullImageErrorCb} onLoad={fullImageLoadCb}></Image>
                    </Box>
                </Fade>
            </Box>
            <VStack flex="1" w="100%" justifyContent="space-between" bg="gray.700" padding="8px" paddingTop="12px" spacing="0" zIndex="1">
                {children}
            </VStack>
        </VStack >)
}

export default CustomizerCard
