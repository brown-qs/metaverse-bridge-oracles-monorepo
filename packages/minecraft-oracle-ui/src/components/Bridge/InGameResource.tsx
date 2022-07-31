import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";

export const InGameResource: React.FC<{ data: InGameItemWithStatic }> = ({ data }) => {
    return (
        <HStack height="80px" width="100%" spacing="0" color="white" fontFamily="Rubik" fontSize="16px" >
            <Box
                height="80px"
                width="80px"
                backgroundImage={`url(${data?.meta?.image})`}
                backgroundRepeat="no-repeat"
                backgroundSize="contain"
                backgroundPosition="center">
            </Box>
            <Box flex="1" paddingLeft="8px">{data?.meta?.name ?? `${data.assetAddress} ${data.assetId}`}</Box>
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