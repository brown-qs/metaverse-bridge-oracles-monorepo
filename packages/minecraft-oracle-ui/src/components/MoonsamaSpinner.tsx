import { Box, CircularProgress, VStack } from "@chakra-ui/react";
export type MoonsamaSpinnerProps = {

}
export function MoonsamaSpinner() {
    return (
        <VStack spacing="0" h="100%" w="100%">
            <Box flex="1"></Box>
            <Box>
                <CircularProgress isIndeterminate color="teal.200"></CircularProgress>
            </Box>
            <Box flex="1"></Box>
        </VStack >)
}