import { Box, Button, Checkbox, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { UserCollectionElement } from "../../hooks/multiverse/useOnChainItems";
import { Media } from "../Media/Media";

export const OnChainItem: React.FC<{ data: UserCollectionElement, checkboxValue: string, isCheckboxDisabled: boolean | undefined, isChecked: boolean, onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onClick?: () => void, children: ReactNode }> = ({ data, checkboxValue, isCheckboxDisabled, isChecked, onCheckboxChange, onClick }) => {
    return (
        <HStack height="80px" width="100%" spacing="0" color="white" fontFamily="Rubik" fontSize="16px">
            <Box
                borderRadius="4px"
                height="80px"
                width="80px"
                overflow="hidden"
                minWidth="80px"
                outline={data.enrapturable ? "1px solid red" : "inherit"}
            >
                <Media uri={data?.meta?.image} />
            </Box>
            <Box
                flex="1"
                paddingLeft="8px">
                <Box>{`${data?.meta?.name}${data?.asset?.assetAddress?.toLowerCase() !== '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a' ? ` #${data?.asset?.assetId}` : ''}`}</Box>
                {data.enrapturable && <Box fontSize="12px" paddingRight="8px" color="whiteAlpha.600">This item will be burned into your account.</Box>}
            </Box>
            <Box
                cursor="default"
                paddingRight="12px"
            >
                {(data.importable || data.enrapturable) && <Checkbox value={checkboxValue} isDisabled={isCheckboxDisabled} isChecked={isChecked} onChange={(e) => onCheckboxChange(e)}></Checkbox>}
            </Box>
        </HStack >
    )
};