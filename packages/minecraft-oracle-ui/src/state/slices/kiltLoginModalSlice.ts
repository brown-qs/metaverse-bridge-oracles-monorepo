import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface KiltLoginModalSlice {
    modalOpen: boolean,
}

const kiltLoginModalSlice = createSlice({
    name: "kiltLoginModalSlice",
    initialState: { modalOpen: false } as KiltLoginModalSlice,
    reducers: {
        closeKiltLoginModal: (state) => {
            state.modalOpen = false
        },
        openKiltLoginModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeKiltLoginModal, openKiltLoginModal } = kiltLoginModalSlice.actions
export default kiltLoginModalSlice.reducer

export const selectKiltLoginModalOpen = (state: AppState) => state?.kiltLoginModal?.modalOpen
