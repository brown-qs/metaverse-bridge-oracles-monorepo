
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import 'date-fns';
import { useState } from 'react';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { styles as assetDialogStyles } from './AssetDialog.styles';
import { useAssetDialog } from 'hooks/useAssetDialog/useAssetDialog';
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask/useAddTokenToMetamask';
import { useTokenStaticData } from 'hooks/useTokenStaticData/useTokenStaticData';
import { StringAssetType } from 'utils/subgraph';
import { AddressZero } from '@ethersproject/constants';
import { Button, CircularProgress, Grid, Stack, Text } from '@chakra-ui/react';


export const AssetDialog = () => {
  const [assetParamsLoaded, setAssetParamsLoaded] = useState<boolean>(false);
  const { isAssetDialogOpen, onAssetDialogOpen, onAssetDialogClose, assetDialogData, setAssetDialogData } = useAssetDialog();

  const {
    row,
    col,
    formBox,
    formLabel,
    formValue,
    formValueTokenDetails,
    formButton,
  } = useClasses(appStyles);

  const {
    dialogContainer,
    loadingContainer,
  } = useClasses(assetDialogStyles);

  const handleClose = (event: any, reason: string) => {
    onAssetDialogClose()
    setAssetParamsLoaded(false);
  };

  if (!assetParamsLoaded && !!assetDialogData?.title) {
    setAssetParamsLoaded(true);
  }

  const erc20Data = useTokenStaticData([{ assetAddress: assetDialogData?.assetAddressERC20 ?? AddressZero, assetId: '0', assetType: StringAssetType.ERC20, id: '1' }])

  console.log('yolo', { assetDialogData, erc20Data })
  const { addToken } = useAddTokenToMetamask({
    address: assetDialogData?.assetAddressERC20,
    decimals: erc20Data?.[0]?.decimals,
    symbol: erc20Data?.[0]?.symbol,
    image: assetDialogData?.image
  })

  const title = `${erc20Data?.[0]?.name ?? 'Asset'}`

  const renderBody = () => {

    if (!assetParamsLoaded) {
      return (
        <div className={loadingContainer}>
          <CircularProgress />
          <div>
            <Text>Loading asset details</Text>
            <Text color="textSecondary" variant="h5">
              Should be a jiffy
            </Text>
          </div>
        </div>
      );
    }

    return (
      <Stack spacing={1} justifyContent="center">
        <Text style={{ alignSelf: 'center' }} variant='body1'>Hybrid token details</Text>
        {assetDialogData?.assetERC1155 && <Grid /*item md={12} xs={12}*/>
          <Stack direction={'row'} className={formBox} spacing={5}>
            <div className={col}>
              <div className={formLabel}>Type</div>
              <div className={`${formValue} ${formValueTokenDetails}`}>
                {assetDialogData?.assetERC1155?.assetType}
              </div>
            </div>
            <div className={col}>
              <div className={formLabel}>ID</div>
              <div className={`${formValue} ${formValueTokenDetails}`}>
                {assetDialogData?.assetERC1155?.assetId}
              </div>
            </div>
            <div className={col}>
              <div className={formLabel}>Address</div>
              <AddressDisplayComponent
                className={`${formValue} ${formValueTokenDetails}`}
                copyTooltipLabel={'Copy address'}
                charsShown={5}
              >
                {assetDialogData?.assetERC1155?.assetAddress ?? '?'}
              </AddressDisplayComponent>
            </div>
          </Stack>
        </Grid>}

        {assetDialogData?.assetAddressERC20 && (
          <Stack direction={'row'} className={`${formBox} ${row}`} spacing={5}>
            <div className={col}>
              <div className={formLabel}>Type</div>
              <div className={`${formValue} ${formValueTokenDetails}`}>
                {'ERC20'}
              </div>
            </div>
            <div className={col}>
              <div className={formLabel}>Address</div>
              <AddressDisplayComponent
                className={`${formValue} ${formValueTokenDetails}`}
                copyTooltipLabel={'Copy address'}
                charsShown={5}
              >
                {assetDialogData?.assetAddressERC20 ?? '?'}
              </AddressDisplayComponent>
            </div>
          </Stack>
        )}
        <Button
          onClick={() => {
            addToken()
          }}
          className={formButton}
          variant="contained"
          color="primary"
          disabled={!assetDialogData?.assetAddressERC20}
        //startIcon={<Avatar src={MetamaskLogo}>Add to Metamask</Avatar>}
        >
          Add to Metamask
        </Button>
        <Button className={formButton} onClick={() => handleClose({}, "yada")} color="primary">
          Cancel
        </Button>
      </Stack>
    );
  };
  /*
      <Dialog
      open={isAssetDialogOpen}
      onClose={handleClose}
      title={title}
      maxWidth="md"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  */
  return (
    <></>
  );
};
