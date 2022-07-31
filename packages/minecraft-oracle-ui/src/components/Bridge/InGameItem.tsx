import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";

export const InGameItem: React.FC<{ data: InGameItemWithStatic, onClick?: () => void }> = ({ data, onClick }) => {
    return (
        <HStack height="80px" width="100%" onClick={onClick} cursor="pointer" spacing="0" color="white" fontFamily="Rubik" fontSize="16px" _hover={{ color: "#FCD14E" }}>
            <Box
                height="80px"
                width="80px"
                backgroundImage={`url(${data?.meta?.image})`}
                backgroundRepeat="no-repeat"
                backgroundSize="contain"
                backgroundPosition="center">
            </Box>
            <Box paddingLeft="8px">{data?.meta?.name ?? `${data.assetAddress} ${data.assetId}`}</Box>
            <Box></Box>
        </HStack>
    )
};