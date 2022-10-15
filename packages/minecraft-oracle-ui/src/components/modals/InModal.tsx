import { Link as ChakraLink, Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack, FormHelperText, FormLabel } from "@chakra-ui/react";
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
import { ExportAssetCallbackState, useExportAssetCallback } from "../../hooks/multiverse/useExportAsset";
import useAddNetworkToMetamaskCb from "../../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask";
import { ApprovalState, approveAsset, checkApproval, useApproveCallback } from "../../hooks/useApproveCallback/useApproveCallback";
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
    const [setIn, { data: setInData, error: setInError, isUninitialized: isSetInUninitialized, isLoading: isSetInLoading, isSuccess: isSetInSuccess, isError: isSetInError, reset: setInReset }] = useInMutation()
    const assetInTransactionStable = React.useCallback(() => assetInTransaction(
        inTokens?.[0]?.multiverseVersion!,
        library!,
        account!,
        setInData?.map((inp: CallparamDto) => inp.data)!,
        setInData?.map((inp: CallparamDto) => inp.signature)!,
        inTokens.map((tok, i) => ({
            bridgeHash: setInData?.[i]?.hash!,
            ...onChainTokenTokenToInDto(tok, account!)
        }))
    ), [inTokens, library, account, setInData])

    const signTransactionMutation = useMutation(async () => {
        if (!inTokens?.[0] || !library || !account || !setInData) {
            throw new Error("Unable to call wallet for signature. Invalid configuration.")
        }
        const result = await assetInTransactionStable()
    })

    const isEnrapture: boolean = React.useMemo(() => inTokens?.[0]?.enrapturable === true, [inTokens])

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

    const approveAssetStable = React.useCallback(() => approveAsset(inTokens?.[0]?.assetAddress!, inTokens?.[0]?.assetType!, library!, account!, warehouseAddress!), [inTokens, library, warehouseAddress, account])

    const approveMutation = useMutation(async () => {
        if (!inTokens?.[0] || !library || !warehouseAddress || !account) {
            throw new Error("Unable to approve token. Invalid configuration.")
        }
        const result = await approveAssetStable()
    }, {
        onSuccess: () => {

        }
    })

    const { isLoading: isCheckApprovalLoading, isFetching: isCheckApprovalFetching, data: checkApprovalData, refetch: refetchCheckApproval, error: checkApprovalError } = useQuery(
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
            owner: account,
            enrapture: tok.enrapturable
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
                signTransactionMutation.reset()
                approveMutation.reset()
            }
        }
    }, [isOpen, inTokens, account])

    React.useEffect(() => {
        if (isOpen && (approveMutation?.isSuccess === true) && checkApprovalData?.toString() === "0" && !isCheckApprovalFetching) {
            refetchCheckApproval()
        }

    }, [approveMutation?.isSuccess, checkApprovalData, isCheckApprovalFetching, isOpen])

    const baseProps = {
        title: isEnrapture ? "Enrapture" : "Import",
        isOpenSelector: selectInModalOpen,
        closeActionCreator: closeInModal,
        iconBackgroundColor: "teal.200",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
        onBottomButtonClick: () => {
            dispatch(closeInModal())
        }
    }


    if (!inTokens?.[0]) {
        return (
            <ReduxModal
                {...baseProps}
                message="Error: No tokens were found to import!"
                bottomButtonText="Close"
            >
            </ReduxModal >)
    } else if (!(!!account)) {
        return (
            <ReduxModal
                {...baseProps}
                message="Error: Account not connected"
                bottomButtonText="Close"
            >
            </ReduxModal >)
    } else if (!!checkApprovalError) {
        return (
            <ReduxModal
                {...baseProps}
                message="Error: Unable to check to check for token approval. Please refresh and try again."
                bottomButtonText="Close"
            >
            </ReduxModal >)
    } else if (!!setInError) {
        return (
            <ReduxModal
                {...baseProps}
                title="Asset Inflow"
                message="Error: Unable to fetch import params. Please refresh and try again."
                bottomButtonText="Close"

            >
            </ReduxModal >)
    } else if (approveMutation.isError) {
        return (
            <ReduxModal
                {...baseProps}
                title="Asset Inflow"
                message={`Error: Unable to approve token. Please refresh and try again.`}
                bottomButtonText="Close"

            >
            </ReduxModal >)
    } else if (isCheckApprovalLoading || isSetInLoading) {
        return <ReduxModal
            {...baseProps}
            message="Checking for token approval and/or waiting for inflow parameters. Please wait a moment."
            bottomButtonText="Cancel"
        >
            <MoonsamaSpinner></MoonsamaSpinner>
        </ReduxModal >
    } else if (checkApprovalData?.toString() === "0") {
        return <ReduxModal
            {...baseProps}
            message="Token approval required. You must approve this token/collection to be moved into the Moonsama warehouse. Wallet action required."
            bottomButtonText="Cancel"
        >
            <Button
                w="100%"
                //will keep refreshing until approval is recognized
                isLoading={approveMutation.isLoading || approveMutation.isSuccess}
                leftIcon={<Checks></Checks>}
                onClick={() => {
                    approveMutation.mutate()
                }}
            >
                APPROVE
            </Button>
        </ReduxModal>
    } else if (false) {
        return (<ReduxModal
            {...baseProps}
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
            message="Check your wallet for potential action"
        >

        </ReduxModal >)
    } else if (signTransactionMutation.isSuccess) {
        return (<ReduxModal
            {...baseProps}
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
    } else if (signTransactionMutation.isError) {
        return (<ReduxModal
            {...baseProps}
            message="Error: Unable to sign the transaction."
        >
        </ReduxModal >)
    } else {
        return (<ReduxModal
            {...baseProps}
            message={isEnrapture
                ? `You are about to enrapture one or more items to the metaverse to use them in-game. They will be burned into the metaverse and not exportable.`
                : `You are about to import one or more items to the metaverse to use them in-game, and you will be able to export them back to your wallet afterward.`
            }
            bottomButtonText="Cancel"
        // onBottomButtonClick={handleClose}
        >
            <VStack spacing="0">
                <Button
                    w="100%"
                    isLoading={signTransactionMutation.isLoading}
                    leftIcon={isEnrapture ? <Flame /> : <Checks />}
                    onClick={() => {
                        signTransactionMutation.mutate()
                    }}
                >
                    {isEnrapture ? "ENRAPTURE" : "IMPORT"} TO METAVERSE
                </Button>
            </VStack>
        </ReduxModal>)
    }
}