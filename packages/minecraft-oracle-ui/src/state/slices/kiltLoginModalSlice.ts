import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface EmailCodeModalSlice {
    modalOpen: boolean,
}

const emailCodeModalSlice = createSlice({
    name: "emailCodeModalSlice",
    initialState: { modalOpen: false } as EmailCodeModalSlice,
    reducers: {
        closeEmailCodeModal: (state) => {
            state.modalOpen = false
        },
        openEmailCodeModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeEmailCodeModal, openEmailCodeModal } = emailCodeModalSlice.actions
export default emailCodeModalSlice.reducer

export const selectEmailCodeModalOpen = (state: AppState) => state?.emailCodeModal?.modalOpen
