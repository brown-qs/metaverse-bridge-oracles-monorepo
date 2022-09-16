import { VStack, HStack, Box, CircularProgress, useMediaQuery, Checkbox, Skeleton } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { ReactNode } from "react";
import { Media } from "..";

export type BridgeTabListItemProps = {
    mediaUrl: string | undefined | null,
    lineOne: string | undefined | null,
    isLoading: boolean,
    mediaRedOutline?: boolean,
    lineTwo?: string,
    highlightable?: boolean,
    onClick?: () => void,
    children?: ReactNode,
}

const BridgeTabListItem: React.FC<BridgeTabListItemProps> = ({ mediaUrl, lineOne, isLoading, mediaRedOutline, lineTwo, highlightable, onClick, children }) => {
    return (
        <HStack
            height="80px"
            width="100%"
            spacing="0"
            color="white"
            fontFamily="Rubik"
            fontSize="16px"
            position="relative"
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
    )
};

export type BridgeTabListItemCheckableProps = BridgeTabListItemProps & { onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void, isChecked: boolean, checkboxValue: string, isCheckboxDisabled: boolean }
export const BridgeTabListItemCheckable: React.FC<BridgeTabListItemCheckableProps> = ({ checkboxValue, isCheckboxDisabled, onCheckboxChange, isChecked, ...baseProps }) => {
    return (<BridgeTabListItem {...baseProps}>
        <Box
            cursor="default"
            paddingRight="12px"
        >
            <Checkbox
                value={checkboxValue}
                isDisabled={isCheckboxDisabled}
                isChecked={isChecked}
                onChange={(e) => onCheckboxChange(e)}
            >

            </Checkbox>
        </Box>
    </BridgeTabListItem>)
}

export type BridgeTabListItemWithBalanceProps = BridgeTabListItemProps & { balanceWei: BigNumber }
export const BridgeTabListItemWithBalance: React.FC<BridgeTabListItemWithBalanceProps> = ({ balanceWei, ...baseProps }) => {
    return (<BridgeTabListItem {...baseProps}>
        <Box
            bg="rgba(255, 255, 255, 0.06)"
            borderRadius="4px"
            padding="8px"
            fontFamily="Orbitron"
            fontSize="14px !important"
        >
            {balanceWei.toString()}
        </Box>
    </BridgeTabListItem>)
}