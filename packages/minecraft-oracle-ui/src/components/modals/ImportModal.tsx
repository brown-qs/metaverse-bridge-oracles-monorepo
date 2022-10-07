import { Box, Button, CircularProgress, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checks } from "tabler-icons-react";
import { ReduxModal } from ".";
import { ChainId, DEFAULT_CHAIN, MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS, MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS } from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { useImportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { useImportAssetCallback, CreateImportAssetCallbackState, AssetRequest } from "../../hooks/multiverse/useImportAsset";
import { useApproveCallback, ApprovalState } from "../../hooks/useApproveCallback/useApproveCallback";
import { useBalances } from "../../hooks/useBalances/useBalances";
import { MultiverseVersion } from "../../state/api/types";
import { closeImportModal, selectImportModalOpen, selectImportModalTokens } from "../../state/slices/importModalSlice";
import { useSubmittedImportTx, useIsTransactionPending } from "../../state/transactions/hooks";
import { getExplorerLink } from "../../utils";
import { stringAssetTypeToAssetType } from "../../utils/marketplace";
import { StringAssetType, stringToStringAssetType } from "../../utils/subgraph";
import { MoonsamaModal } from "../MoonsamaModal";
import { TransactionLink } from "../TransactionLink";

export function ImportModal() {
    const dispatch = useDispatch()
    const isOpen = useSelector(selectImportModalOpen)
    const importTokens = useSelector(selectImportModalTokens)


    //selectImportEnraptureModalOpen
    //closeImportEnraptureModal
    const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
    const [importConfirmed, setImportConfirmed] = useState<boolean>(false);
    const confirmCb = useImportConfirmCallback()



    const { chainId, account } = useActiveWeb3React();


    useEffect(() => {
        if (!isOpen) {
            setFinalTxSubmitted(false);
            setImportConfirmed(false);
            setApprovalSubmitted(false)
        }
    }, [isOpen])


    let callbackError: string | undefined;



    const assetAddress = importTokens?.[0]?.assetAddress?.toLowerCase()
    const assId = importTokens?.[0]?.numericId
    const assetId = !!assId ? String(assId) : undefined
    const assetType = importTokens?.[0]?.assetType
    const amount = '1'
    const owner = account?.toLowerCase()
    const beneficiary = account?.toLowerCase()
    const multiverseVersion = importTokens?.[0]?.multiverseVersion ?? MultiverseVersion.V1
    const warehouseAddress = (multiverseVersion === MultiverseVersion.V1) ? MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS[chainId ?? 1285] : MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS[chainId ?? 1285]
    const importObject: AssetRequest = {
        asset: {
            assetAddress,
            assetId,
            assetType: stringAssetTypeToAssetType(assetType)
        },
        amount,
        chainId,
        multiverseVersion: multiverseVersion
    }

    const bal = useBalances([
        {
            assetAddress,
            assetId,
            assetType: stringToStringAssetType(assetType),
            id: '1',
        },
    ])?.[0];

    const importCallbackParams = useImportAssetCallback(importObject)


    if (!!importCallbackParams.error) {
        callbackError = importCallbackParams.error
    }

    const hasEnough = bal?.gte(amount);

    const [approvalState, approveCallback] = useApproveCallback({
        operator: warehouseAddress,
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

    if (importConfirmed) {
        return (<ReduxModal
            title="Import to metaverse confirmed!"
            TablerIcon={Checks}
            iconBackgroundColor="teal.200"
            iconColor="black"
            isOpenSelector={selectImportModalOpen}
            closeActionCreator={closeImportModal}
            closeOnOverlayClick={false}
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        <></>
                        {importTx && (
                            <TransactionLink
                                href={getExplorerLink(
                                    chainId ?? ChainId.MOONRIVER,
                                    importTx.hash,
                                    'transaction'
                                )}
                                linkText={importTx.hash}
                            />

                        )}

                    </HStack>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button
                        onClick={() => {
                            dispatch(closeImportModal())
                        }}
                        leftIcon={<Checks />}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)
    } else if (finalTxSubmitted && isPending) {
        return (<ReduxModal
            title="Importing asset into the metaverse..."
            isOpenSelector={selectImportModalOpen}
            closeActionCreator={closeImportModal}
            closeOnOverlayClick={false}
            message="Check your wallet for potential action"
        >

        </ReduxModal >)
    } else if (finalTxSubmitted && importSubmitted && !isPending) {
        return (<ReduxModal
            title="Transaction success!"
            TablerIcon={Checks}
            iconBackgroundColor="teal.200"
            iconColor="black"
            isOpenSelector={selectImportModalOpen}
            closeActionCreator={closeImportModal}
            closeOnOverlayClick={false}
            message="Confirming import with the metaverse oracle..."
        >
            <VStack spacing="0">
                <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
                    <HStack padding="12px">
                        <Box flex="1" color="whiteAlpha.700">Transaction</Box>
                        {importTx && (
                            <TransactionLink
                                href={getExplorerLink(
                                    chainId ?? ChainId.MOONRIVER,
                                    importTx.hash,
                                    'transaction'
                                )}
                                linkText={importTx.hash}
                            />

                        )}
                    </HStack>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button
                        onClick={() => {
                            dispatch(closeImportModal())
                        }}
                        leftIcon={<Checks />}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)
    } else {
        return (<ReduxModal
            title="Import to metaverse"
            isOpenSelector={selectImportModalOpen}
            closeActionCreator={closeImportModal}
            message="You are about to import one or more items to the metaverse to use them in-game, and you will be able to export them back to your wallet afterward."
            closeOnOverlayClick={false}
            bottomButtonText="Cancel"
            onBottomButtonClick={() => dispatch(closeImportModal())}
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
        </ReduxModal>)
    };
}