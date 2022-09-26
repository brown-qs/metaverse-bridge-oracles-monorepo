import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface InGameItemModalSlice {
    modalOpen: boolean,
    inGameItem: InGameTokenMaybeMetadata | null
}

const inGameItemModalSlice = createSlice({
    name: "inGameItemModalSlice",
    initialState: { modalOpen: false, inGameItem: null } as InGameItemModalSlice,
    reducers: {
        closeInGameItemModal: (state) => {
            state.modalOpen = false
        },
        openInGameItemModal: (state) => {
            state.modalOpen = true
        },
        setInGameItem: (state, inGameItem: PayloadAction<InGameTokenMaybeMetadata>) => {
            state.inGameItem = inGameItem.payload
        }
    }
})

export const { closeInGameItemModal, openInGameItemModal, setInGameItem } = inGameItemModalSlice.actions
export default inGameItemModalSlice.reducer

export const selectInGameItemModalOpen = (state: AppState) => state?.inGameItemModal?.modalOpen
export const selectInGameItem = (state: AppState) => state?.inGameItemModal?.inGameItem
