import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface EmailLoginModalSlice {
    modalOpen: boolean,
}

const emailLoginModalSlice = createSlice({
    name: "emailLoginModalSlice",
    initialState: { modalOpen: false } as EmailLoginModalSlice,
    reducers: {
        closeEmailLoginModal: (state) => {
            state.modalOpen = false
        },
        openEmailLoginModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeEmailLoginModal, openEmailLoginModal } = emailLoginModalSlice.actions
export default emailLoginModalSlice.reducer

export const selectEmailLoginModalOpen = (state: AppState) => state?.emailLoginModal?.modalOpen
