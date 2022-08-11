
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import 'date-fns';
import { useActiveWeb3React } from 'hooks';
import {
  ChainId,
} from '../../constants';
import { getExplorerLink } from 'utils';
import { useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { useIsTransactionPending, useSubmittedExportTx } from 'state/transactions/hooks';
import { ExportAssetCallbackState, useExportAssetCallback } from 'hooks/multiverse/useExportAsset';
import { useExportConfirmCallback } from 'hooks/multiverse/useConfirm';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useActiveGame } from 'hooks/multiverse/useActiveGame';
import { DEFAULT_CHAIN, NETWORK_NAME } from "../../constants";
import { AssetChainDetails } from '../../components/AssetChainDetails/AssetChainDetails';
import useAddNetworkToMetamaskCb from 'hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';
import { useWeb3React } from '@web3-react/core';
import { Box, Button, CircularProgress, Divider, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, VStack } from '@chakra-ui/react';
import { ArrowsRightLeft, Checks, CircleCheck, MessageReport, Wallet } from 'tabler-icons-react';
import { MoonsamaModal } from '../MoonsamaModal';
import { TransactionLink } from '../TransactionLink';


export const ExportDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isExportDialogOpen, onExportDialogOpen, onExportDialogClose, exportDialogData, setExportDialogData } = useExportDialog();
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


  const { chainId } = useActiveWeb3React();
  const { error: networkError, chainId: networkChainId } = useWeb3React();
  const { addNetwork } = useAddNetworkToMetamaskCb()

  const handleClose = (() => {

    onExportDialogClose();
    setExportParamsLoaded(false);
    setFinalTxSubmitted(false);
    setExportConfirmed(false);
    setApprovalSubmitted(false)
  });

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

  if (activeGame) {
    return (<MoonsamaModal
      title="Carnage is live!"
      TablerIcon={MessageReport}
      iconBackgroundColor="yellow.300"
      iconColor="black"
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      message="Sorry, you cannot export from the bridge during an ongoing Carnage game."
      closeOnOverlayClick={false}
    >
      <VStack spacing="0">
        <Box w="100%">
          <Button
            leftIcon={<Checks />}
            onClick={() => handleClose()}
            w="100%">GOT IT!</Button>
        </Box>
      </VStack >

    </MoonsamaModal >)
  } else if (!exportParamsLoaded) {
    return (<MoonsamaModal
      title="Loading export details"
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      message="Should be a jiffy"
      closeOnOverlayClick={false}
    >
      <VStack alignItems="center">
        <CircularProgress isIndeterminate color="teal"></CircularProgress>
      </VStack>
    </MoonsamaModal >)
  } else if (!chainId || !!networkError || exportDialogData?.chain !== chainId) {
    const chainToConnect: ChainId = exportDialogData?.chain ?? DEFAULT_CHAIN as ChainId
    const networkName = NETWORK_NAME[exportDialogData?.chain ?? DEFAULT_CHAIN]
    return (<MoonsamaModal
      title="Export"
      TablerIcon={MessageReport}
      iconBackgroundColor="yellow.300"
      iconColor="black"
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      message={`Connect to ${networkName} network first to export this item.`}
      closeOnOverlayClick={false}
    >
      <VStack spacing="0">
        <Box w="100%">
          <Button
            onClick={() => {
              addNetwork(chainToConnect)
            }}
            leftIcon={<ArrowsRightLeft />}
            w="100%">SWITCH TO {networkName.toUpperCase()}</Button>
        </Box>
      </VStack >

    </MoonsamaModal >)
  } else if (exportConfirmed) {
    return (<MoonsamaModal
      title="Export to wallet confirmed!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Transaction</Box>
            <Box>
              {exportTx && (
                <Link isExternal
                  href={getExplorerLink(
                    chainId ?? ChainId.MOONRIVER,
                    exportTx.hash,
                    'transaction'
                  )}
                >
                  {exportTx.hash}
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
      title="Landing in owner address soon..."
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="Check your wallet for potential action"
    >


    </MoonsamaModal >)
  } else if (finalTxSubmitted && exportSubmitted && !isPending) {
    return (<MoonsamaModal
      title="Transaction success!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="Confirming export with the metaverse oracle..."
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Transaction</Box>

            {exportTx && (
              <TransactionLink
                href={getExplorerLink(
                  chainId ?? ChainId.MOONRIVER,
                  exportTx.hash,
                  'transaction'
                )}
                linkText={exportTx.hash}
              />

            )}


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
      title="Export to wallet"
      isOpen={isExportDialogOpen}
      onClose={handleClose}
      message="You are about to export one or more items to your wallet, and you will not be able to use them in-game before you import them again."
      closeOnOverlayClick={false}
      bottomButtonText="Cancel"
      onBottomButtonClick={handleClose}
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Address</Box>
            <Box><AddressDisplayComponent
              charsShown={7}
              copyTooltipLabel='Copy address'
            >
              {assetAddress ?? '?'}
            </AddressDisplayComponent></Box>

          </HStack>
        </Box>
        <Box w="100%" paddingTop="16px">
          <Button onClick={() => {
            exportCallbackParams.callback?.();
            setFinalTxSubmitted(true);
          }}
            leftIcon={<Wallet></Wallet>}
            isDisabled={exportCallbackParams.state !== ExportAssetCallbackState.VALID}
            w="100%">EXPORT TO WALLET</Button>
        </Box>
      </VStack>
    </MoonsamaModal>)
  }
}