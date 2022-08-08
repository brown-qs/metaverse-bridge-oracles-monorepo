
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
import { Box, Button, CircularProgress, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, HStack, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, VStack } from '@chakra-ui/react';
import { Checks, CircleCheck } from 'tabler-icons-react';
import { MoonsamaModal } from '../MoonsamaModal';
import { isValid } from 'date-fns';


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


  const { chainId, account } = useActiveWeb3React();

  const handleClose = () => {

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

  let finalAmount = chosenAmount
  if (isResource) {
    try {
      finalAmount = parseEther(chosenAmount).toString()
    } catch (e) {
      finalAmount = '1'
    }
  }
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

  const isValidAmount = (amount: string) => {
    return /^\d+$/.test(amount)
  }
  if (!enraptureParamsLoaded) {
    return (<MoonsamaModal
      title="Loading enrapture details"

      isOpen={isEnraptureDialogOpen}
      onClose={() => handleClose()}
      message="Should be a jiffy"
      closeOnOverlayClick={false}
    >
      <VStack alignItems="center">
        <CircularProgress isIndeterminate color="teal"></CircularProgress>
      </VStack>

    </MoonsamaModal >)
  } else if (enraptureConfirmed) {
    return (<MoonsamaModal
      title="Enrapture to metaverse confirmed!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isEnraptureDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Transaction</Box>
            <Box>
              {enraptureTx && (
                <Link isExternal
                  href={getExplorerLink(
                    chainId ?? ChainId.MOONRIVER,
                    String(enraptureTx?.hash),
                    'transaction'
                  )}
                >
                  {enraptureTx?.hash}
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
      title="Enrapturing asset into the metaverse..."
      isOpen={isEnraptureDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="Check your wallet for potential action"
    >

    </MoonsamaModal >)
  } else if (finalTxSubmitted && enraptureSubmitted && !isPending) {
    return (<MoonsamaModal
      title="Transaction success!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isEnraptureDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="Confirming enrapture with the metaverse oracle..."
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Transaction</Box>
            <Box>
              {enraptureTx && (
                <Link isExternal
                  href={getExplorerLink(
                    chainId ?? ChainId.MOONRIVER,
                    String(enraptureTx?.hash),
                    'transaction'
                  )}
                >
                  {enraptureTx?.hash}
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
  } else if (!userUnderstood) {
    return (<MoonsamaModal
      title="Enrapture"
      isOpen={isEnraptureDialogOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      message="This NFT is going to be burned in the process and bound to your account forever!"
    >
      <VStack spacing="0">
        <Box w="100%" paddingTop="16px">
          <Button
            onClick={() => {
              setUserUnderstood(true)
            }}
            leftIcon={<Checks />}
            w="100%">I UNDERSTAND</Button>
        </Box>
      </VStack >
    </MoonsamaModal >)
  } else {
    return (<MoonsamaModal
      title="Import to metaverse"
      isOpen={isEnraptureDialogOpen}
      onClose={handleClose}
      message="You are about to import one or more items to the metaverse to use them in-game, and you will be able to export them back to your wallet afterward."
      closeOnOverlayClick={false}
      bottomButtonText="Cancel"
      onBottomButtonClick={handleClose}
    >
      <VStack spacing="0">

        {isResource &&
          <>
            <Box w="100%">
              <FormControl isInvalid={!hasEnough || !isValidAmount(chosenAmount)} w="100%">
                <FormLabel>Amount</FormLabel>
                <Input
                  // isDisabled={isLoading}
                  value={chosenAmount}
                  onChange={handleAmountChange}
                  spellCheck="false"
                  autoCapitalize="off"
                  autoCorrect="off"
                />

                {!hasEnough && isValidAmount(chosenAmount) &&
                  <FormErrorMessage>You do not have enough.</FormErrorMessage>
                }

                {!isValidAmount(chosenAmount) &&
                  <FormErrorMessage>Invalid amount.</FormErrorMessage>
                }

                {hasEnough && isValidAmount(chosenAmount) &&
                  <FormHelperText>
                    &nbsp;
                  </FormHelperText>
                }
              </FormControl>

            </Box>
          </>
        }


        <Box w="100%" paddingTop="16px">
          {
            showApproveFlow ? (
              <Button
                w="100%"
                onClick={() => {
                  approveCallback();
                  setApprovalSubmitted(true);
                }}
                className={formButton}
                disabled={approvalState === ApprovalState.PENDING || !hasEnough || !isValidAmount(chosenAmount)}
              >
                APPROVE
              </Button>
            ) : (
              <Button
                w="100%"
                onClick={() => {
                  enraptureCallbackParams.callback?.();
                  setFinalTxSubmitted(true);
                }}
                className={formButton}
                disabled={
                  enraptureCallbackParams.state !== EnraptureAssetCallbackState.VALID || !hasEnough
                }
              >
                ENRAPTURE TO METAVERSE
              </Button>
            )
          }
        </Box>
      </VStack>
    </MoonsamaModal>)
  }

};
