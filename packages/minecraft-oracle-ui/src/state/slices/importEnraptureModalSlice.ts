import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."

export interface ImportEnraptureModalSlice {
    modalOpen: boolean,
}

const importEnraptureModalSlice = createSlice({
    name: "importEnraptureModalSlice",
    initialState: { modalOpen: false } as ImportEnraptureModalSlice,
    reducers: {
        closeImportEnraptureModal: (state) => {
            state.modalOpen = false
        },
        openImportEnraptureModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeImportEnraptureModal, openImportEnraptureModal } = importEnraptureModalSlice.actions
export default importEnraptureModalSlice.reducer

export const selectImportEnraptureModalOpen = (state: AppState) => state?.importEnraptureModal?.modalOpen
