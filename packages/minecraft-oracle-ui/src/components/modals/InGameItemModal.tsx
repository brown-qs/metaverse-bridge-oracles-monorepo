import { Box, Button, CircularProgress, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checks } from "tabler-icons-react";
import { ReduxModal } from ".";
import { ChainId } from "../../constants";
import { useImportDialog, useActiveWeb3React } from "../../hooks";
import { useImportConfirmCallback } from "../../hooks/multiverse/useConfirm";
import { useImportAssetCallback, CreateImportAssetCallbackState, AssetRequest } from "../../hooks/multiverse/useImportAsset";
import { useApproveCallback, ApprovalState } from "../../hooks/useApproveCallback/useApproveCallback";
import { useBalances } from "../../hooks/useBalances/useBalances";
import { closeImportEnraptureModal, selectImportEnraptureModalOpen, selectImportEnraptureModalTokens } from "../../state/slices/importEnraptureModalSlice";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { useSubmittedImportTx, useIsTransactionPending } from "../../state/transactions/hooks";
import { getExplorerLink } from "../../utils";
import { stringAssetTypeToAssetType } from "../../utils/marketplace";
import { StringAssetType, stringToStringAssetType } from "../../utils/subgraph";
import { MoonsamaModal } from "../MoonsamaModal";
import { TransactionLink } from "../TransactionLink";

export function InGameItemModal() {
    const inGameItem = useSelector(selectInGameItem)
    return (<ReduxModal
        title="Import to metaverse confirmed!"
        TablerIcon={Checks}
        iconBackgroundColor="teal.200"
        iconColor="black"
        isOpenSelector={selectInGameItemModalOpen}
        closeActionCreator={closeInGameItemModal}
        closeOnOverlayClick={false}
    >
        <VStack spacing="0">

        </VStack >

    </ReduxModal >)
}