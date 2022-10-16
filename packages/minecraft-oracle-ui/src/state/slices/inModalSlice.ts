import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface InModalSlice {
    modalOpen: boolean,
    tokens: StandardizedOnChainTokenWithRecognizedTokenData[]
}

const inModalSlice = createSlice({
    name: "inModalSlice",
    initialState: { modalOpen: false, tokens: [] } as InModalSlice,
    reducers: {
        closeInModal: (state) => {
            state.modalOpen = false
        },
        openInModal: (state) => {
            state.modalOpen = true
        },
        setInModalTokens: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData[]>) => {
            state.tokens = action.payload
        }
    }
})

export const { closeInModal, openInModal, setInModalTokens } = inModalSlice.actions
export default inModalSlice.reducer

export const selectInModalOpen = (state: AppState) => state?.inModal?.modalOpen
export const selectInModalTokens = (state: AppState) => state?.inModal?.tokens
