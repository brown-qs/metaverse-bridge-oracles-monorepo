import { Box, VStack, Image, Fade, HStack, Button, Tag } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ReactNode } from "react"
import { PhotoOff } from "tabler-icons-react"

export type CustomizerCardProps = {
    imageUrl: string,
    width: number,
    height: number,
    children?: ReactNode,
}

const CustomizerCard = ({ imageUrl, height, width, children }: CustomizerCardProps) => {
    const [smallImageLoaded, setSmallImageLoaded] = React.useState<boolean>(false)
    const [smallImageError, setSmallImageError] = React.useState<boolean>(false)
    const [fullImageLoaded, setFullImageLoaded] = React.useState<boolean>(false)
    const [fullImageError, setFullImageError] = React.useState<boolean>(false)


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
                <Fade in={smallImageLoaded}>
                    <Box opacity={(smallImageLoaded && !smallImageError) ? "1" : "0"} top="0" right="0" bottom="0" left="0" position="absolute">
                        <Image htmlWidth={width} htmlHeight={width} src={imageUrl.replace(".png", "_small.png")} onError={() => setSmallImageError(true)} onLoad={() => { setSmallImageLoaded(true) }}></Image>
                    </Box>
                </Fade>
                <Fade in={(fullImageLoaded || fullImageError)}>
                    <Box opacity={(fullImageLoaded || fullImageError) ? "1" : "0"} top="0" right="0" bottom="0" left="0" position="absolute">
                        <Image fallback={<VStack h="100%" justifyContent="space-around"><Box alignSelf="center"><PhotoOff color="white"></PhotoOff></Box></VStack>} htmlWidth={width} htmlHeight={width} src={imageUrl} onError={() => setFullImageError(true)} onLoad={() => setFullImageLoaded(true)}></Image>
                    </Box>
                </Fade>
            </Box>
            <VStack flex="1" w="100%" justifyContent="space-between" bg="gray.700" padding="8px" paddingTop="12px" spacing="0">
                {children}
            </VStack>
        </VStack >)
}

export default CustomizerCard
