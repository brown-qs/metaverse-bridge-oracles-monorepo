import { VStack, HStack, Box, CircularProgress, useMediaQuery, Checkbox } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { ReactNode } from "react";
import { Media } from "..";

export type BridgeTabListItemProps = {
    mediaUrl: string,
    lineOne: string,
    isLoading: boolean,
    mediaRedOutline?: boolean,
    lineTwo?: string,
    highlightable?: boolean,
    onClick?: () => {},
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
        >
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
                <Media uri={mediaUrl} />
            </Box>
            <Box
                cursor="pointer"
                onClick={onClick}
                flex="1"
                paddingLeft="8px"
                paddingRight="8px"
            >
                <Box>{lineOne}</Box>
                {lineTwo && <Box fontSize="12px" color="whiteAlpha.600">{lineTwo}</Box>}
            </Box>
            {children}
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