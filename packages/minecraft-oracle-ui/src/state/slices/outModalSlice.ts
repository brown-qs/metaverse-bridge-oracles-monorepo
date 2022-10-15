import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface OutModalSlice {
    modalOpen: boolean,
    tokens: InGameTokenMaybeMetadata[]
}

const outModalSlice = createSlice({
    name: "outModalSlice",
    initialState: { modalOpen: false, tokens: [] } as OutModalSlice,
    reducers: {
        closeOutModal: (state) => {
            state.modalOpen = false
        },
        openOutModal: (state) => {
            state.modalOpen = true
        },
        setOutModalTokens: (state, action: PayloadAction<InGameTokenMaybeMetadata[]>) => {
            state.tokens = action.payload
        }
    }
})

export const { closeOutModal, openOutModal, setOutModalTokens } = outModalSlice.actions
export default outModalSlice.reducer

export const selectOutModalOpen = (state: AppState) => state?.outModal?.modalOpen
export const selectOutModalTokens = (state: AppState) => state?.outModal?.tokens
