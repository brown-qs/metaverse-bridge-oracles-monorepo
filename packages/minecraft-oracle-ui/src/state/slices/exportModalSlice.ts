import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface ExportModalSlice {
    modalOpen: boolean,
    exportTokens: InGameTokenMaybeMetadata[]
}

const exportModalSlice = createSlice({
    name: "exportModalSlice",
    initialState: { modalOpen: false, exportTokens: [] } as ExportModalSlice,
    reducers: {
        closeExportModal: (state) => {
            state.modalOpen = false
        },
        openExportModal: (state) => {
            state.modalOpen = true
        },
        setExportTokens: (state, exportTokens: PayloadAction<InGameTokenMaybeMetadata[]>) => {
            state.exportTokens = exportTokens.payload
        }
    }
})

export const { setExportTokens, closeExportModal, openExportModal } = exportModalSlice.actions
export default exportModalSlice.reducer

export const selectExportModalOpen = (state: AppState) => state?.exportModal?.modalOpen
export const selectExportTokens = (state: AppState) => state?.exportModal?.exportTokens
