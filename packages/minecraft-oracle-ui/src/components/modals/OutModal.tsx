import { Link as ChakraLink, Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack, FormHelperText, FormLabel, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { isPending } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { parseEther } from '@ethersproject/units';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowsRightLeft, Checks, Flame, Mail, MessageReport, Select, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { DEFAULT_CHAIN, PERMISSIONED_CHAINS, NETWORK_NAME, ChainId, BURNABLE_RESOURCES_IDS, MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS, MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS, WAREHOUSE_ADDRESS } from "../../constants";
import { useActiveWeb3React, useClasses } from "../../hooks";
import { useEnraptureConfirmCallback, useExportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { AssetRequest, EnraptureAssetCallbackState, useEnraptureAssetCallback } from "../../hooks/multiverse/useEnraptureAsset";
import { assetOutTransaction, ExportAssetCallbackState, useExportAssetCallback } from "../../hooks/multiverse/useExportAsset";
import useAddNetworkToMetamaskCb from "../../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask";
import { ApprovalState, approveAsset, checkApproval, useApproveCallback } from "../../hooks/useApproveCallback/useApproveCallback";
import { useBalances } from "../../hooks/useBalances/useBalances";
import { rtkQueryErrorFormatter, useActiveGameQuery, useEmailLoginCodeVerifyMutation, useInMutation, useOutMutation, useSummonMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeEnraptureModal, selectEnraptureModalOpen, selectEnraptureModalTokens } from "../../state/slices/enraptureModalSlice";
import { closeExportModal, selectExportModalOpen, selectExportTokens } from "../../state/slices/exportModalSlice";
import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { useSubmittedExportTx, useIsTransactionPending, useSubmittedEnraptureTx, useTransactionAdder } from "../../state/transactions/hooks";
import { getExplorerLink } from "../../utils";
import { stringAssetTypeToAssetType } from "../../utils/marketplace";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";
import { TransactionLink } from "../TransactionLink";
import { CallparamDto, InDto, MultiverseVersion } from "../../state/api/types";
import { MoonsamaSpinner } from "../MoonsamaSpinner";
import { closeInModal, selectInModalOpen, selectInModalTokens } from "../../state/slices/inModalSlice";
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter";
import { useMutation, useQuery } from "react-query";
import { assetInTransaction } from "../../hooks/multiverse/useImportAsset";
import { closeOutModal, selectOutModalOpen, selectOutModalTokens } from "../../state/slices/outModalSlice";

export function OutModal() {
    const { chainId, account, library } = useActiveWeb3React();
    const { error: networkError } = useWeb3React();
    const { addNetwork } = useAddNetworkToMetamaskCb()

    const { data: gameInProgressData, isLoading: isGameInProgressLoading, isFetching: isGameInProgressFetching, isError: isGameInProgressError, error: gameInProgressError } = useActiveGameQuery()

    const dispatch = useDispatch()
    const outTokens = useSelector(selectOutModalTokens)
    const isOpen = useSelector(selectOutModalOpen)
    const [setOut, { data: setOutData, error: setOutError, isUninitialized: isSetOutUninitialized, isLoading: isSetOutLoading, isSuccess: isSetOutSuccess, isError: isSetOutError, reset: setOutReset }] = useOutMutation()

    const assetOutTransactionStable = React.useCallback(() => assetOutTransaction(
        outTokens?.[0]?.multiverseVersion!,
        library!,
        account!,
        outTokens?.[0]?.chainId!,
        setOutData?.map((inp: CallparamDto) => inp.data)!,
        setOutData?.map((inp: CallparamDto) => inp.signature)!,
        outTokens?.map((tok) => tok.hash!)!,
    ), [outTokens, library, account, setOutData])

    const signTransactionMutation = useMutation(async () => {
        if (!outTokens?.[0] || !library || !account || !setOutData) {
            throw new Error("Unable to call wallet for signature. Invalid configuration.")
        }
        const result = await assetOutTransactionStable()
        return result
    })


    React.useEffect(() => {
        if (isOpen && !!outTokens?.[0] && !!account) {
            setOut(outTokens.map(tok => ({ hash: tok.hash!, chainId: tok.chainId })))
        } else {
            if (!isOpen) {
                setOutReset()
                signTransactionMutation.reset()
            }
        }
    }, [isOpen, outTokens, account])


    const baseProps = {
        title: "Export",
        isOpenSelector: selectOutModalOpen,
        closeActionCreator: closeOutModal,
        iconBackgroundColor: "teal.200",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
        onBottomButtonClick: () => {
            dispatch(closeOutModal())
        }
    }

    if (gameInProgressData === true) {
        return (<ReduxModal
            {...baseProps}
            title="Carnage is live!"
            TablerIcon={MessageReport}
            iconBackgroundColor="yellow.300"
            message="Sorry, you cannot export from the bridge during an ongoing Carnage game or the resource distribution period after Carnage."
        >
            <VStack spacing="0">
                <Box w="100%">
                    <Button
                        leftIcon={<Checks />}
                        onClick={() => dispatch(closeOutModal())}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)
    } else if (signTransactionMutation.isError) {
        let errorMsg = `Unable to sign the transaction.`
        if (String(signTransactionMutation.error).includes("insufficient allowance")) {
            errorMsg = `Insufficient allowance.`
        }

        return (<ReduxModal
            {...baseProps}
            message={`Error: ${errorMsg}`}
            bottomButtonText="Close"
        >
        </ReduxModal >)


    } else if (isSetOutError) {
        return (
            <ReduxModal
                {...baseProps}
                message="Error: Unable to fetch export parameters."
                bottomButtonText="Close"

            >
            </ReduxModal >)

    } else if (isSetOutLoading) {
        return (<ReduxModal
            {...baseProps}
            message="Export parameters loading."
            bottomButtonText="Cancel"
        >
            <MoonsamaSpinner></MoonsamaSpinner>
        </ReduxModal>)
    } else if (!chainId || !!networkError || outTokens?.[0]?.chainId !== chainId) {
        const chainToConnect: ChainId = outTokens?.[0]?.chainId ?? DEFAULT_CHAIN as ChainId
        const networkName = NETWORK_NAME[outTokens?.[0]?.chainId ?? DEFAULT_CHAIN]
        return (<ReduxModal
            {...baseProps}
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
    } else if (signTransactionMutation.isSuccess) {
        return (<ReduxModal
            {...baseProps}
            TablerIcon={Checks}
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        <Box w="100%" overflow="hidden">
                            {!!signTransactionMutation.data && (
                                <ChakraLink whiteSpace="nowrap" isExternal textOverflow={"ellipsis"} w="100%" overflow="hidden"
                                    href={getExplorerLink(
                                        chainId ?? ChainId.MOONRIVER,
                                        signTransactionMutation?.data?.hash,
                                        'transaction'
                                    )}
                                >
                                    {signTransactionMutation?.data?.hash}
                                </ChakraLink>
                            )}
                        </Box>

                    </HStack>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button
                        onClick={() => {
                            dispatch(closeOutModal())
                        }}
                        leftIcon={<Checks />}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)

    } else {
        return (<ReduxModal
            {...baseProps}
            message="You are about to export one or more items to your wallet, and you will not be able to use them in-game before you import them again."
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Address</Box>
                        <Box><AddressDisplayComponent
                            charsShown={7}
                            copyTooltipLabel='Copy address'
                        >
                            {outTokens?.[0]?.exportAddress ?? '?'}
                        </AddressDisplayComponent></Box>

                    </HStack>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button
                        onClick={() => {
                            signTransactionMutation.mutate()
                        }}
                        leftIcon={<Wallet></Wallet>}
                        isLoading={signTransactionMutation.isLoading}
                        w="100%">EXPORT TO WALLET</Button>
                </Box>
            </VStack>
        </ReduxModal>)
    }
}