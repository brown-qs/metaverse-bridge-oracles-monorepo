
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { ExternalLink } from '../../components/ExternalLink/ExternalLink';
import { TokenDetails } from '../../components/TokenDetails/TokenDetails';
import { useActiveWeb3React, useImportDialog, useClasses } from '../../hooks';
import {
  ApprovalState,
  useApproveCallback,
} from 'hooks/useApproveCallback/useApproveCallback';
import {
  ChainId
} from '../../constants';
import { useBalances } from 'hooks/useBalances/useBalances';
import {
  stringAssetTypeToAssetType,
} from 'utils/marketplace';
import { getExplorerLink } from 'utils';
import { SuccessIcon } from 'icons';
import { useEffect, useState } from 'react';
import { Button, Dialog } from 'ui';
import { styles as appStyles } from '../../app.styles';
import { styles } from './ImportDialog.styles';
import { useIsTransactionPending, useSubmittedImportTx } from '../../state/transactions/hooks';
import { CreateImportAssetCallbackState, useImportAssetCallback } from '../../hooks/multiverse/useImportAsset';
import { useImportConfirmCallback } from '../../hooks/multiverse/useConfirm';
import Stack from '@mui/material/Stack/Stack';


export const ImportDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isImportDialogOpen, importDialogData, setImportDialogOpen } = useImportDialog();
  const [importParamsLoaded, setImportParamsLoaded] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const [importConfirmed, setImportConfirmed] = useState<boolean>(false);
  const confirmCb = useImportConfirmCallback()

  const {
    button,
    formButton,
  } = useClasses(appStyles);

  const {
    dialogContainer,
    loadingContainer,
    successContainer,
    successIcon,
  } = useClasses(styles);

  const { chainId, account } = useActiveWeb3React();

  const handleClose = (event: any, reason: string) => {
    if (reason === 'backdropClick') {
      return
    }
    setImportDialogOpen(false);
    setImportParamsLoaded(false);
    setFinalTxSubmitted(false);
    setImportConfirmed(false);
    setApprovalSubmitted(false)
  };

  if (!importParamsLoaded && !!importDialogData?.asset) {
    setImportParamsLoaded(true);
  }

  let callbackError: string | undefined;


  const assetAddress = importDialogData?.asset?.assetAddress;
  const assetId = importDialogData?.asset?.assetId;
  const assetType = importDialogData?.asset?.assetType;

  const amount = importDialogData?.amount ?? '1'
  const owner = importDialogData?.owner ?? account
  const beneficiary = importDialogData?.beneficiary ?? account

  const importObject = {
    asset: {
      assetAddress,
      assetId,
      assetType: stringAssetTypeToAssetType(assetType)
    },
    amount,
    owner,
    beneficiary,
    chainId
  }

  const bal = useBalances([
    {
      assetAddress,
      assetId,
      assetType,
      id: '1',
    },
  ])?.[0];

  const importCallbackParams = useImportAssetCallback(importObject)


  if (!!importCallbackParams.error) {
    callbackError = importCallbackParams.error
  }

  const hasEnough = bal?.gte(amount);

  const [approvalState, approveCallback] = useApproveCallback({
    assetAddress: assetAddress,
    assetId: assetId,
    assetType: assetType,
    amountToApprove: amount,
  });

  const { importSubmitted, importTx } = useSubmittedImportTx(importCallbackParams?.hash);
  const isPending = useIsTransactionPending(importTx?.hash)

  // console.log('submission', { importSubmitted, importTx, finalTxSubmitted, importConfirmed, hash: importCallbackParams?.hash })


  useEffect(() => {
    const x = async () => {
      const confirmed = await confirmCb(importCallbackParams?.hash, chainId)
      // console.log('effect hook', confirmed)
      setImportConfirmed(confirmed)
    }
    x()
  }, [importCallbackParams?.hash, finalTxSubmitted, importSubmitted, isPending])

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

    if (importConfirmed) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Import to metaverse confirmed!`}</Typography>

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

    return (
      <Stack spacing={1} justifyContent="center">
        <TokenDetails assetAddress={assetAddress} assetId={assetId} assetType={assetType} />
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
              importCallbackParams.callback?.();
              setFinalTxSubmitted(true);
            }}
            className={formButton}
            variant="contained"
            color="primary"
            disabled={
              importCallbackParams.state !== CreateImportAssetCallbackState.VALID || !hasEnough
            }
          >
            Import to metaverse
          </Button>
        )}
        <Button className={formButton} onClick={() => handleClose({}, "yada")} color="primary">
          Cancel
        </Button>
      </Stack>
    );
  };
  return (
    <Dialog
      open={isImportDialogOpen}
      onClose={handleClose}
      title={'MultiverseBridge: import'}
      maxWidth="md"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
