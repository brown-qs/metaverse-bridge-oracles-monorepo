
import {
  Avatar,
  Box,
  Grid,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import 'date-fns';
import { useActiveWeb3React } from 'hooks';
import {
  ChainId,
} from '../../constants';
import { getExplorerLink } from 'utils';
import { SuccessIcon } from 'icons';
import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog } from 'ui';
import { appStyles } from '../../app.styles';
import { useStyles } from './AssetDialog.styles';
import { useIsTransactionPending, useSubmittedExportTx } from 'state/transactions/hooks';
import { ExportAssetCallbackState, useExportAssetCallback } from 'hooks/multiverse/useExportAsset';
import { useAssetDialog } from 'hooks/useAssetDialog/useAssetDialog';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask/useAddTokenToMetamask';
import { useTokenStaticData } from 'hooks/useTokenStaticData/useTokenStaticData';
import { StringAssetType } from 'utils/subgraph';
import { AddressZero } from '@ethersproject/constants';
import MetamaskLogo from '../../assets/images/metamask.png'


export const AssetDialog = () => {
  const [assetParamsLoaded, setAssetParamsLoaded] = useState<boolean>(false);
  const { isAssetDialogOpen, assetDialogData, setAssetDialogData, setAssetDialogOpen } = useAssetDialog();

  const {
    divider,
    infoContainer,
    button,
    //
    row,
    col,
    verticalDashedLine,
    formBox,
    formLabel,
    formValue,
    formValueTokenDetails,
    formValueGive,
    formValueGet,
    spaceOnLeft,
    fieldError,
    formButton,
    expand,
    expandOpen,
  } = appStyles();

  const [UIAdvancedSectionExpanded, setExpanded] = useState(false);

  const {
    dialogContainer,
    loadingContainer,
    successContainer,
    successIcon,
    inputContainer,
  } = useStyles();

  const { chainId, account } = useActiveWeb3React();

  const handleClose = (event: any, reason: string) => {
    setAssetDialogOpen(false)
    setAssetParamsLoaded(false);
  };

  if (!assetParamsLoaded && !! assetDialogData?.title) {
    setAssetParamsLoaded(true);
  }

  const erc20Data = useTokenStaticData([{assetAddress: assetDialogData?.assetAddressERC20 ?? AddressZero, assetId: '0', assetType: StringAssetType.ERC20, id: '1'}])

  console.log('yolo',{assetDialogData, erc20Data})
  const {addToken} = useAddTokenToMetamask({
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
            <Typography>Loading asset details</Typography>
            <Typography color="textSecondary" variant="h5">
              Should be a jiffy
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <>
        <Grid container spacing={1} justifyContent="center">
          <Typography className="form-subheader">Hybrid token details</Typography>
          { assetDialogData?.assetERC1155 && <Grid item md={12} xs={12}>
            <Box className={formBox}>
              <div className={row}>
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
                    charsShown={5}
                  >
                    {assetDialogData?.assetERC1155?.assetAddress ?? '?'}
                  </AddressDisplayComponent>
                </div>
              </div>
            </Box>
          </Grid>}

          { assetDialogData?.assetAddressERC20 && <Grid item md={12} xs={12}>
            <Box className={formBox}>
              <div className={row}>
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
                    charsShown={5}
                  >
                    {assetDialogData?.assetAddressERC20 ?? '?'}
                  </AddressDisplayComponent>
                </div>
              </div> 
              </Box>
          </Grid>}
        </Grid>
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
      </>
    );
  };
  return (
    <Dialog
      open={isAssetDialogOpen}
      onClose={handleClose}
      title={title}
      maxWidth="md"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
