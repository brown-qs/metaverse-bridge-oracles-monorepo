import { Box, Button, Checkbox, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { UserCollectionElement } from "../../hooks/multiverse/useOnChainItems";

export const OnChainItem: React.FC<{ data: UserCollectionElement, onClick?: () => void, children: ReactNode }> = ({ data, onClick }) => {
    return (
        <HStack height="80px" width="100%" spacing="0" color="white" fontFamily="Rubik" fontSize="16px">
            <Box
                height="80px"
                width="80px"
                backgroundImage={`url(${data?.meta?.image})`}
                backgroundRepeat="no-repeat"
                backgroundSize="contain"
                backgroundPosition="center">
            </Box>
            <Box
                flex="1"
                paddingLeft="8px">
                {`${data?.meta?.name}${data?.asset?.assetAddress?.toLowerCase() !== '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a' ? ` #${data?.asset?.assetId}` : ''}`}
            </Box>
            <Box
                cursor="default"
            >
                {data.importable && <Checkbox></Checkbox>}
                {!data.importable && <Checkbox isDisabled={true}></Checkbox>}
            </Box>
        </HStack >
    )
};