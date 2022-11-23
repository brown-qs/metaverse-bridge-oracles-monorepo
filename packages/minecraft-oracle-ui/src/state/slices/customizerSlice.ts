import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { ChainId } from "../../constants"
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"
import { CompositeConfigItemDto } from "../api/types"

export interface CustomizerCustomization {
    parentChainId: ChainId,
    parentAssetAddress: string,
    parentAssetId: number,
    items: CompositeConfigItemDto[]
}
export interface CustomizerSlice {
    customizations: CustomizerCustomization[]
}

const customizerSlice = createSlice({
    name: "customizerSlice",
    initialState: { customizations: [] } as CustomizerSlice,
    reducers: {

        setMigrateModalTokens: (state, action: PayloadAction<StandardizedOnChainTokenWithRecognizedTokenData[]>) => {
            //   state.tokens = action.payload
        }
    }
})

export const { setMigrateModalTokens } = customizerSlice.actions
export default customizerSlice.reducer

export const selectCustomizerCustomizations = (state: AppState) => state?.customizer?.customizations
