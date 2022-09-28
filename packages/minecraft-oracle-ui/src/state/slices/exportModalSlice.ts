import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface ExportModalSlice {
    modalOpen: boolean,
}

const exportModalSlice = createSlice({
    name: "exportModalSlice",
    initialState: { modalOpen: false } as ExportModalSlice,
    reducers: {
        closeExportModal: (state) => {
            state.modalOpen = false
        },
        openExportModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeExportModal, openExportModal } = exportModalSlice.actions
export default exportModalSlice.reducer

export const selectExportModalOpen = (state: AppState) => state?.exportModal?.modalOpen
