import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface ImportEnraptureModalSlice {
    modalOpen: boolean,
    importEnraptureTokens: OnChainTokenWithRecognizedTokenData[]
}

const importEnraptureModalSlice = createSlice({
    name: "importEnraptureModalSlice",
    initialState: { modalOpen: false, importEnraptureTokens: [] } as ImportEnraptureModalSlice,
    reducers: {
        closeImportEnraptureModal: (state) => {
            state.modalOpen = false
        },
        openImportEnraptureModal: (state) => {
            state.modalOpen = true
        },
        setImportEnraptureTokens: (state, importEnraptureTokens: PayloadAction<OnChainTokenWithRecognizedTokenData[]>) => {
            state.importEnraptureTokens = importEnraptureTokens.payload
        }
    }
})

export const { closeImportEnraptureModal, openImportEnraptureModal, setImportEnraptureTokens } = importEnraptureModalSlice.actions
export default importEnraptureModalSlice.reducer

export const selectImportEnraptureModalOpen = (state: AppState) => state?.importEnraptureModal?.modalOpen
export const selectImportEnraptureModalTokens = (state: AppState) => state?.importEnraptureModal?.importEnraptureTokens
