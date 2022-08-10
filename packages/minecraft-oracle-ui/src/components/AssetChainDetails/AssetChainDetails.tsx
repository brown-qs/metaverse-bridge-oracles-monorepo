import { InGameItemWithStatic } from '../../hooks/multiverse/useInGameItems';
import { useClasses } from '../../hooks';
import { AddressDisplayComponent } from '../form/AddressDisplayComponent';
import { ChainDataDisplayComponent } from '../form/ChainDataDisplayComponent';

import { styles } from './AssetChainDetails.styles';
import { NETWORK_NAME } from '../../constants';
import { Box, Stack, VStack } from '@chakra-ui/react';

export const AssetChainDetails = ({ data, borderOn }: { data?: InGameItemWithStatic, borderOn?: boolean }) => {

    const {
        row,
        formLabel,
        formValue,
        formValueTokenDetails,
        chainDetailsContainer,
        pL
    } = useClasses(styles);

    const exportChainId = data?.exportChainId
    const hash = data?.hash
    const exportAddress = data?.exportAddress

    return (
        <VStack w="100%" spacing="0" alignItems="stretch">
            <Stack spacing="0" direction="row" alignItems="center">
                <Box flex="1">Chain ID</Box>
                <Box>
                    {exportChainId && <ChainDataDisplayComponent
                        className={`${formValue} ${formValueTokenDetails}`}
                        chainId={exportChainId}
                        copyTooltipLabel={'Copy chain ID'}
                    >
                        {exportChainId}
                    </ChainDataDisplayComponent>}
                </Box>
            </Stack>
            <Stack spacing="0" direction="row" alignItems="center">
                <Box flex="1">Chain name</Box>
                {exportChainId && <ChainDataDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
                    chainId={exportChainId}
                    copyTooltipLabel={'Copy chain name'}
                >
                    {NETWORK_NAME[exportChainId]}
                </ChainDataDisplayComponent>}
            </Stack>
            <Stack spacing="0" direction="row" alignItems="center">
                <Box flex="1">Owner address</Box>
                {exportAddress && <AddressDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
                    copyTooltipLabel={'Copy address'}
                    charsShown={5}
                >
                    {exportAddress}
                </AddressDisplayComponent>}
            </Stack>
            <Stack spacing="0" direction="row" alignItems="center">
                <Box flex="1">Bridge entry hash</Box>
                <Box>
                    {hash && <AddressDisplayComponent
                        className={`${formValue} ${formValueTokenDetails}`}
                        copyTooltipLabel={'Copy entry hash'}
                        charsShown={5}
                        dontShowLink={true}
                    >
                        {hash}
                    </AddressDisplayComponent>}
                </Box>
            </Stack>
        </VStack>
    );
};
