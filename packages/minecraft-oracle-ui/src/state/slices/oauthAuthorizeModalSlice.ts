import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface OauthAuthorizeModalSlice {
    modalOpen: boolean,
}

const oauthAuthorizeModalSlice = createSlice({
    name: "oauthAuthorizeModalSlice",
    initialState: { modalOpen: false } as OauthAuthorizeModalSlice,
    reducers: {
        closeOauthAuthorizeModal: (state) => {
            state.modalOpen = false
        },
        openOauthAuthorizeModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeOauthAuthorizeModal, openOauthAuthorizeModal } = oauthAuthorizeModalSlice.actions
export default oauthAuthorizeModalSlice.reducer

export const selectOauthAuthorizeModalOpen = (state: AppState) => state?.emailCodeModal?.modalOpen
