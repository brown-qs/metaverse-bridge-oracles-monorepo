import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface OnChainResourceModalSlice {
    modalOpen: boolean,
    onChainResource: StandardizedOnChainTokenWithRecognizedTokenData | null
}

const onChainResourceModalSlice = createSlice({
    name: "onChainResourceModalSlice",
    initialState: { modalOpen: false, onChainResource: null } as OnChainResourceModalSlice,
    reducers: {
        closeOnChainResourceModal: (state) => {
            state.modalOpen = false
        },
        openOnChainResourceModal: (state) => {
            state.modalOpen = true
        },
        setOnChainResource: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData>) => {
            state.onChainResource = action.payload
        }
    }
})

export const { closeOnChainResourceModal, openOnChainResourceModal, setOnChainResource } = onChainResourceModalSlice.actions
export default onChainResourceModalSlice.reducer

export const selectOnChainResourceModalOpen = (state: AppState) => state?.inGameItemModal?.modalOpen
export const selectOnChainResource = (state: AppState) => state?.inGameItemModal?.inGameItem
