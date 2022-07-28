import { InGameItemWithStatic } from '../../hooks/multiverse/useInGameItems';
import { useClasses } from '../../hooks';
import { AddressDisplayComponent } from '../form/AddressDisplayComponent';
import { ChainDataDisplayComponent } from '../form/ChainDataDisplayComponent';

import { styles } from './AssetChainDetails.styles';
import { NETWORK_NAME } from '../../constants';
import { Stack } from '@chakra-ui/react';

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
        <Stack className={borderOn ? `${chainDetailsContainer}` : ''}>
            <Stack direction={{ xs: 'column', sm: 'row' }} className={`${row} ${borderOn ? pL : ''}`}>
                <div className={formLabel}>Chain ID: </div>
                {exportChainId && <ChainDataDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
                    chainId={exportChainId}
                    copyTooltipLabel={'Copy chain ID'}
                >
                    {exportChainId}
                </ChainDataDisplayComponent>}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} className={`${row} ${borderOn ? pL : ''}`}>
                <div className={formLabel}>Chain name: </div>
                {exportChainId && <ChainDataDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
                    chainId={exportChainId}
                    copyTooltipLabel={'Copy chain name'}
                >
                    {NETWORK_NAME[exportChainId]}
                </ChainDataDisplayComponent>}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} className={`${row} ${borderOn ? pL : ''}`}>
                <div className={formLabel}>Owner address:</div>
                {exportAddress && <AddressDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
                    copyTooltipLabel={'Copy address'}
                    charsShown={5}
                >
                    {exportAddress}
                </AddressDisplayComponent>}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} className={`${row} ${borderOn ? pL : ''}`}>
                <div className={formLabel}>Bridge entry hash:</div>
                {hash && <AddressDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
                    copyTooltipLabel={'Copy entry hash'}
                    charsShown={5}
                    dontShowLink={true}
                >
                    {hash}
                </AddressDisplayComponent>}
            </Stack>
        </Stack>
    );
};
