import { VStack, HStack, Box, CircularProgress, useMediaQuery, Checkbox, Skeleton, CSSObject } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { ReactNode } from "react";
import { Media } from "..";
import { utils } from "ethers"


export type BasePortalTabListItemProps = {
    mediaUrl: string | undefined,
    lineOne: string | undefined,
    isLoading: boolean,
    mediaRedOutline: boolean | undefined,
    lineTwo: string | undefined,
    highlightable: boolean | undefined,

    children?: ReactNode,
}


export type PortalTabListClickableProps = {
    onClick: () => void | undefined,
}

export type PortalTabListCheckableProps = {
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined,
    isChecked: boolean | undefined,
    checkboxValue: string | undefined,
    isCheckboxDisabled: boolean | undefined
}

export type PortalTabListBalanceProps = {
    balanceEther: BigNumber | undefined
}

export type PortalTabListItemProps = BasePortalTabListItemProps & PortalTabListClickableProps & PortalTabListCheckableProps & PortalTabListBalanceProps

//balanceEther: BigNumber

export const PortalTabListItem: React.FC<PortalTabListItemProps> = ({ mediaUrl, lineOne, isLoading, mediaRedOutline, lineTwo, highlightable, onClick, children }) => {
    const _hover: CSSObject = highlightable ? { bg: "whiteAlpha.200", borderRadius: "4px" } : {}
    return (
        <Box
            height="96px"
            w="100%"
            padding="4px 12px 4px 12px"
        >
            <HStack
                height="88px"
                width="100%"
                spacing="0"
                color="white"
                fontFamily="Rubik"
                fontSize="16px"
                position="relative"
                _hover={_hover}
                paddingLeft="4px"
            >
                <Box
                    display={isLoading ? "block" : "none"}
                    background="gray.800"
                    position="absolute"
                    top="0"
                    left="0"
                    bottom="0"
                    right="0"
                >
                    <HStack spacing="0" w="100%" h="100%">
                        <Box>
                            <Skeleton height='80px' w="80px" borderRadius="10px" />
                        </Box>
                        <Box w="20px"></Box>
                        <Box flex="1" h="100%" paddingTop="20px">
                            <Skeleton height='30px' borderRadius="20px" w="70%" />
                        </Box>
                    </HStack>

                </Box>
                <Box
                    borderRadius="4px"
                    cursor="pointer"
                    height={mediaRedOutline ? "78px" : "80px"}
                    width={mediaRedOutline ? "78px" : "80px"}
                    minWidth={mediaRedOutline ? "78px" : "80px"}
                    overflow="hidden"
                    onClick={onClick}
                    border={mediaRedOutline ? "1px solid red" : "inherit"}
                >
                    <Media uri={mediaUrl ?? undefined} />
                </Box>
                <Box
                    cursor="pointer"
                    onClick={onClick}
                    flex="1"
                    paddingLeft="8px"
                    paddingRight="8px"
                >
                    <Box>{!!lineOne ? lineOne : "Untitled"}</Box>
                    {lineTwo && <Box fontSize="12px" color="whiteAlpha.600">{lineTwo}</Box>}
                </Box>
                {!isLoading && children}
            </HStack >
        </Box>
    )
};