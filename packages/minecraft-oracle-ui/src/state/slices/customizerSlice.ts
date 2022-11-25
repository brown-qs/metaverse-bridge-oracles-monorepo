import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { ChainId } from "../../constants"
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"
import { CompositeConfigItemDto } from "../api/types"

export interface CustomizerAsset {
    chainId: ChainId,
    assetAddress: string,
    assetId: number
}
export interface CustomizerCustomization {
    parentChainId: ChainId,
    parentAssetAddress: string,
    parentAssetId: number,
    assets: CustomizerAsset[]
}
export interface CustomizerSlice {
    customizations: CustomizerCustomization[]
}

const customizerSlice = createSlice({
    name: "customizerSlice",
    initialState: { customizations: [] } as CustomizerSlice,
    reducers: {
        addCustomization: (state, action: PayloadAction<CustomizerCustomization>) => {
            const customization = action.payload
            const existing = state.customizations.find(c => c.parentChainId === customization.parentChainId && c.parentAssetAddress.toLowerCase() === customization.parentAssetAddress.toLowerCase() && c.parentAssetId === customization.parentAssetId)
            if (!existing) {
                customization.parentAssetAddress = customization.parentAssetAddress.toLowerCase()
                state.customizations.push(customization)
            }
        },
        addCustomizerAssets: (state, action: PayloadAction<CustomizerCustomization>) => {
            const customization = action.payload
            const existing = state.customizations.find(c => c.parentChainId === customization.parentChainId && c.parentAssetAddress.toLowerCase() === customization.parentAssetAddress.toLowerCase() && c.parentAssetId === customization.parentAssetId)
            if (!!existing) {
                for (const ass of customization.assets) {
                    const alreadyExists = existing.assets.find(c => c.chainId === ass.chainId && c.assetAddress.toLowerCase() === ass.assetAddress.toLowerCase() && c.assetId === ass.assetId)
                    if (!alreadyExists) {
                        existing.assets.push(ass)
                    }
                }
            }
        },
        removeCustomizerAssets: (state, action: PayloadAction<CustomizerCustomization>) => {
            const customization = action.payload
            const existing = state.customizations.find(c => c.parentChainId === customization.parentChainId && c.parentAssetAddress.toLowerCase() === customization.parentAssetAddress.toLowerCase() && c.parentAssetId === customization.parentAssetId)
            if (!!existing) {
                const newAssets = []
                for (const ass of existing.assets) {
                    const toRemove = customization.assets.find(c => c.chainId === ass.chainId && c.assetAddress.toLowerCase() === ass.assetAddress.toLowerCase() && c.assetId === ass.assetId)
                    if (!toRemove) {
                        newAssets.push(ass)
                    }
                }
                existing.assets = newAssets
            }
        }
    }
})

export const { addCustomization, addCustomizerAssets, removeCustomizerAssets } = customizerSlice.actions
export default customizerSlice.reducer

export const selectCustomizerCustomizations = (state: AppState) => state?.customizer?.customizations
