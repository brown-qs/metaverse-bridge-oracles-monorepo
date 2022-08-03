
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { parseEther } from '@ethersproject/units';
import 'date-fns';
import { useActiveWeb3React, useEnraptureDialog } from 'hooks';
import {
  ApprovalState,
  useApproveCallback,
} from 'hooks/useApproveCallback/useApproveCallback';
import {
  BURNABLE_RESOURCES_IDS,
  ChainId
} from '../../constants';
import { useBalances } from 'hooks/useBalances/useBalances';
import { getExplorerLink } from 'utils';
import { useEffect, useState } from 'react';
import { styles } from './EnraptureDialog.styles';
import { styles as appStyles } from '../../app.styles';
import { useClasses } from 'hooks';
import { useIsTransactionPending, useSubmittedEnraptureTx } from 'state/transactions/hooks';
import { useEnraptureConfirmCallback } from 'hooks/multiverse/useConfirm';
import { EnraptureAssetCallbackState, useEnraptureAssetCallback } from 'hooks/multiverse/useEnraptureAsset';
import { stringAssetTypeToAssetType } from 'utils/marketplace';
import { TokenDetails } from 'components/TokenDetails/TokenDetails';
import { Button, CircularProgress, Grid, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text } from '@chakra-ui/react';
import { CircleCheck } from 'tabler-icons-react';


export const EnraptureDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isEnraptureDialogOpen, onEnraptureDialogOpen, onEnraptureDialogClose, enraptureDialogData, setEnraptureDialogData } = useEnraptureDialog();
  const [enraptureParamsLoaded, setEnraptureParamsLoaded] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const [enraptureConfirmed, setEnraptureConfirmed] = useState<boolean>(false);
  const [userUnderstood, setUserUnderstood] = useState<boolean>(false);
  const confirmCb = useEnraptureConfirmCallback();

  const {
    button,
    formButton,
  } = useClasses(appStyles);

  const {
    dialogContainer,
    loadingContainer,
    successContainer,
    successIcon
  } = useClasses(styles);

  const { chainId, account } = useActiveWeb3React();

  const handleClose = (event: any, reason: string) => {
    if (reason === 'backdropClick') {
      return
    }
    onEnraptureDialogClose();
    setEnraptureParamsLoaded(false);
    setFinalTxSubmitted(false);
    setEnraptureConfirmed(false)
    setApprovalSubmitted(false)
    setUserUnderstood(false)
  };

  if (!enraptureParamsLoaded && !!enraptureDialogData?.asset) {
    setEnraptureParamsLoaded(true);
  }

  let callbackError: string | undefined;




  const assetAddress = enraptureDialogData?.asset?.assetAddress;
  const assetId = enraptureDialogData?.asset?.assetId;
  const assetType = enraptureDialogData?.asset?.assetType;

  const amount = enraptureDialogData?.amount ?? '1'
  const owner = enraptureDialogData?.owner ?? account
  const beneficiary = enraptureDialogData?.beneficiary ?? account

  const isResource = BURNABLE_RESOURCES_IDS.includes(assetId ?? '0') && assetAddress === '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777'

  const [chosenAmount, setChosenAmount] = useState<string>(amount);

  const finalAmount = isResource ? parseEther(chosenAmount).toString() : chosenAmount

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setChosenAmount(event.target.value);
    }
  };

  const enraptureObject = {
    asset: {
      assetAddress,
      assetId,
      assetType: stringAssetTypeToAssetType(assetType),
    },
    amount: finalAmount,
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

  const enraptureCallbackParams = useEnraptureAssetCallback(enraptureObject)


  if (!!enraptureCallbackParams.error) {
    callbackError = enraptureCallbackParams.error
  }

  const hasEnough = bal?.gte(finalAmount);

  const [approvalState, approveCallback] = useApproveCallback({
    assetAddress: assetAddress,
    assetId: assetId,
    assetType: assetType,
    amountToApprove: finalAmount,
  });

  const { enraptureSubmitted, enraptureTx } = useSubmittedEnraptureTx(enraptureCallbackParams?.hash);
  const isPending = useIsTransactionPending(enraptureTx?.hash)

  console.log('enrapture submission', { enraptureSubmitted, enraptureTx, finalTxSubmitted, enraptureConfirmed, hash: enraptureCallbackParams?.hash })

  useEffect(() => {
    const x = async () => {
      const confirmed = await confirmCb(enraptureCallbackParams?.hash, chainId)
      console.log('effect hook', confirmed)
      setEnraptureConfirmed(confirmed)
    }
    x()
  }, [enraptureCallbackParams?.hash, finalTxSubmitted, enraptureSubmitted, isPending])

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

    if (!enraptureParamsLoaded) {
      return (
        <div className={loadingContainer}>
          <CircularProgress />
          <div>
            <Text>Loading import details</Text>
            <Text color="textSecondary" variant="h5">
              Should be a jiffy
            </Text>
          </div>
        </div>
      );
    }

    if (enraptureConfirmed) {
      return (
        <div className={successContainer}>
          <CircleCheck className={successIcon} />
          <Text>{`Enrapture to metaverse confirmed!`}</Text>

          {enraptureTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                enraptureTx.hash,
                'transaction'
              )}
            >
              {enraptureTx.hash}
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
              <Text>Enrapturing asset into the metaverse...</Text>
              <Text color="textSecondary" variant="h5">
                Check your wallet for potential action
              </Text>
            </div>
          </div>
        </>
      );
    }

    if (finalTxSubmitted && enraptureSubmitted && !isPending) {
      return (
        <div className={successContainer}>
          <CircleCheck className={successIcon} />
          <Text>{`Transaction success!`}</Text>
          <Text color="textSecondary" variant="h5">
            Confirming enrapture with the metaverse oracle...
          </Text>

          {enraptureTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                enraptureTx.hash,
                'transaction'
              )}
            >
              {enraptureTx.hash}
            </ExternalLink>
          )}
        </div>
      );
    }
    if (!userUnderstood) {
      return (
        <Grid /*container spacing={1}*/ justifyContent="center">
          <div className={successContainer}>
            <Text>{`This NFT is going to be burned in the process and bound to the MC account forever!`}</Text>

            <Button
              onClick={() => {
                setUserUnderstood(true)
              }}
              className={button}
              variant="contained"
              color="primary"
            >
              I understood
            </Button>
          </div>
        </Grid>
      );
    }

    return (
      <Stack spacing={3} justifyContent="center" >

        <TokenDetails assetAddress={assetAddress} assetId={assetId} assetType={assetType} />
        {isResource && <Input onChange={handleAmountChange} style={{ alignSelf: 'center' }} placeholder='Amount' value={chosenAmount} /*inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}*/ />}
        <Stack spacing={1} justifyContent="center" direction={'column'} >
          {
            showApproveFlow ? (
              <Button
                onClick={() => {
                  approveCallback();
                  setApprovalSubmitted(true);
                }}
                className={formButton}
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
            )
          }
          <Button className={formButton} onClick={() => handleClose({}, "yada")} color="primary">
            Cancel
          </Button>
        </Stack>
      </Stack >
    );
  };


  return (
    <Modal isOpen={isEnraptureDialogOpen} onClose={onEnraptureDialogClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Enrapture</ModalHeader>
        <ModalBody>
          {renderBody()}
        </ModalBody>
      </ModalContent>
    </Modal>);
};
