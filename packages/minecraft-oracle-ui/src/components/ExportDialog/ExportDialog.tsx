
import {
  Stack,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import 'date-fns';
import { useActiveWeb3React } from 'hooks';
import {
  ChainId,
} from '../../constants';
import { getExplorerLink } from 'utils';
import { SuccessIcon } from 'icons';
import { useEffect, useState } from 'react';
import { Button, Dialog } from 'ui';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { styles } from './ExportDialog.styles';
import { useIsTransactionPending, useSubmittedExportTx } from 'state/transactions/hooks';
import { ExportAssetCallbackState, useExportAssetCallback } from 'hooks/multiverse/useExportAsset';
import { useExportConfirmCallback } from 'hooks/multiverse/useConfirm';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useActiveGame } from 'hooks/multiverse/useActiveGame';
import { DEFAULT_CHAIN, NETWORK_NAME } from "../../constants";
import { AssetChainDetails } from '../../components/AssetChainDetails/AssetChainDetails';
import useAddNetworkToMetamaskCb from 'hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';
import { useWeb3React } from '@web3-react/core';


export const ExportDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isExportDialogOpen, exportDialogData, setExportDialogData, setExportDialogOpen } = useExportDialog();
  const [exportParamsLoaded, setExportParamsLoaded] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const [exportConfirmed, setExportConfirmed] = useState<boolean>(false);
  const confirmCb = useExportConfirmCallback()

  const activeGame = useActiveGame()

  const {
    divider,
    button,
    row,
    col,
    formBox,
    formValue,
    formLabel,
    formValueTokenDetails,
    formButton,
  } = useClasses(appStyles);

  const {
    dialogContainer,
    loadingContainer,
    successContainer,
    successIcon,
  } = useClasses(styles);

  const { chainId } = useActiveWeb3React();
  const { error: networkError, chainId: networkChainId } = useWeb3React();
  const { addNetwork } = useAddNetworkToMetamaskCb()

  const handleClose = (event: any, reason: string) => {
    if (reason === 'backdropClick') {
      return
    }
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
  const item = exportDialogData?.item;

  let callbackError: string | undefined;

  const exportCallbackParams = useExportAssetCallback({ hash: exportDialogData?.hash, chainId })


  if (!!exportCallbackParams.error) {
    callbackError = exportCallbackParams.error
  }

  const { exportSubmitted, exportTx } = useSubmittedExportTx(exportDialogData?.hash);
  const isPending = useIsTransactionPending(exportTx?.hash)

  console.log('submission', { exportSubmitted, exportTx, finalTxSubmitted, exportConfirmed, hash: exportDialogData?.hash })


  useEffect(() => {
    const x = async () => {
      const confirmed = await confirmCb(exportDialogData?.hash, chainId)
      console.log('effect hook', confirmed)
      setExportConfirmed(confirmed)
    }
    x()
  }, [exportDialogData?.hash, finalTxSubmitted, exportSubmitted, isPending])

  const renderBody = () => {

    if (activeGame) {
      return (
        <div className={loadingContainer}>
          <div>
            <Typography>Sorry you cannot export from the bridge during an ongoing Carnage game.</Typography>
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

    console.log('CHAINS', { chainId, networkError, networkChainId, exportDialogDataChain: exportDialogData?.chain })
    if (!chainId || !!networkError || exportDialogData?.chain !== chainId) {
      const chainToConnect: ChainId = exportDialogData?.chain ?? DEFAULT_CHAIN as ChainId
      const networkName = NETWORK_NAME[exportDialogData?.chain ?? DEFAULT_CHAIN]
      return (
        <div className={loadingContainer}>
          <Stack direction={'column'} spacing={1}>
            <Typography>Connect to {networkName} network first to export this item.</Typography>
            <Button
              //className={formButton}
              onClick={() => {
                addNetwork(chainToConnect)
              }}
              color="primary"
            >
              Switch to {networkName}
            </Button>
          </Stack>
        </div>
      );
    }

    if (exportConfirmed) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Export from metaverse confirmed!`}</Typography>

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
              <Typography>Landing in owner address soon...</Typography>
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
      <Stack spacing={1} justifyContent="center">
        <Stack className={formBox} spacing={2}>
          <Typography variant="body2">Token Details</Typography>
          <Stack direction={'row'} className={row}>
            <div className={col}>
              <div className={formLabel}>Address</div>
              <AddressDisplayComponent
                className={`${formValue} ${formValueTokenDetails}`}
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
          <Divider variant="fullWidth" className={divider} />
          <AssetChainDetails data={item} borderOn={false} />
        </Stack>
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
        <Button className={formButton} onClick={() => handleClose({}, "yada")} color="primary">
          Cancel
        </Button>
      </Stack>
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
