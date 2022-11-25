import { Box, VStack, Image, Fade, HStack, Button, Tag, Link } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React from "react"
import { useNavigate } from "react-router-dom"
import { PhotoOff } from "tabler-icons-react"
import CustomizerCard, { CustomizerCardProps } from "./CustomizerCard"

type TraitCustomizerCardProps = {
    owned: boolean,
    equipped: boolean,
    default: boolean,
    chainId: number,
    assetAddress: string,
    assetId: number,
    synthetic: boolean,
    traitValue: string
} & Omit<CustomizerCardProps, "selected">

const TraitCustomizerCard = ({ imageUrl, width, chainId, assetAddress, assetId, height, owned, equipped, traitValue }: TraitCustomizerCardProps) => {

    const navigate = useNavigate()
    const marketplaceUrl: string = React.useMemo(() => {
        if (assetAddress.toLowerCase() === "0xac5c7493036de60e63eb81c5e9a440b42f47ebf5") {
            return `https://opensea.io/assets/ethereum/0xac5c7493036de60e63eb81c5e9a440b42f47ebf5/${assetId}`
        } else {
            return `https://marketplace.moonsama.com/token/ERC721/0xb654611f84a8dc429ba3cb4fda9fad236c505a1a/${assetId}`
        }
    }, [assetAddress, assetId])
    const handleViewClick = () => {
        window.open(marketplaceUrl, "_blank")
    }

    const handleCustomizeClick = () => {
        if (String(chainId) === "1") {
            navigate(`/customizer/${chainId}/${assetAddress}/${assetId}`)
        } else {
            navigate(`/moonsama/customizer/${chainId}/${assetAddress}/${assetId}`)
        }

    }
    return (<CustomizerCard selected={false} imageUrl={imageUrl} width={width} height={height}>
        <HStack spacing="0" w="100%" fontFamily="Rubik" fontSize="16px" lineHeight="24px" minHeight="24px" overflow="hidden" justifyContent="space-between">
            <HStack spacing="0" w="100%">
                <Box w="100%" whiteSpace="nowrap" textOverflow="ellipsis">{traitValue}</Box>
            </HStack>
            <HStack spacing="0">
                {owned && <Tag variant='solid' bg="teal.400" color="white">Owned</Tag>}

            </HStack>
        </HStack>
        <HStack spacing="0" w="100%">
            {equipped
                ?
                <Button flex="1" onClick={() => { }}>Remove</Button>
                :
                <Button flex="1" onClick={() => { }}>Equip</Button>
            }
        </HStack>
    </CustomizerCard>)
}

export default TraitCustomizerCard
