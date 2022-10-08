import { Link as ChakraLink, Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack, FormHelperText, FormLabel } from "@chakra-ui/react";
import { isPending } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { parseEther } from '@ethersproject/units';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowsRightLeft, Checks, Mail, MessageReport, Select, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { DEFAULT_CHAIN, PERMISSIONED_CHAINS, NETWORK_NAME, ChainId, BURNABLE_RESOURCES_IDS, MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS, MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS } from "../../constants";
import { useActiveWeb3React, useClasses } from "../../hooks";
import { useEnraptureConfirmCallback, useExportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { AssetRequest, EnraptureAssetCallbackState, useEnraptureAssetCallback } from "../../hooks/multiverse/useEnraptureAsset";
import { ExportAssetCallbackState, useExportAssetCallback } from "../../hooks/multiverse/useExportAsset";
import useAddNetworkToMetamaskCb from "../../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask";
import { ApprovalState, useApproveCallback } from "../../hooks/useApproveCallback/useApproveCallback";
import { useBalances } from "../../hooks/useBalances/useBalances";
import { rtkQueryErrorFormatter, useActiveGameQuery, useEmailLoginCodeVerifyMutation, useSummonMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeEnraptureModal, selectEnraptureModalOpen, selectEnraptureModalTokens } from "../../state/slices/enraptureModalSlice";
import { closeExportModal, selectExportModalOpen, selectExportTokens } from "../../state/slices/exportModalSlice";
import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { useSubmittedExportTx, useIsTransactionPending, useSubmittedEnraptureTx } from "../../state/transactions/hooks";
import { getExplorerLink } from "../../utils";
import { stringAssetTypeToAssetType } from "../../utils/marketplace";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";
import { TransactionLink } from "../TransactionLink";
import { MultiverseVersion } from "../../state/api/types";

export function EnraptureModal() {
    const dispatch = useDispatch()
    const enraptureTokens = useSelector(selectEnraptureModalTokens)
    const isOpen = useSelector(selectExportModalOpen)
    const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
    const [enraptureParamsLoaded, setEnraptureParamsLoaded] = useState<boolean>(false);
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
    const [enraptureConfirmed, setEnraptureConfirmed] = useState<boolean>(false);
    const [userUnderstood, setUserUnderstood] = useState<boolean>(false);
    const confirmCb = useEnraptureConfirmCallback();




    const { chainId, account } = useActiveWeb3React();

    const handleClose = () => {
        dispatch(closeEnraptureModal())
        setEnraptureParamsLoaded(false);
        setFinalTxSubmitted(false);
        setEnraptureConfirmed(false)
        setApprovalSubmitted(false)
        setUserUnderstood(false)
    };

    if (!enraptureParamsLoaded && !!enraptureTokens?.[0]) {
        setEnraptureParamsLoaded(true);
    }

    let callbackError: string | undefined;




    const assetAddress = enraptureTokens?.[0]?.assetAddress?.toLowerCase()
    const assId = enraptureTokens?.[0]?.numericId
    const assetId = !!assId ? String(assId) : undefined
    const assetType = enraptureTokens?.[0]?.assetType
    const multiverseVersion = enraptureTokens?.[0]?.multiverseVersion ?? MultiverseVersion.V1
    const warehouseAddress = (multiverseVersion === MultiverseVersion.V1) ? MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS[chainId ?? 1285] : MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS[chainId ?? 1285]


    //TO DO IMPLEMENT AMOUNT
    const amount = '1'
    const owner = account
    const beneficiary = account

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

    const enraptureObject: AssetRequest = {
        asset: {
            assetAddress,
            assetId,
            assetType: stringAssetTypeToAssetType(assetType),
        },
        amount: finalAmount,
        chainId,
        multiverseVersion: enraptureTokens?.[0]?.multiverseVersion
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
        operator: warehouseAddress,
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

    const baseProps = {
        isOpenSelector: selectEnraptureModalOpen,
        closeActionCreator: closeEnraptureModal,
        iconBackgroundColor: "teal.200",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
    }


    if (!enraptureParamsLoaded) {
        return (<ReduxModal
            {...baseProps}
            title="Loading enrapture details"
            message="Should be a jiffy"
        >
            <VStack alignItems="center">
                <CircularProgress isIndeterminate color="teal"></CircularProgress>
            </VStack>

        </ReduxModal >)
    } else if (enraptureConfirmed) {
        return (<ReduxModal
            {...baseProps}
            title="Enrapture to metaverse confirmed!"
            TablerIcon={Checks}
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        <Box>
                            {enraptureTx && (
                                <ChakraLink isExternal
                                    href={getExplorerLink(
                                        chainId ?? ChainId.MOONRIVER,
                                        String(enraptureTx?.hash),
                                        'transaction'
                                    )}
                                >
                                    {enraptureTx?.hash}
                                </ChakraLink>
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

        </ReduxModal >)
    } else if (finalTxSubmitted && isPending) {
        return (<ReduxModal
            {...baseProps}
            title="Enrapturing asset into the multiverse..."
            message="Check your wallet for potential action"
        >

        </ReduxModal >)
    } else if (finalTxSubmitted && enraptureSubmitted && !isPending) {
        return (<ReduxModal
            {...baseProps}
            title="Transaction success!"
            TablerIcon={Checks}
            message="Confirming enrapture with the multiverse oracle..."
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        <Box>
                            {enraptureTx && (
                                <ChakraLink isExternal
                                    href={getExplorerLink(
                                        chainId ?? ChainId.MOONRIVER,
                                        String(enraptureTx?.hash),
                                        'transaction'
                                    )}
                                >
                                    {enraptureTx?.hash}
                                </ChakraLink>
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

        </ReduxModal >)
    } else if (!userUnderstood) {
        return (<ReduxModal
            {...baseProps}
            title="Enrapture"
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
        </ReduxModal >)
    } else {
        return (<ReduxModal
            {...baseProps}
            title="Import to metaverse"
            message="You are about to import one or more items to the metaverse to use them in-game, and you will be able to export them back to your wallet afterward."
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
        </ReduxModal>)
    }
}