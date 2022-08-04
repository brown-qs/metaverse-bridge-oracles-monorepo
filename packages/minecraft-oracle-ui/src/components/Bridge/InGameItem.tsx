import { Box, Checkbox, HStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { Media } from "../Media/Media";

export const InGameItem: React.FC<{ data: InGameItemWithStatic, checkboxValue: string, isCheckboxDisabled: boolean | undefined, isChecked: boolean, onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onClick?: () => void }> = ({ data, checkboxValue, isCheckboxDisabled, isChecked, onCheckboxChange, onClick }) => {
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
                height="80px"
                width="80px"
                minWidth="80px"
                overflow="hidden"
                onClick={onClick}
                outline={data.enraptured ? "1px solid red" : "inherit"}
            >
                <Media uri={data?.meta?.image} />
            </Box>
            <Box
                cursor="pointer"
                onClick={onClick}
                flex="1"
                paddingLeft="8px"
                paddingRight="8px"
            >
                <Box>{data?.meta?.name ?? `${data.assetAddress} ${data.assetId}`}</Box>
                {data.enraptured && <Box fontSize="12px" color="whiteAlpha.600">Enraptured</Box>}
            </Box>
            {!data.enraptured &&
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
            }
        </HStack >
    )
};