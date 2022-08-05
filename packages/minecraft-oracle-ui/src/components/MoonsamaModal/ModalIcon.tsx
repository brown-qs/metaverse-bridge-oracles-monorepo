import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Icon } from "tabler-icons-react";

export const ModalIcon: React.FC<{ TablerIcon: Icon, backgroundColor: string, iconColor: string }> = ({ TablerIcon, backgroundColor, iconColor }) => {
    return (
        <Box
            padding="7px"
            width="56px"
            height="56px"
            borderRadius="800px"
            border="1px solid"
            borderColor={backgroundColor}
        >
            <HStack
                width="40px"
                height="40px"
                bg={backgroundColor}
                borderRadius="800px"
            >
                <Box margin="auto"><TablerIcon color={iconColor} size="20"></TablerIcon></Box>
            </HStack>
        </Box>
    )
};
