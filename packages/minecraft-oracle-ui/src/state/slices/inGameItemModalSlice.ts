import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata } from "../../utils/graphqlReformatter"

export interface InGameItemModalSlice {
    modalOpen: boolean,
    inGameItemModalToken: InGameTokenMaybeMetadata | null
}

const inGameItemModalSlice = createSlice({
    name: "inGameItemModalSlice",
    initialState: { modalOpen: false, inGameItemModalToken: null } as InGameItemModalSlice,
    reducers: {
        closeInGameItemModal: (state) => {
            state.modalOpen = false
        },
        openInGameItemModal: (state) => {
            state.modalOpen = true
        },
        setInGameItemModalToken: (state, action: PayloadAction<InGameTokenMaybeMetadata>) => {
            state.inGameItemModalToken = action.payload
        }
    }
})

export const { closeInGameItemModal, openInGameItemModal, setInGameItemModalToken } = inGameItemModalSlice.actions
export default inGameItemModalSlice.reducer

export const selectInGameItemModalOpen = (state: AppState) => state?.inGameItemModal?.modalOpen
export const selectInGameItemModalToken = (state: AppState) => state?.inGameItemModal?.inGameItemModalToken
