import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface OauthStartModalSlice {
    modalOpen: boolean,
}

const oauthStartModalSlice = createSlice({
    name: "oauthStartModalSlice",
    initialState: { modalOpen: false } as OauthStartModalSlice,
    reducers: {
        closeOauthStartModal: (state) => {
            state.modalOpen = false
        },
        openOauthStartModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeOauthStartModal, openOauthStartModal } = oauthStartModalSlice.actions
export default oauthStartModalSlice.reducer

export const selectOauthStartModalOpen = (state: AppState) => state?.oauthStartModal?.modalOpen
