import { VStack, HStack, Box, CircularProgress } from "@chakra-ui/react";
import { ReactNode } from "react";

export const BridgeTab: React.FC<{ title: string, children: ReactNode, isLoading?: boolean, icon?: ReactNode, footer?: ReactNode }> = ({ title, children, isLoading, icon, footer }) => {
    return (
        <VStack maxHeight="100%" height="100%" alignItems={"flex-start"} spacing={0}>
            <HStack
                alignItems={"center"}
                width="250px"
                minHeight="40px"
                height="40px"
                borderRadius="8px 8px 0px 0px"
                background="gray.800"

            >
                <VStack
                    color="yellow.300"
                    fontSize="12px"
                    lineHeight="16px"
                    // background="rgba(22, 19, 43, 0.92)"
                    width="100%"
                    textAlign={"center"}

                    marginLeft="0"
                    fontFamily="Orbitron"
                    textTransform="uppercase"
                >
                    <HStack>
                        {icon && <Box>{icon}</Box>}
                        <Box>{title}</Box>
                    </HStack>

                </VStack>
            </HStack>
            <VStack
                flexGrow="1"
                borderRadius={footer ? "0px 8px 0px 0px" : "0px 8px 8px 8px"}
                overflowY="scroll"
                width="100%"
                background="gray.800"
            >
                {!!isLoading
                    ?
                    <HStack height="100%">
                        <CircularProgress color="teal.500" isIndeterminate ></CircularProgress>
                    </HStack>
                    :
                    <>{children}</>
                }

            </VStack>
            {footer &&
                <Box
                    padding="9px"
                    width="100%"
                    borderRadius="0px 0px 8px 8px"
                    background="gray.800"
                >{footer}</Box>
            }
        </VStack>
    )
};