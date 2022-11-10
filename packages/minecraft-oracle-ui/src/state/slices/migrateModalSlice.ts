import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"

export interface MigrateModalSlice {
    modalOpen: boolean,
    tokens: StandardizedOnChainTokenWithRecognizedTokenData[]
}

const migrateModalSlice = createSlice({
    name: "migrateModalSlice",
    initialState: { modalOpen: false, tokens: [] } as MigrateModalSlice,
    reducers: {
        closeMigrateModal: (state) => {
            state.modalOpen = false
        },
        openMigrateModal: (state) => {
            state.modalOpen = true
        },
        setMigrateModalTokens: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData[]>) => {
            state.tokens = action.payload
        }
    }
})

export const { closeMigrateModal, openMigrateModal, setMigrateModalTokens } = migrateModalSlice.actions
export default migrateModalSlice.reducer

export const selectMigrateModalOpen = (state: AppState) => state?.migrateModal?.modalOpen
export const selectMigrateModalTokens = (state: AppState) => state?.migrateModal?.tokens
