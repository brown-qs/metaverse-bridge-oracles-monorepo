import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameResourceWithStatic } from "../../hooks/multiverse/useInGameItems";
import { Media } from "../Media/Media";

export const InGameResource: React.FC<{ data: InGameResourceWithStatic }> = ({ data }) => {
    return (
        <HStack height="80px" width="100%" spacing="0" color="white" fontFamily="Rubik" fontSize="16px" >
            <Box
                borderRadius="4px"
                height="80px"
                width="80px"
                overflow="hidden"
                minWidth="80px"

            >
                <Media uri={data?.meta?.image} />

            </Box>
            <Box flex="1" paddingLeft="8px" paddingRight="8px">{data?.meta?.name ?? `${data.assetAddress} ${data.assetId}`}</Box>
            <Box
                bg="rgba(255, 255, 255, 0.06)"
                borderRadius="4px"
                padding="8px"
                fontFamily="Orbitron"
                fontSize="14px !important"
            >
                {parseFloat(data?.amount).toFixed(2)}
            </Box>
        </HStack>
    )
};