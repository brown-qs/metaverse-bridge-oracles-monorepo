import { Box, VStack, Fade, HStack, Button, Tag, Spinner } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ReactNode, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PhotoOff } from "tabler-icons-react"
import { ChainId } from "../../constants"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { CompositeConfigDto, CompositeConfigItemDto } from "../../state/api/types"
import { CustomizerAsset, CustomizerCustomization, selectCustomizerCustomizations } from "../../state/slices/customizerSlice"
import { fetchImageForCache, selectCachedImages } from "../../state/slices/imageCacheSlice"



export type CustomizerCanvasProps = {
    chainId: ChainId,
    assetAddress: string,
    assetId: number,
    customizerConfig: CompositeConfigDto
}

const CustomizerCanvas = ({ chainId, assetAddress, assetId, customizerConfig }: CustomizerCanvasProps) => {
    const dispatch = useDispatch()
    const cachedImages = useSelector(selectCachedImages)
    const { width } = useWindowDimensions();



    const canvasWidth: number = React.useMemo(() => {
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

    const customizations = useSelector(selectCustomizerCustomizations)
    const currentCustomization: CustomizerCustomization | undefined = React.useMemo(() => {
        const customization = customizations.find(c => c.parentChainId === chainId && c.parentAssetAddress.toLowerCase() === assetAddress.toLowerCase() && c.parentAssetId === assetId)
        if (!!customization) {
            return customization
        }
        return undefined
    }, [customizations])

    const customizerAssetCompositeItem = (customizerAsset: CustomizerAsset): CompositeConfigItemDto | undefined => {
        const matchingPart = customizerConfig.parts.find(p => p.chainId === customizerAsset.chainId && p.assetAddress.toLowerCase() === customizerAsset.assetAddress.toLowerCase())
        if (!!matchingPart) {
            const matchingItem = matchingPart.items.find(i => i.assetId === customizerAsset.assetId)
            if (!!matchingItem) {
                return matchingItem
            }
        }
        console.log("couldnt find matching cuztomizer asset for", customizerAsset)
        return undefined
    }

    const canvasLayers: string[] = React.useMemo(() => {
        if (!!currentCustomization) {
            const compositeItems = currentCustomization.assets.map(customizerAssetCompositeItem)
            console.log("composite items: ", compositeItems)
            let images: string[][] = []
            for (const compItem of compositeItems) {
                if (!!compItem) {
                    for (const layer of compItem.layers) {
                        if (!!images[layer.zIndex]) {

                        } else {
                            images[layer.zIndex] = []
                        }
                        images[layer.zIndex].push(layer.imageUri)
                    }
                }
            }
            return images.filter(i => !!i).flat()
        }
        return []
    }, [currentCustomization])

    React.useEffect(() => {
        for (const imageUri of canvasLayers) {
            const imageUrl = `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${imageUri.replace(".png", "_small.png")}`
            dispatch(fetchImageForCache(imageUrl) as any)
        }
    }, [canvasLayers])

    const allSmallsLoaded: boolean = React.useMemo(() => {
        for (const imageUri of canvasLayers) {
            const imageUrl = `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${imageUri.replace(".png", "_small.png")}`
            const img = cachedImages.find(i => i.imageUrl === imageUrl)
            if (!img?.imageLoaded && !img?.imageError) {
                return false
            }
        }

        return true;
    }, [cachedImages, canvasLayers])

    React.useEffect(() => {
        if (allSmallsLoaded) {
            for (const imageUri of canvasLayers) {
                const imageUrl = `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${imageUri}`
                dispatch(fetchImageForCache(imageUrl) as any)
            }
        }
    }, [allSmallsLoaded, canvasLayers])

    const allLargesLoaded: boolean = React.useMemo(() => {
        for (const imageUri of canvasLayers) {
            const imageUrl = `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${imageUri}`
            const img = cachedImages.find(i => i.imageUrl === imageUrl)
            if (!img?.imageLoaded && !img?.imageError) {
                return false
            }
        }

        return true;
    }, [cachedImages, canvasLayers])

    const imageDataUrisWithImageUris: { imageUri: string, dataUri: string }[] = React.useMemo(() => {
        const results: { imageUri: string, dataUri: string }[] = []
        for (const imageUri of canvasLayers) {
            const imageUrl = `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${imageUri}`
            const smallImageUrl = imageUrl.replace(".png", "_small.png")
            const img = cachedImages.find(i => i.imageUrl === imageUrl)
            if (!!img?.imageData) {
                results.push({ imageUri, dataUri: img.imageData })
            } else {
                const smallImg = cachedImages.find(i => i.imageUrl === smallImageUrl)
                if (!!smallImg?.imageData) {
                    results.push({ imageUri, dataUri: smallImg.imageData })

                }
            }
        }
        return results
    }, [cachedImages, canvasLayers])

    return <Box position='relative' marginX="auto" minW={canvasWidth} minH={canvasWidth} w={canvasWidth} h={canvasWidth}>
        {imageDataUrisWithImageUris.map(({ imageUri, dataUri }) =>
            <Box
                position="absolute"
                w="100%"
                h="100%"
                key={imageUri}
                backgroundSize="cover"
                backgroundImage={`url(${dataUri})`}
            >
                {!allLargesLoaded &&
                    <Box
                        borderRadius="20px"
                        backdropFilter="blur(30px)"
                        background="blackAlpha.100"
                        position="absolute"
                        right="16px"
                        bottom="16px"

                    >
                        <HStack spacing="0" padding="8px">
                            <Box>Optimizing</Box>
                            <Box w="8px"></Box>
                            <Spinner size='xs' />
                        </HStack>
                    </Box>
                }
            </Box>
        )}
    </Box >

}

export default CustomizerCanvas
