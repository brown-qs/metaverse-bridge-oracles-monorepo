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
import { DEFAULT_CHAIN, PERMISSIONED_CHAINS, NETWORK_NAME, ChainId, BURNABLE_RESOURCES_IDS, MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS, MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS, WAREHOUSE_ADDRESS } from "../../constants";
import { useActiveWeb3React, useClasses } from "../../hooks";
import { useEnraptureConfirmCallback, useExportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { AssetRequest, EnraptureAssetCallbackState, useEnraptureAssetCallback } from "../../hooks/multiverse/useEnraptureAsset";
import { ExportAssetCallbackState, useExportAssetCallback } from "../../hooks/multiverse/useExportAsset";
import useAddNetworkToMetamaskCb from "../../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask";
import { ApprovalState, checkApproval, useApproveCallback } from "../../hooks/useApproveCallback/useApproveCallback";
import { useBalances } from "../../hooks/useBalances/useBalances";
import { rtkQueryErrorFormatter, useActiveGameQuery, useEmailLoginCodeVerifyMutation, useInMutation, useSummonMutation } from "../../state/api/bridgeApi";
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

export function InModal() {
    const { chainId, account, library } = useActiveWeb3React();
    const dispatch = useDispatch()
    const inTokens = useSelector(selectInModalTokens)
    const isOpen = useSelector(selectInModalOpen)
    const addTransaction = useTransactionAdder();
    const [setIn, { data: setInData, error: setInError, isUninitialized: isSetInUninitialized, isLoading: isSetInLoading, isSuccess: isSetInSuccess, isError: isSetInError, reset: setInReset }] = useInMutation()

    const assetInTransactionStable = React.useCallback(() => assetInTransaction(inTokens?.[0]?.multiverseVersion!, inTokens?.[0]?.chainId!, library!, account!, setInData?.map((inp: CallparamDto) => inp.data)!, setInData?.map((inp: CallparamDto) => inp.signature)!, inTokens?.[0]?.enrapturable!), [inTokens, library, account, setInData])

    const signTransaciontMutation = useMutation(async () => {
        if (!inTokens?.[0] || !library || !account || !setInData) {
            throw new Error("Unable to call wallet for signature. Invalid configuration.")
        }
        const result = await assetInTransactionStable()
    })
    //async function assetInTransaction(mv: MultiverseVersion, chainId: ChainId, library: Web3Provider, account: string, calls: string[], signatures: string[], enrapture: boolean) {

    const warehouseAddress: string | undefined = React.useMemo(() => {

        if (!!inTokens?.[0]) {
            const firstToken = inTokens[0]
            if (firstToken.multiverseVersion === MultiverseVersion.V1) {
                return MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS[firstToken.chainId as ChainId]
            } else {
                return MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS[firstToken.chainId as ChainId]
            }
        }
        return undefined
    }, [inTokens])

    const { isLoading: isCheckApprovalLoading, data: checkApprovalData, refetch: refetchCheckApproval, error: checkApprovalError } = useQuery(
        ['checkApproval', inTokens?.[0]?.assetAddress, inTokens?.[0]?.assetType, account, warehouseAddress],
        () => checkApproval(inTokens?.[0]?.assetAddress!, inTokens?.[0]?.assetType!, library!, account!, warehouseAddress!),
        {
            enabled: !!library && !!account && !!inTokens?.[0]?.assetAddress && isOpen && !!warehouseAddress && !!inTokens?.[0]?.assetType
        }
    )

    const onChainTokenTokenToInDto = (tok: StandardizedOnChainTokenWithRecognizedTokenData, account: string): InDto => {
        const result: InDto = {
            chainId: tok.chainId,
            assetType: tok.assetType,
            assetAddress: tok.assetAddress,
            assetId: tok.numericId,
            amount: "1",
            owner: account
        }
        return result
    }

    React.useEffect(() => {
        if (isOpen && !!inTokens?.[0] && !!account) {
            const inParams: InDto[] = inTokens.map(tok => onChainTokenTokenToInDto(tok, account))
            refetchCheckApproval()
            setIn(inParams)
        } else {
            if (!isOpen) {
                setInReset()
                signTransaciontMutation.reset()
            }
        }
    }, [isOpen, inTokens, account])

    const baseProps = {
        isOpenSelector: selectInModalOpen,
        closeActionCreator: closeInModal,
        iconBackgroundColor: "teal.200",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
    }


    if (!inTokens?.[0]) {
        return (
            <ReduxModal
                {...baseProps}
                title="Asset Inflow"
                message="Error: No tokens were found to import!"
            >
            </ReduxModal >)
    } else if (!(!!account)) {
        return (
            <ReduxModal
                {...baseProps}
                title="Asset Inflow"
                message="Error: Account not connected"
            >
            </ReduxModal >)
    } else if (!!checkApprovalError) {
        return (
            <ReduxModal
                {...baseProps}
                title="Asset Inflow"
                message="Error: Unable to check to check for token approval. Please refresh and try again."
            >
            </ReduxModal >)
    } else if (!!setInError) {
        return (
            <ReduxModal
                {...baseProps}
                title="Asset Inflow"
                message="Error: Unable to fetch import params. Please refresh and try again."
            >
            </ReduxModal >)
    } else if (isCheckApprovalLoading || isSetInLoading) {
        return <ReduxModal
            {...baseProps}
            title="Asset Inflow"
            message="Checking for token approval and/or waiting for inflow parameters. Please wait a moment."
        >
            <MoonsamaSpinner></MoonsamaSpinner>
        </ReduxModal >
    } else if (false) {
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

                        </Box>

                    </HStack>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button
                        onClick={() => {
                            //handleClose()
                        }}
                        leftIcon={<Checks />}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)
    } else if (false) {
        return (<ReduxModal
            {...baseProps}
            title="Enrapturing asset into the multiverse..."
            message="Check your wallet for potential action"
        >

        </ReduxModal >)
    } else if (signTransaciontMutation.isSuccess) {
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

                        </Box>

                    </HStack>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button
                        onClick={() => {
                            // handleClose()
                        }}
                        leftIcon={<Checks />}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >
        </ReduxModal >)
    } else if (signTransaciontMutation.isError) {
        return (<ReduxModal
            {...baseProps}
            title="Asset Inflow"
            message="Error: Unable to sign the transaction."
        >
        </ReduxModal >)
    } else {
        return (<ReduxModal
            {...baseProps}
            title="Import to metaverse"
            message="You are about to import one or more items to the metaverse to use them in-game, and you will be able to export them back to your wallet afterward."
            bottomButtonText="Cancel"
        // onBottomButtonClick={handleClose}
        >
            <VStack spacing="0">

                <Button
                    w="100%"
                    isLoading={signTransaciontMutation.isLoading}
                    leftIcon={<Checks></Checks>}
                    onClick={() => {
                        signTransaciontMutation.mutate()
                    }}
                >
                    IMPORT TO METAVERSE
                </Button>
            </VStack>
        </ReduxModal>)
    }
}