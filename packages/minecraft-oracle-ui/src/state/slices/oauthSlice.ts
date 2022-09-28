import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { InGameTokenMaybeMetadata, OnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"
import { Oauth2PublicClientDto } from "../api/types"

export interface OauthSlice {
    modalOpen: boolean,
    data: Oauth2PublicClientDto | null,
}

const oauthSlice = createSlice({
    name: "oauthSlice",
    initialState: { modalOpen: false, data: null } as OauthSlice,
    reducers: {
        closeOauthModal: (state) => {
            state.modalOpen = false
        },
        openOauthModal: (state) => {
            state.modalOpen = true
        },
        setOauthData: (state, action: PayloadAction<Oauth2PublicClientDto>) => {
            state.data = action.payload
        },
        removeOauthData: (state) => {
            state.data = null
        }
    }
})

export const { closeOauthModal, openOauthModal, setOauthData, removeOauthData } = oauthSlice.actions
export default oauthSlice.reducer

export const selectOauthModalOpen = (state: AppState) => state?.oauth?.modalOpen
export const selectOauthData = (state: AppState) => state?.oauth?.data
