import { Box, Checkbox, HStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { Media } from "../Media/Media";

export const InGameItem: React.FC<{ data: InGameItemWithStatic, checkboxValue: string, isCheckboxDisabled: boolean | undefined, isChecked: boolean, onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onClick?: () => void }> = ({ data, checkboxValue, isCheckboxDisabled, isChecked, onCheckboxChange, onClick }) => {
    return (
        <HStack height="80px" width="100%" spacing="0" color="white" fontFamily="Rubik" fontSize="16px" _hover={{ color: "#FCD14E" }}>
            <Box
                borderRadius="4px"
                cursor="pointer"
                height="80px"
                width="80px"
                overflow="hidden"
                onClick={onClick}
            >
                <Media uri={data?.meta?.image} />
            </Box>
            <Box
                cursor="pointer"
                onClick={onClick}
                flex="1"
                paddingLeft="8px">
                {data?.meta?.name ?? `${data.assetAddress} ${data.assetId}`}
            </Box>
            <Box
                cursor="default"
                paddingRight="12px"
            >
                <Checkbox
                    value={checkboxValue}
                    isDisabled={isCheckboxDisabled || data.enraptured === true}
                    isChecked={isChecked}
                    onChange={(e) => onCheckboxChange(e)}
                >

                </Checkbox>
            </Box>
        </HStack>
    )
};