import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { UserCollectionElement } from "../../hooks/multiverse/useOnChainItems";
import { Fraction } from "../../utils/Fraction";

export const OnChainResources: React.FC<{ data: UserCollectionElement, onClick?: () => void, children: ReactNode }> = ({ data, onClick }) => {
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
            <Box flex="1" paddingLeft="8px">{data?.meta?.name}</Box>
            <Box
                bg="rgba(255, 255, 255, 0.06)"
                borderRadius="4px"
                padding="8px"
                fontFamily="Orbitron"
                fontSize="14px !important"
            >
                {Fraction.from(data?.asset?.balance, 18)?.toFixed(2)}
            </Box>
        </HStack>
    )
};