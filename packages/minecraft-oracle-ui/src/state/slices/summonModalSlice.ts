import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { SummonAddress } from "../../pages/ProfilePage"

export interface SummonModalSlice {
    modalOpen: boolean,
    summonAddresses: SummonAddress[]
}

const summonModalSlice = createSlice({
    name: "summonModalSlice",
    initialState: { modalOpen: false, summonAddresses: [] } as SummonModalSlice,
    reducers: {
        closeSummonModal: (state) => {
            state.modalOpen = false
        },
        openSummonModal: (state) => {
            state.modalOpen = true
        },
        setSummonModalSummonAddresses: (state, action: PayloadAction<SummonAddress[]>) => {
            state.summonAddresses = action.payload
        }
    }
})

export const { closeSummonModal, openSummonModal, setSummonModalSummonAddresses } = summonModalSlice.actions
export default summonModalSlice.reducer

export const selectSummonModalOpen = (state: AppState) => state?.summonModal?.modalOpen
export const selectSummonModalSummonAddresses = (state: AppState) => state?.summonModal?.summonAddresses
