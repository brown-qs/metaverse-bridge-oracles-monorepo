import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface EnraptureModalSlice {
    modalOpen: boolean,
    enraptureModalTokens: StandardizedOnChainTokenWithRecognizedTokenData[]
}

const enraptureModalSlice = createSlice({
    name: "enraptureModalSlice",
    initialState: { modalOpen: false, enraptureModalTokens: [] } as EnraptureModalSlice,
    reducers: {
        closeEnraptureModal: (state) => {
            state.modalOpen = false
        },
        openEnraptureModal: (state) => {
            state.modalOpen = true
        },
        setEnraptureModalTokens: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData[]>) => {
            state.enraptureModalTokens = action.payload
        }
    }
})

export const { closeEnraptureModal, openEnraptureModal, setEnraptureModalTokens } = enraptureModalSlice.actions
export default enraptureModalSlice.reducer

export const selectEnraptureModalOpen = (state: AppState) => state?.enraptureModal?.modalOpen
export const selectEnraptureModalTokens = (state: AppState) => state?.enraptureModal?.enraptureModalTokens
