import { Link as ChakraLink, Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack, FormHelperText, FormLabel, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputField, NumberInputStepper, InputRightElement } from "@chakra-ui/react";
import { isPending } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { parseEther, formatEther } from '@ethersproject/units';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowsLeftRight, ArrowsRightLeft, Checks, Flame, Mail, MessageReport, Select, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { DEFAULT_CHAIN, PERMISSIONED_CHAINS, NETWORK_NAME, ChainId, BURNABLE_RESOURCES_IDS, MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS, MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS, WAREHOUSE_ADDRESS, numberFormatter } from "../../constants";
import { useActiveWeb3React, useClasses } from "../../hooks";
import { useEnraptureConfirmCallback, useExportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { AssetRequest, EnraptureAssetCallbackState, useEnraptureAssetCallback } from "../../hooks/multiverse/useEnraptureAsset";
import { ExportAssetCallbackState, useExportAssetCallback } from "../../hooks/multiverse/useExportAsset";
import useAddNetworkToMetamaskCb from "../../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask";
import { ApprovalState, approveAsset, checkApproval, useApproveCallback } from "../../hooks/useApproveCallback/useApproveCallback";
import { getAssetBalance, useBalances } from "../../hooks/useBalances/useBalances";
import { rtkQueryErrorFormatter, useActiveGameQuery, useEmailLoginCodeVerifyMutation, useInMutation, useSummonMutation, useMigrateInMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";

import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { useSubmittedExportTx, useIsTransactionPending, useSubmittedEnraptureTx, useTransactionAdder } from "../../state/transactions/hooks";
import { getExplorerLink } from "../../utils";
import { stringAssetTypeToAssetType } from "../../utils/marketplace";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";
import { TransactionLink } from "../TransactionLink";
import { CallparamDto, InRequestDto, MultiverseVersion } from "../../state/api/types";
import { MoonsamaSpinner } from "../MoonsamaSpinner";
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter";
import { useMutation, useQuery } from "react-query";
import { assetInTransaction } from "../../hooks/multiverse/useImportAsset";
import { utils } from "ethers"
import { closeMigrateModal, selectMigrateModalOpen, selectMigrateModalTokens } from "../../state/slices/migrateModalSlice";

export function MigrateModal() {
    const { chainId, account, library } = useActiveWeb3React();
    const dispatch = useDispatch()
    const inTokens = useSelector(selectMigrateModalTokens)
    const isOpen = useSelector(selectMigrateModalOpen)
    const [setIn, { data: setInData, error: setInError, isUninitialized: isSetInUninitialized, isLoading: isSetInLoading, isSuccess: isSetInSuccess, isError: isSetInError, reset: setInReset }] = useMigrateInMutation()
    const [value, setValue] = React.useState('.01')
    const [amount, setAmount] = React.useState<string | undefined>(undefined)
    const assetInTransactionStable = React.useCallback(() => assetInTransaction(
        inTokens?.[0]?.multiverseVersion!,
        library!,
        account!,
        setInData?.map((inp: CallparamDto) => inp.data)!,
        setInData?.map((inp: CallparamDto) => inp.signature)!,
        inTokens.map((tok, i) => ({
            bridgeHash: setInData?.[i]?.hash!,
            ...onChainTokenTokenToInDto(tok, account!, amount ?? "1")
        })),
        true
    ), [inTokens, library, account, setInData])

    const signTransactionMutation = useMutation(async () => {
        if (!inTokens?.[0] || !library || !account || !setInData) {
            throw new Error("Unable to call wallet for signature. Invalid configuration.")
        }
        const result = await assetInTransactionStable()
        return result
    })

    const isEnrapture: boolean = React.useMemo(() => inTokens?.[0]?.enrapturable === true, [inTokens])
    const isFungible: boolean = React.useMemo(() => inTokens?.[0]?.treatAsFungible === true, [inTokens])

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

    const { isLoading: isBalanceLoading, data: balanceData, refetch: refetchBalance } = useQuery(
        ['getAssetBalance', inTokens?.[0]?.assetAddress, inTokens?.[0]?.assetType, account],
        () => getAssetBalance({ assetType: inTokens?.[0]?.assetType!, assetAddress: inTokens?.[0]?.assetAddress!, assetId: 0 }, library!, account!),
        {
            enabled: !!library && !!account && isFungible && !!inTokens?.[0]?.assetAddress && isOpen && !!inTokens?.[0]?.assetType
        }
    )

    const { isLoading: isCheckApprovalLoading, isFetching: isCheckApprovalFetching, data: checkApprovalData, refetch: refetchCheckApproval, error: checkApprovalError } = useQuery(
        ['checkApproval', inTokens?.[0]?.assetAddress, inTokens?.[0]?.assetType, account, warehouseAddress],
        () => checkApproval(inTokens?.[0]?.assetAddress!, inTokens?.[0]?.assetType!, library!, account!, warehouseAddress!),
        {
            enabled: !!library && !!account && !!inTokens?.[0]?.assetAddress && isOpen && !!warehouseAddress && !!inTokens?.[0]?.assetType
        }
    )

    const onChainTokenTokenToInDto = (tok: StandardizedOnChainTokenWithRecognizedTokenData, account: string, amount: string): InRequestDto => {
        const result: InRequestDto = {
            chainId: tok.chainId,
            assetType: tok.assetType,
            assetAddress: tok.assetAddress,
            assetId: tok.numericId,
            amount,
            owner: account,
            enrapture: tok.enrapturable
        }
        return result
    }

    React.useEffect(() => {
        if (isOpen && !!inTokens?.[0] && !!account) {
            refetchCheckApproval()
            if (isFungible) {
                if (!!balanceData) {
                    const inParams: InRequestDto[] = inTokens.map(tok => onChainTokenTokenToInDto(tok, account, balanceData.toString()))
                    setIn({ requests: inParams })

                }
            } else {
                const inParams: InRequestDto[] = inTokens.map(tok => onChainTokenTokenToInDto(tok, account, "1"))
                console.log("set in NOT fungible")

                setIn({ requests: inParams })
            }

        } else {
            if (!isOpen) {
                setInReset()
                signTransactionMutation.reset()
                approveMutation.reset()
                setAmount(undefined)
            }
        }
    }, [isOpen, inTokens, account, isFungible, balanceData])

    React.useEffect(() => {
        if (isOpen && (approveMutation?.isSuccess === true) && checkApprovalData?.toString() === "0" && !isCheckApprovalFetching) {
            refetchCheckApproval()
        }

    }, [approveMutation?.isSuccess, checkApprovalData, isCheckApprovalFetching, isOpen])

    const baseProps = {
        title: "MIGRATE",
        isOpenSelector: selectMigrateModalOpen,
        closeActionCreator: closeMigrateModal,
        iconBackgroundColor: "teal.200",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
        onBottomButtonClick: () => {
            dispatch(closeMigrateModal())
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
                message={`Error: Unable to fetch import params. Please refresh and try again. ${rtkQueryErrorFormatter(setInError)}`}
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
    } else if (isFungible && isBalanceLoading) {
        return <ReduxModal
            {...baseProps}
            message="Balance loading. Please wait a moment."
            bottomButtonText="Cancel"
        >
            <MoonsamaSpinner></MoonsamaSpinner>
        </ReduxModal >
    } else if (false && isFungible && typeof amount !== 'string') {
        return <ReduxModal
            {...baseProps}
            message={`Please set the amount you want to migrate.`}
            bottomButtonText="Cancel"
        >
            <VStack spacing="0" w="100%">
                <Box>Balance: {numberFormatter(utils.formatUnits(balanceData ?? "0", inTokens?.[0]?.decimals))}</Box>
                <Box h='24px'></Box>
                <HStack spacing="0" w="100%">
                    <NumberInput
                        inputMode="decimal"
                        w="100%"
                        defaultValue={.01}
                        precision={.01}
                        min={.01}
                        value={value}
                        onChange={(val) => setValue(val)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Box w="16px"></Box>
                    <Button
                        isDisabled={value?.length === 0}
                        //will keep refreshing until approval is recognized
                        onClick={() => {
                            setAmount(balanceData?.toString() ?? "1")
                        }}
                    >
                        MAX
                    </Button>
                </HStack>
                <Box h='24px'></Box>
                <Button
                    w="100%"
                    isDisabled={value?.length === 0}
                    //will keep refreshing until approval is recognized
                    onClick={() => {
                        setAmount(utils.parseUnits(value, inTokens?.[0]?.decimals).toString())
                    }}
                >
                    SET
                </Button>
            </VStack>
        </ReduxModal>
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
            message="Token approval required. You must approve $POOP to convert it to $SAMA. Check your wallet for an action."
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
            message={`Confirming ${isEnrapture ? "enrapture" : "import"} with the multiverse oracle...`}
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px" overflow="ellipsis" w="100%" whiteSpace="nowrap">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        <Box overflow="hidden" textOverflow="ellipsis">
                            {!!signTransactionMutation.data && (
                                <ChakraLink isExternal
                                    href={getExplorerLink(
                                        chainId ?? ChainId.MOONRIVER,
                                        String(signTransactionMutation?.data?.hash),
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
                            dispatch(closeMigrateModal())
                        }}
                        leftIcon={<Checks />}
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
        >
        </ReduxModal >)
    } else {
        return (<ReduxModal
            {...baseProps}
            message={"You are about to migrate all your $POOP on Moonbeam to $SAMA tokens on the Exosama Network on a 1:1 basis. This action is irreversible."}
            bottomButtonText="Cancel"
        // onBottomButtonClick={handleClose}
        >
            <VStack spacing="0">
                <Box
                    fontSize="16px"
                    lineHeight="24px"
                    paddingBottom="16px"
                    fontFamily="Rubik"
                    color="whiteAlpha.700"
                >If you would like to migrate your $POOP and also receive extra rewards, please visit the <ChakraLink href={"/portal"}>Portal</ChakraLink> to enrapture your $POOP and migrate through Carnage. A gamepass is required.</Box>
                {amount &&
                    <Box paddingBottom="16px">
                        Amount: {numberFormatter(utils.formatUnits(amount, inTokens?.[0]?.decimals))}
                    </Box>}
                <Button
                    w="100%"
                    isLoading={signTransactionMutation.isLoading}
                    leftIcon={<ArrowsLeftRight></ArrowsLeftRight>}
                    onClick={() => {
                        signTransactionMutation.mutate()
                    }}
                >
                    MIGRATE
                </Button>
            </VStack>
        </ReduxModal>)
    }
}