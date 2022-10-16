import { Box, Checkbox, HStack, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useSetSkinMutation } from "../../state/api/bridgeApi";
import { SkinResponse } from "../../state/api/types";
import { Media } from "../Media";
import { BridgeTabListItemCheckable, BridgeTabListItemCheckableProps } from "./BridgeTabListItem";

export type SkinProps = {
    skin: SkinResponse,
    index: number,
    onClick: () => void,
    children?: ReactNode
}
export const Skin: React.FC<SkinProps> = ({ skin, index, onClick }) => {
    const [isSmallerThan285] = useMediaQuery('(max-width: 285px)')

    const skinToImageUrl = (skin: SkinResponse): string | undefined => {
        const decoded = Buffer.from(skin.textureData, 'base64').toString()
        const textureURL = !!decoded ? JSON.parse(decoded)?.textures?.SKIN?.url : undefined
        const coverURL = !!textureURL ? `https://api.mineskin.org/render/skin?url=${textureURL}` : undefined
        return coverURL
    }
    return (
        <Box
            paddingTop="100%"
            position="relative"
            key={`${skin?.assetAddress}-${skin?.assetId}-${index}`}

            onClick={() => {
                //dont set a skin thats already set
                if (!skin.equipped) {
                    onClick()
                }
            }}
        >
            <Box
                overflow="visible"
                position="absolute"
                // top={firstRow ? "12px" : "4px"}
                top={true ? "12px" : "4px"}
                right="12px"
                bottom="12px"
                // left={firstColumn ? "12px" : "4px"}
                left={true ? "12px" : "4px"}
                bg={skin.equipped ? "rgba(14, 235, 168, 0.1)" : "inherit"}
                _hover={skin.equipped ? {} : { bg: "rgba(255, 255, 255, 0.06)" }}
                _after={(skin.equipped && !isSmallerThan285) ? { fontFamily: "heading", content: `"EQUIPPED"`, fontSize: "12px", bg: "teal.400", color: "#16132B", padding: "4px 8px", borderRadius: "8px 0px 4px 0px", marginTop: "100px", position: "absolute", bottom: "-1px", right: "-1px" } : {}}
                cursor={skin.equipped ? "default" : "pointer"}
                borderRadius="4px"
                border={skin.equipped ? "1px solid" : "1px solid"}
                borderColor={skin.equipped ? "teal.400" : "transparent"}
            >
                <Media imageProps={{ objectFit: "contain" }} padding="12%" uri={skinToImageUrl(skin)} />
            </Box>
        </Box >
    );
}

