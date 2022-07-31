import { Box, Checkbox, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";

export const InGameItem: React.FC<{ data: InGameItemWithStatic, onClick?: () => void }> = ({ data, onClick }) => {
    return (
        <HStack height="80px" width="100%" spacing="0" color="white" fontFamily="Rubik" fontSize="16px" _hover={{ color: "#FCD14E" }}>
            <Box
                cursor="pointer"
                height="80px"
                width="80px"
                backgroundImage={`url(${data?.meta?.image})`}
                backgroundRepeat="no-repeat"
                backgroundSize="contain"
                backgroundPosition="center"
                onClick={onClick}
            >
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
            >
                <Checkbox></Checkbox>
            </Box>
        </HStack>
    )
};