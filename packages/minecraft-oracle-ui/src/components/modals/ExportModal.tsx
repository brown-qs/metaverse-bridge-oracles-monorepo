import { Link as ChakraLink, Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack } from "@chakra-ui/react";
import { isPending } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowsRightLeft, Checks, Mail, MessageReport, Select, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { DEFAULT_CHAIN, PERMISSIONED_CHAINS, NETWORK_NAME, ChainId } from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { useExportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { ExportAssetCallbackState, useExportAssetCallback } from "../../hooks/multiverse/useExportAsset";
import useAddNetworkToMetamaskCb from "../../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask";
import { rtkQueryErrorFormatter, useActiveGameQuery, useEmailLoginCodeVerifyMutation, useSummonMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeExportModal, selectExportModalOpen, selectExportTokens } from "../../state/slices/exportModalSlice";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { useSubmittedExportTx, useIsTransactionPending } from "../../state/transactions/hooks";
import { getExplorerLink } from "../../utils";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";
import { TransactionLink } from "../TransactionLink";

export function ExportModal() {
    const dispatch = useDispatch()
    const exportTokens = useSelector(selectExportTokens)
    const { data: gameInProgressData, isLoading: isGameInProgressLoading, isFetching: isGameInProgressFetching, isError: isGameInProgressError, error: gameInProgressError } = useActiveGameQuery()
    const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
    const [exportParamsLoaded, setExportParamsLoaded] = useState<boolean>(false);
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
    const [exportConfirmed, setExportConfirmed] = useState<boolean>(false);
    const confirmCb = useExportConfirmCallback()

    const { chainId } = useActiveWeb3React();
    const { error: networkError, chainId: networkChainId } = useWeb3React();
    const { addNetwork } = useAddNetworkToMetamaskCb()

    const handleClose = (() => {

        dispatch(closeExportModal())
        setExportParamsLoaded(false);
        setFinalTxSubmitted(false);
        setExportConfirmed(false);
        setApprovalSubmitted(false)
    });

    if (!exportParamsLoaded && !!exportTokens?.[0]?.hash) {
        setExportParamsLoaded(true);
    }
    const assetAddress = exportTokens?.[0]?.assetAddress;
    /*const assetId = exportDialogData?.asset?.assetId;
    const assetType = exportDialogData?.asset?.assetType;
    const item = exportDialogData?.item;*/

    let callbackError: string | undefined;

    const exportCallbackParams = useExportAssetCallback({ hash: exportTokens?.[0]?.hash, chainId })


    if (!!exportCallbackParams.error) {
        callbackError = exportCallbackParams.error
    }

    const { exportSubmitted, exportTx } = useSubmittedExportTx(exportTokens?.[0]?.hash);
    const isPending = useIsTransactionPending(exportTx?.hash)

    //console.log('submission', { exportSubmitted, exportTx, finalTxSubmitted, exportConfirmed, hash: exportDialogData?.hash })


    useEffect(() => {
        const x = async () => {
            const confirmed = await confirmCb(exportTokens?.[0]?.hash, chainId)
            //console.log('effect hook', confirmed)
            setExportConfirmed(confirmed)
        }
        x()
    }, [exportTokens?.[0]?.hash, finalTxSubmitted, exportSubmitted, isPending])



    const baseProps = {
        isOpenSelector: selectExportModalOpen,
        closeActionCreator: closeExportModal,
        iconBackgroundColor: "teal.200",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
    }

    if (gameInProgressData === true) {
        return (<ReduxModal
            {...baseProps}
            title="Carnage is live!"
            TablerIcon={MessageReport}
            iconBackgroundColor="yellow.300"
            message="Sorry, you cannot export from the bridge during an ongoing Carnage game."
        >
            <VStack spacing="0">
                <Box w="100%">
                    <Button
                        leftIcon={<Checks />}
                        onClick={() => handleClose()}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)
    } else if (!exportParamsLoaded) {
        return (<ReduxModal
            {...baseProps}
            title="Loading export details"
            message="Should be a jiffy"
        >
            <VStack alignItems="center">
                <CircularProgress isIndeterminate color="teal"></CircularProgress>
            </VStack>
        </ReduxModal>)
    } else if (!chainId || !!networkError || exportTokens?.[0]?.exportChainId !== chainId) {
        const chainToConnect: ChainId = exportTokens?.[0]?.exportChainId ?? DEFAULT_CHAIN as ChainId
        const networkName = NETWORK_NAME[exportTokens?.[0]?.exportChainId ?? DEFAULT_CHAIN]
        return (<ReduxModal
            {...baseProps}
            title="Export"
            TablerIcon={MessageReport}
            iconBackgroundColor="yellow.300"
            message={`Connect to ${networkName} network first to export this item.`}
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

        </ReduxModal >)
    } else if (exportConfirmed) {
        return (<ReduxModal
            {...baseProps}
            title="Export to wallet confirmed!"
            TablerIcon={Checks}
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        <Box>
                            {exportTx && (
                                <ChakraLink isExternal
                                    href={getExplorerLink(
                                        chainId ?? ChainId.MOONRIVER,
                                        exportTx.hash,
                                        'transaction'
                                    )}
                                >
                                    {exportTx.hash}
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
            title="Landing in owner address soon..."
            message="Check your wallet for potential action"
        >


        </ReduxModal >)
    } else if (finalTxSubmitted && exportSubmitted && !isPending) {
        return (<ReduxModal
            {...baseProps}
            title="Transaction success!"
            TablerIcon={Checks}
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

        </ReduxModal >)
    } else {
        return (<ReduxModal
            {...baseProps}
            title="Export to wallet"
            message="You are about to export one or more items to your wallet, and you will not be able to use them in-game before you import them again."
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
        </ReduxModal>)
    }
}