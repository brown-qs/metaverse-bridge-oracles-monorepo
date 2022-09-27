import { Box, Button, CircularProgress, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checks } from "tabler-icons-react";
import { ReduxModal } from ".";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";

export function EmailCodeModal() {
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