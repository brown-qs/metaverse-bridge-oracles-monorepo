import { Box, Button, CircularProgress, HStack, Tooltip, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checks } from "tabler-icons-react";
import { ReduxModal } from ".";
import { closeInGameItemModal, selectInGameItemModalOpen, selectInGameItemModalToken } from "../../state/slices/inGameItemModalSlice";
import { AssetChainDetails } from "../AssetChainDetails/AssetChainDetails";

export function InGameItemModal() {
    const inGameItem = useSelector(selectInGameItemModalToken)
    return (<ReduxModal
        title={inGameItem?.recognizedAssetType}
        isOpenSelector={selectInGameItemModalOpen}
        closeActionCreator={closeInGameItemModal}
    >
        <VStack spacing="0" alignItems="flex-start" color="whiteAlpha.700">
            <Box w="100%">
                <div >
                    <div >
                        {inGameItem?.enraptured ? 'This item is enraptured.' : 'This item is imported.'}
                    </div>
                </div>
                <div >
                    <div >
                        {inGameItem?.exportable ? <Tooltip label={'This item can be exported back to the chain it came from to the original owner address.'}>
                            <div>This item is exportable.</div>
                        </Tooltip> : <Tooltip label={'This item is burned into the metaverse forever. Cannot be taken back.'}>
                            <div>This item is not exportable.</div>
                        </Tooltip>}
                    </div>
                </div>
                <div >
                    <div >
                        {`Portal balance: ${inGameItem?.amount}`}
                    </div>
                </div>
            </Box>

            <Box w="100%">
                {inGameItem?.exportable && <AssetChainDetails data={inGameItem} borderOn={false} />}
            </Box>
        </VStack>

    </ReduxModal >)
}