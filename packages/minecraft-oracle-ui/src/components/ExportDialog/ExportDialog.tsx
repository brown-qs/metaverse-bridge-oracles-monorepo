
import {
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
import { useStyles } from './ExportDialog.styles';
import { useIsTransactionPending, useSubmittedExportTx } from 'state/transactions/hooks';
import { ExportAssetCallbackState, useExportAssetCallback } from 'hooks/multiverse/useExportAsset';
import { useExportConfirmCallback } from 'hooks/multiverse/useConfirm';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useActiveGame } from 'hooks/multiverse/useActiveGame';


export const ExportDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isExportDialogOpen, exportDialogData, setExportDialogData, setExportDialogOpen } = useExportDialog();
  const [exportParamsLoaded, setExportParamsLoaded] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const [exportConfirmed, setExportConfirmed] = useState<boolean>(false);
  const confirmCb = useExportConfirmCallback()

  const activeGame = useActiveGame()

  console.log({activeGame})

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

  const handleClose = () => {
    setExportDialogOpen(false);
    setExportParamsLoaded(false);
    setFinalTxSubmitted(false);
    setExportConfirmed(false);
    setApprovalSubmitted(false)
  };

  if (!exportParamsLoaded && !!exportDialogData?.hash) {
    setExportParamsLoaded(true);
  }

  const assetAddress = exportDialogData?.asset?.assetAddress;
  const assetId = exportDialogData?.asset?.assetId;
  const assetType = exportDialogData?.asset?.assetType;


  let callbackError: string | undefined;

  const exportCallbackParams = useExportAssetCallback({hash: exportDialogData?.hash})
  
  
  if (!!exportCallbackParams.error) {
    callbackError = exportCallbackParams.error
  }

  const { exportSubmitted, exportTx } = useSubmittedExportTx(exportDialogData?.hash);
  const isPending = useIsTransactionPending(exportTx?.hash)

  console.log('submission', { exportSubmitted, exportTx, finalTxSubmitted, exportConfirmed, hash: exportDialogData?.hash })
  
  
  useEffect(() => {
    const x = async () => {
      const confirmed = await confirmCb(exportDialogData?.hash)
      console.log('effect hook', confirmed)
      setExportConfirmed(confirmed)
    }
    x()
  }, [exportDialogData?.hash, finalTxSubmitted, exportSubmitted, isPending])

  const renderBody = () => {

    if(activeGame) {
      return (
        <div className={loadingContainer}>
          <div>
            <Typography>Sorry you cannot export with the bridge during an ongoing game</Typography>
          </div>
        </div>
      );
    }

    if (!exportParamsLoaded) {
      return (
        <div className={loadingContainer}>
          <CircularProgress />
          <div>
            <Typography>Loading export details</Typography>
            <Typography color="textSecondary" variant="h5">
              Should be a jiffy
            </Typography>
          </div>
        </div>
      );
    }

    if (exportConfirmed) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Export from metaverse confirmed!`}</Typography>
          <Typography color="textSecondary">
            {`Entry hash: ${exportDialogData?.hash}`}
          </Typography>

          {exportTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                exportTx.hash,
                'transaction'
              )}
            >
              {exportTx.hash}
            </ExternalLink>
          )}
          <Button
            className={button}
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </div>
      );
    }

    if (finalTxSubmitted && isPending) {
      return (
        <>
          <div className={loadingContainer}>
            <CircularProgress />
            <div>
              <Typography>Landing in your address soon...</Typography>
              <Typography color="textSecondary" variant="h5">
                Check your wallet for potential action
              </Typography>
            </div>
          </div>
        </>
      );
    }
    
    if (finalTxSubmitted && exportSubmitted && !isPending) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Transaction success!`}</Typography>

          {exportTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                exportTx.hash,
                'transaction'
              )}
            >
              {exportTx.hash}
            </ExternalLink>
          )}

          <Typography color="textSecondary" variant="h5">
            Confirming export with the metaverse oracle...
          </Typography>
        </div>
      );
    }

    return (
      <>
        <Grid container spacing={1} justifyContent="center">
          <Typography className="form-subheader">Entry hash {exportDialogData?.hash}</Typography>
          <Grid item md={12} xs={12}>
            <Box className={formBox}>
              <Typography className="form-subheader">Token Details</Typography>
              <div className={row}>
                <div className={col}>
                  <div className={formLabel}>Address</div>
                  <AddressDisplayComponent
                    className={`${formValue} ${formValueTokenDetails}`}
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
              </div>
              <Divider variant="fullWidth" className={divider} />
            </Box>
          </Grid>
        </Grid>

        <Button
          onClick={() => {
            exportCallbackParams.callback?.();
            setFinalTxSubmitted(true);
          }}
          className={formButton}
          variant="contained"
          color="primary"
          disabled={
            exportCallbackParams.state !== ExportAssetCallbackState.VALID
          }
        >
          Export from metaverse
        </Button>
        <Button className={formButton} onClick={handleClose} color="primary">
          Cancel
        </Button>
      </>
    );
  };
  return (
    <Dialog
      open={isExportDialogOpen}
      onClose={handleClose}
      title={'MultiverseBridge: export'}
      maxWidth="md"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
