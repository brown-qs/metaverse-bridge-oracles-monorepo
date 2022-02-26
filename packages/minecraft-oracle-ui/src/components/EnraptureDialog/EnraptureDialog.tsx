import {
  Box,
  Grid,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import 'date-fns';
import { useActiveWeb3React, useEnraptureDialog } from 'hooks';
import {
  ApprovalState,
  useApproveCallback,
} from 'hooks/useApproveCallback/useApproveCallback';
import {
  ChainId
} from '../../constants';
import { useBalances } from 'hooks/useBalances/useBalances';
import { getExplorerLink } from 'utils';
import { SuccessIcon } from 'icons';
import { useEffect, useState } from 'react';
import { Button, Dialog } from 'ui';
import { appStyles } from '../../app.styles';
import { useStyles } from './EnraptureDialog.styles';
import { useIsTransactionPending, useSubmittedImportTx } from 'state/transactions/hooks';
// import { CreateImportAssetCallbackState, useImportAssetCallback } from 'hooks/multiverse/useImportAsset';
import { useEnraptureConfirmCallback } from 'hooks/multiverse/useConfirm';
import { EnraptureAssetCallbackState, useEnraptureAssetCallback } from 'hooks/multiverse/useEnraptureAsset';


export const EnraptureDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isEnraptureDialogOpen, enraptureDialogData, setEnraptureDialogData, setEnraptureDialogOpen } = useEnraptureDialog();
  const [importParamsLoaded, setImportParamsLoaded] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const [enraptureConfirmed, setEnraptureConfirmed] = useState<boolean>(false);
  const confirmCb = useEnraptureConfirmCallback();

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
    if (reason === 'backdropClick') {
      return
    }
    setEnraptureDialogOpen(false);
    setImportParamsLoaded(false);
    setFinalTxSubmitted(false);
    setApprovalSubmitted(false)
    setEnraptureConfirmed(false)
  };

  if (!importParamsLoaded && !!enraptureDialogData?.asset) {
    setImportParamsLoaded(true);
  }

  let callbackError: string | undefined;


  const assetAddress = enraptureDialogData?.asset?.assetAddress;
  const assetId = enraptureDialogData?.asset?.assetId;
  const assetType = enraptureDialogData?.asset?.assetType;

  const amount = enraptureDialogData?.amount ?? '1'

  const importObject = {
    asset: {
      assetAddress,
      assetId,
      assetType,
    },
    amount,
  }

  const bal = useBalances([
    {
      assetAddress,
      assetId,
      assetType,
      id: '1',
    },
  ])?.[0];

  const enraptureCallbackParams = useEnraptureAssetCallback(importObject)
  
  
  if (!!enraptureCallbackParams.error) {
    callbackError = enraptureCallbackParams.error
  }

  const hasEnough = bal?.gte(amount);

  const [approvalState, approveCallback] = useApproveCallback({
    assetAddress: assetAddress,
    assetId: assetId,
    assetType: assetType,
    amountToApprove: amount,
  });

  const { importSubmitted, importTx } = useSubmittedImportTx(enraptureCallbackParams?.hash);
  const isPending = useIsTransactionPending(importTx?.hash)

  console.log('enrapture submission', { importSubmitted, importTx, finalTxSubmitted, enraptureConfirmed, hash: enraptureCallbackParams?.hash })
  
  useEffect(() => {
    const x = async () => {
      const confirmed = await confirmCb(enraptureCallbackParams?.hash)
      console.log('effect hook', confirmed)
      setEnraptureConfirmed(confirmed)
    }
    x()
  }, [enraptureCallbackParams?.hash, finalTxSubmitted, importSubmitted, isPending])

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const showApproveFlow =
    approvalState === ApprovalState.NOT_APPROVED ||
    approvalState === ApprovalState.PENDING;

  console.log('APPROVE FLOW', { showApproveFlow, approvalState, hasEnough });

  const renderBody = () => {

    if (!importParamsLoaded) {
      return (
        <div className={loadingContainer}>
          <CircularProgress />
          <div>
            <Typography>Loading import details</Typography>
            <Typography color="textSecondary" variant="h5">
              Should be a jiffy
            </Typography>
          </div>
        </div>
      );
    }

    if (enraptureConfirmed) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Import to metaverse confirmed!`}</Typography>
          <Typography color="textSecondary">
            {`Entry hash: ${enraptureCallbackParams?.hash}`}
          </Typography>

          {importTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                importTx.hash,
                'transaction'
              )}
            >
              {importTx.hash}
            </ExternalLink>
          )}
          <Button
            className={button}
            onClick={() => handleClose({}, "yada")}
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
              <Typography>Importing asset into the metaverse...</Typography>
              <Typography color="textSecondary" variant="h5">
                Check your wallet for potential action
              </Typography>
            </div>
          </div>
        </>
      );
    }
    
    if (finalTxSubmitted && importSubmitted && !isPending) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Transaction success!`}</Typography>
          <Typography color="textSecondary" variant="h5">
            Confirming import with the metaverse oracle...
          </Typography>

          {importTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                importTx.hash,
                'transaction'
              )}
            >
              {importTx.hash}
            </ExternalLink>
          )}
        </div>
      );
    }
    if (!enraptureConfirmed) {
      return (
        <Grid container spacing={1} justifyContent="center">
        <div className={successContainer}>
          <Typography>{`NFT is going to be burned and bound to the MC account forever`}</Typography>

          <Button
            onClick={() => {
              setEnraptureConfirmed(true)
            }}
            className={button}
            variant="contained"
            color="primary"
          >
            Understood
          </Button>
        </div>
        </Grid>
      );
    }

    return (
      <>
        <Grid container spacing={1} justifyContent="center">
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
                    {enraptureDialogData?.asset?.assetAddress ?? '?'}
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

        {showApproveFlow ? (
          <Button
            onClick={() => {
              approveCallback();
              setApprovalSubmitted(true);
            }}
            className={button}
            variant="contained"
            color="primary"
            disabled={approvalState === ApprovalState.PENDING || !hasEnough}
          >
            Approve
          </Button>
        ) : (
          <Button
            onClick={() => {
              enraptureCallbackParams.callback?.();
              setFinalTxSubmitted(true);
            }}
            className={formButton}
            variant="contained"
            color="primary"
            disabled={
              enraptureCallbackParams.state !== EnraptureAssetCallbackState.VALID || !hasEnough
            }
          >
            Enrapture to metaverse
          </Button>
        )}
        <Button className={formButton} onClick={() => handleClose({}, "yada")} color="primary">
          Cancel
        </Button>
      </>
    );
  };
  return (
    <Dialog
      open={isEnraptureDialogOpen}
      onClose={handleClose}
      title={'MultiverseBridge: Enrapture'}
      maxWidth="md"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
