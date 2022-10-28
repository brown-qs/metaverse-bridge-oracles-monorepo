import { VStack, HStack, Box, CircularProgress, useMediaQuery, Checkbox, Skeleton, CSSObject } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { ReactNode } from "react";
import { Media } from "..";
import { utils } from "ethers"
import React from "react";
import numeral from "numeral"

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
    balanceEther: BigNumber | undefined
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
        return numberFormatter(balanceEther.toNumber())
    }, [balanceEther])

    function numberFormatter(num: number) {
        //needs to always be 6 digits!!
        //cant do 5 because of -10k no room for decimal place

        let tempFormat = numeral(num).format("0.00000a")

        //adds leading 0
        if (tempFormat.startsWith("0.")) {
            tempFormat = tempFormat.slice(1)
        }
        let negative = false
        let letter = false
        if (tempFormat.includes("-")) {
            negative = true
        }

        if (isNaN(parseInt(tempFormat.slice(-1)))) {
            letter = true
        }
        const numIntDigits = String(parseInt(tempFormat.replace("-", ""))).length

        //start with 4 because decimal takes 1 character
        let numDecimalDigits = 5 - numIntDigits
        if (negative) {
            numDecimalDigits--
        }
        if (letter) {
            numDecimalDigits--
        }
        numDecimalDigits = Math.max(0, numDecimalDigits)
        console.log(`num: ${num} tempFormat: ${tempFormat} numIntDigits: ${numIntDigits} numDecimalDigits: ${numDecimalDigits} negative: ${negative} letter: ${letter}`)
        console.log({ minimumFractionDigits: numDecimalDigits, maximumFractionDigits: numDecimalDigits, notation: "compact", compactDisplay: "short" })
        if (numDecimalDigits === 0) {
            return numeral(num).format(`0a`)
        } else {
            return numeral(num).format(`0.${"000000".slice(-1 * numDecimalDigits)}a`).toUpperCase()
        }
    }

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
                {!isLoading && showBalance &&
                    <HStack
                        spacing="0"
                        paddingRight={isCheckable ? "12px" : "12px"}
                        w="80px"
                        minW="80px"
                        h="100%"
                    >
                        <Box
                            bg="rgba(255, 255, 255, 0.06)"
                            borderRadius="4px"
                            padding="8px"
                            fontFamily="JetBrains Mono"
                            fontWeight="500"
                            fontSize="14px !important"
                            w="100%"
                            minH="36px"
                            overflow="hidden"
                            whiteSpace={"nowrap"}
                        >
                            {formattedBalance}
                        </Box>
                    </HStack>

                }
                {!isLoading && isCheckable &&
                    <HStack
                        w="28px"
                        spacing="0"
                        h="100%"
                        cursor="default"
                        paddingRight="12px"
                    >

                        <Checkbox
                            value={checkboxValue}
                            isDisabled={isCheckboxDisabled}
                            isChecked={isChecked}
                            onChange={(e) => onCheckboxChange?.(e)}
                        >

                        </Checkbox>
                    </HStack>
                }
            </HStack >
        </Box>
    )
};