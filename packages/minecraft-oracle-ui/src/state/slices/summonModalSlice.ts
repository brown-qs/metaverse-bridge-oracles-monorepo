import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."

export interface SummonModalSlice {
    modalOpen: boolean,
}

const summonModalSlice = createSlice({
    name: "summonModalSlice",
    initialState: { modalOpen: false } as SummonModalSlice,
    reducers: {
        closeSummonModal: (state) => {
            state.modalOpen = false
        },
        openSummonModal: (state) => {
            state.modalOpen = true
        }
    }
})

export const { closeSummonModal, openSummonModal } = summonModalSlice.actions
export default summonModalSlice.reducer

export const selectSummonModalOpen = (state: AppState) => state?.summonModal?.modalOpen
