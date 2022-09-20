import { VStack } from "@chakra-ui/react";
import { ReduxModal } from ".";
import { closeImportEnraptureModal, selectImportEnraptureModalOpen } from "../../state/slices/importEnraptureModalSlice";

export function ImportEnraptureModal() {
    return (<ReduxModal
        title="Coming soon!"
        isOpenSelector={selectImportEnraptureModalOpen}
        closeActionCreator={closeImportEnraptureModal}>
    </ReduxModal>)
};