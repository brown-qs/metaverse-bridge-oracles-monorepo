import { Box, VStack, Image, Fade, HStack, Button, Tag } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React from "react"
import { PhotoOff } from "tabler-icons-react"
import CustomizerCard, { CustomizerCardProps } from "./CustomizerCard"

type LibraryCustomizerCardProps = {
    owned: boolean,
    edited: boolean,
    chainId: number,
    assetAddress: string,
    assetId: number
} & CustomizerCardProps

const LibraryCustomizerCard = ({ imageUrl, width, chainId, assetAddress, assetId }: LibraryCustomizerCardProps) => {
    return (<CustomizerCard imageUrl={imageUrl} width={width}>
        <HStack spacing="0" w="100%" fontFamily="Rubik" fontSize="16px" lineHeight="24px" minHeight="24px" overflow="hidden" justifyContent="space-between">
            <HStack spacing="0">
                <Box w="24px" h="24px">
                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884c.045-.07.153-.063.187.014.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163Zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.86.024-.052.043-.107.065-.16.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.02-.235-.034-.352-.01-.104-.028-.207-.048-.312a6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972 5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197c-.033-.072-.067-.144-.103-.213-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357H11.263l.173.05.192.054.07.019v-.783c0-.379.302-.686.679-.686.187 0 .357.077.477.202a.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017.034.024.084.062.147.11.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691.065.074.127.146.192.226.062.079.132.156.19.232.079.104.16.212.235.324.033.053.074.108.105.161.096.142.178.288.257.435.034.067.067.141.096.213.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254-.075.17-.161.343-.264.502-.034.06-.075.122-.113.182-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221 2.342 2.342 0 0 1-.166.209c-.081.098-.16.19-.245.278-.048.058-.1.118-.156.17-.052.06-.108.113-.156.161-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057c.07-.019.138.031.138.103v.773Z" fill="#fff" /></svg>
                </Box>
                <Box w="12px"></Box>
                <Box>#{assetId}</Box>
            </HStack>
            <HStack spacing="0">
                <Tag variant='solid' bg="teal.400" color="white">Owned</Tag>
                <Box w="8px"></Box>
                <Tag variant='solid' bg='purple.300' color="white">Edited</Tag>
            </HStack>
        </HStack>
        <HStack spacing="0" w="100%">
            <Button flex="1" variant="moonsamaGhost">View</Button>
            <Box w="8px"></Box>
            <Button flex="1" variant="moonsamaGhost">Customize</Button>
        </HStack>
    </CustomizerCard>)
}

export default LibraryCustomizerCard
