import { AddressDisplayComponent } from "../../components/form/AddressDisplayComponent"

import { styles as appStyles } from '../../app.styles';
import { useClasses } from 'hooks';
import { StringAssetType } from "../../utils/subgraph";
import { Stack, Text } from "@chakra-ui/react";


export const TokenDetails = ({ assetAddress, assetId, assetType }: { assetAddress?: string, assetId?: string, assetType?: StringAssetType }) => {

    const {
        row,
        col,
        formBox,
        formLabel,
        formValue,
        formValueTokenDetails
    } = useClasses(appStyles);

    return (
        <Stack className={formBox} spacing={2}>
            <Text variant="body2">Token Details</Text>
            <Stack direction={'row'} className={row}>
                <div className={col}>
                    <div className={formLabel}>Address</div>
                    <AddressDisplayComponent
                        className={`${formLabel} ${formValueTokenDetails}`}
                        copyTooltipLabel={'Copy address'}
                        charsShown={5}
                    >
                        {assetAddress ?? '?'}
                    </AddressDisplayComponent>
                </div>
                <div className={col}>
                    <div className={formLabel}>ID</div>
                    <div className={`${formValue} ${formValueTokenDetails}`}>
                        {assetId}
                    </div>
                </div>
                <div className={col}>
                    <div className={formLabel}>Type</div>
                    <div className={`${formValue} ${formValueTokenDetails}`}>
                        {assetType}
                    </div>
                </div>
            </Stack>
        </Stack>
    )
}