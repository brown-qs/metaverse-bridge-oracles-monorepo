import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface SwapModalSlice {
    modalOpen: boolean,
    tokens: StandardizedOnChainTokenWithRecognizedTokenData[]
}

const swapModalSlice = createSlice({
    name: "swapModalSlice",
    initialState: { modalOpen: false, tokens: [] } as SwapModalSlice,
    reducers: {
        closeSwapModal: (state) => {
            state.modalOpen = false
        },
        openSwapModal: (state) => {
            state.modalOpen = true
        },
        setSwapModalTokens: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData[]>) => {
            state.tokens = action.payload
        }
    }
})

export const { closeSwapModal, openSwapModal, setSwapModalTokens } = swapModalSlice.actions
export default swapModalSlice.reducer

export const selectSwapModalOpen = (state: AppState) => state?.swapModal?.modalOpen
export const selectSwapModalTokens = (state: AppState) => state?.swapModal?.tokens
