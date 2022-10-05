import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface ImportModalSlice {
    modalOpen: boolean,
    importModalTokens: StandardizedOnChainTokenWithRecognizedTokenData[]
}

const importModalSlice = createSlice({
    name: "importModalSlice",
    initialState: { modalOpen: false, importModalTokens: [] } as ImportModalSlice,
    reducers: {
        closeImportModal: (state) => {
            state.modalOpen = false
        },
        openImportModal: (state) => {
            state.modalOpen = true
        },
        setImportModalTokens: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData[]>) => {
            state.importModalTokens = action.payload
        }
    }
})

export const { closeImportModal, openImportModal, setImportModalTokens } = importModalSlice.actions
export default importModalSlice.reducer

export const selectImportModalOpen = (state: AppState) => state?.importModal?.modalOpen
export const selectImportModalTokens = (state: AppState) => state?.importModal?.importModalTokens
