
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
import { useEffect, useState } from 'react';
import { styles as appStyles } from '../../app.styles';
import { useIsTransactionPending, useSubmittedImportTx } from '../../state/transactions/hooks';
import { CreateImportAssetCallbackState, useImportAssetCallback } from '../../hooks/multiverse/useImportAsset';
import { useImportConfirmCallback } from '../../hooks/multiverse/useConfirm';
import { Box, Button, CircularProgress, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, VStack } from '@chakra-ui/react';
import { Checks, CircleCheck, MessageReport, Wallet } from 'tabler-icons-react';
import { MoonsamaModal } from '../MoonsamaModal';


export const ImportDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isImportDialogOpen, onImportDialogOpen, onImportDialogClose, importDialogData, setImportDialogData } = useImportDialog();
  const [importParamsLoaded, setImportParamsLoaded] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const [importConfirmed, setImportConfirmed] = useState<boolean>(false);
  const confirmCb = useImportConfirmCallback()



  const { chainId, account } = useActiveWeb3React();

  const handleClose = () => {

    onImportDialogClose();
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

  if (!importParamsLoaded) {
    return (<MoonsamaModal
      title="Loading import details"

      isOpen={isImportDialogOpen}
      onClose={() => handleClose()}
      message="Should be a jiffy"
      closeOnOverlayClick={false}
    >
      <VStack alignItems="center">
        <CircularProgress isIndeterminate color="teal"></CircularProgress>
      </VStack>

    </MoonsamaModal >)
  } else if (importConfirmed) {
    return (<MoonsamaModal
      title="Import to metaverse confirmed!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isImportDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Transaction</Box>
            <Box>
              {importTx && (
                <Link isExternal
                  href={getExplorerLink(
                    chainId ?? ChainId.MOONRIVER,
                    importTx.hash,
                    'transaction'
                  )}
                >
                  {importTx.hash}
                </Link>
              )}
            </Box>

          </HStack>
        </Box>
        <Box w="100%" paddingTop="16px">
          <Button
            onClick={() => {
              handleClose()
            }}
            leftIcon={<Checks />}
            w="100%">GOT IT!</Button>
        </Box>
      </VStack >

    </MoonsamaModal >)
  } else if (finalTxSubmitted && isPending) {
    return (<MoonsamaModal
      title="Importing asset into the metaverse..."
      isOpen={isImportDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="Check your wallet for potential action"
    >

    </MoonsamaModal >)
  } else if (finalTxSubmitted && importSubmitted && !isPending) {
    return (<MoonsamaModal
      title="Transaction success!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isImportDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="Confirming import with the metaverse oracle..."
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Transaction</Box>
            <Box>
              {importTx && (
                <Link isExternal
                  href={getExplorerLink(
                    chainId ?? ChainId.MOONRIVER,
                    importTx.hash,
                    'transaction'
                  )}
                >
                  {importTx.hash}
                </Link>
              )}
            </Box>

          </HStack>
        </Box>
        <Box w="100%" paddingTop="16px">
          <Button
            onClick={() => {
              handleClose()
            }}
            leftIcon={<Checks />}
            w="100%">GOT IT!</Button>
        </Box>
      </VStack >

    </MoonsamaModal >)
  } else {
    return (<MoonsamaModal
      title="Import to metaverse"
      isOpen={isImportDialogOpen}
      onClose={handleClose}
      message="You are about to import one or more items to the metaverse to use them in-game, and you will be able to export them back to your wallet afterward."
      closeOnOverlayClick={false}
      bottomButtonText="Cancel"
      onBottomButtonClick={handleClose}
    >
      <VStack spacing="0">

        <Box w="100%" paddingTop="16px">
          {showApproveFlow ? (
            <Button
              w="100%"

              leftIcon={<Checks></Checks>}
              onClick={() => {
                approveCallback();
                setApprovalSubmitted(true);
              }}

              disabled={approvalState === ApprovalState.PENDING || !hasEnough}
            >
              APPROVE
            </Button>
          ) : (
            <Button
              w="100%"
              leftIcon={<Checks></Checks>}
              onClick={() => {
                importCallbackParams.callback?.();
                setFinalTxSubmitted(true);
              }}
              disabled={
                importCallbackParams.state !== CreateImportAssetCallbackState.VALID || !hasEnough
              }
            >
              IMPORT TO METAVERSE
            </Button>
          )}
        </Box>
      </VStack>
    </MoonsamaModal>)
  }
}