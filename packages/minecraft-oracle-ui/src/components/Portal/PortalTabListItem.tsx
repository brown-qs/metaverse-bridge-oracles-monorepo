import { VStack, HStack, Box, CircularProgress, useMediaQuery, Checkbox, Skeleton, CSSObject } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { ReactNode } from "react";
import { Media } from "..";
import { utils } from "ethers"
import React from "react";
import numeral from "numeral"
import { numberFormatter } from "../../constants";

export type BasePortalTabListItemProps = {
    mediaUrl: string | undefined,
    lineOne: string | undefined,
    lineOneSuffix: string | undefined,
    isLoading: boolean,
    mediaRedOutline: boolean | undefined,
    lineTwo: string | undefined,
    highlightable: boolean | undefined,

    children?: ReactNode,
}


export type PortalTabListClickableProps = {
    onClick: (() => void) | undefined,
}

export type PortalTabListCheckableProps = {
    onCheckboxChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined,
    isChecked: boolean | undefined,
    checkboxValue: string | undefined,
    isCheckboxDisabled: boolean | undefined
}

export type PortalTabListBalanceProps = {
    balanceEther: string | undefined
}

export type PortalTabListItemProps = BasePortalTabListItemProps & PortalTabListClickableProps & PortalTabListCheckableProps & PortalTabListBalanceProps

//balanceEther: BigNumber

export const PortalTabListItem: React.FC<PortalTabListItemProps> = ({ mediaUrl, lineOne, lineOneSuffix, isLoading, mediaRedOutline, lineTwo, highlightable, onClick, onCheckboxChange, isChecked, checkboxValue, isCheckboxDisabled, balanceEther, children }) => {
    const stableLineOne: string = React.useMemo(() => !!lineOne ? lineOne : "Untitled", [lineOne])

    const isCheckable: boolean = React.useMemo(() => !!onCheckboxChange, [onCheckboxChange])
    const showBalance: boolean = React.useMemo(() => balanceEther !== undefined, [balanceEther])
    const formattedBalance: string | undefined = React.useMemo(() => {
        if (balanceEther === undefined) {
            return undefined
        }
        return numberFormatter(balanceEther)
    }, [balanceEther])



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
                    minW="0px" //this makes long text not make element crazy wide
                >
                    <HStack
                        w="100%"
                        spacing="0"
                    >
                        <Box
                            overflow="hidden"
                            whiteSpace={"nowrap"}
                            textOverflow="clip"
                        >
                            {stableLineOne}
                        </Box>
                        {!!lineOneSuffix &&
                            <Box
                                flex="1"
                                whiteSpace="nowrap"
                            >
                                &nbsp;{lineOneSuffix}
                            </Box>
                        }
                    </HStack>

                    {lineTwo && <Box
                        overflow="hidden"
                        whiteSpace="nowrap"
                        fontSize="12px"
                        color="whiteAlpha.600"
                        textOverflow="ellipsis" //always elipsis if second line
                    >{lineTwo}</Box>}
                </Box>

                {!isLoading && (isCheckable || showBalance) &&
                    <VStack
                        w={showBalance ? "80px" : "28px"}
                        minW={showBalance ? "80px" : "28px"}
                        spacing="0"
                        h="100%"
                        cursor="default"
                        padding="8px 12px 8px 0"
                        justifyContent="space-between"
                        alignContent="space-between"
                    >
                        {!(showBalance && isCheckable) && <Box flex="1"></Box>}
                        {showBalance &&
                            <Box
                                bg="rgba(255, 255, 255, 0.06)"
                                borderRadius="4px"
                                fontFamily="JetBrains Mono"
                                fontWeight="500"
                                fontSize="14px !important"
                                w="100%"
                                minH="36px"
                                padding="8px"
                                overflow="hidden"
                                whiteSpace={"nowrap"}
                            >
                                {formattedBalance}
                            </Box>

                        }
                        {isCheckable &&
                            <Box alignSelf="flex-end" h="16px">
                                <Checkbox
                                    value={checkboxValue}
                                    isDisabled={isCheckboxDisabled}
                                    isChecked={isChecked}
                                    onChange={(e) => onCheckboxChange?.(e)}
                                >
                                </Checkbox>
                            </Box>
                        }
                        {!(showBalance && isCheckable) && <Box flex="1"></Box>}
                    </VStack>
                }
            </HStack >
        </Box>
    )
};