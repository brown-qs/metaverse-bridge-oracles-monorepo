import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { ChainId } from "../../constants"
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter"
import { CompositeConfigItemDto } from "../api/types"


export const fetchImageForCache = createAsyncThunk<string, string, any>('imageCache/fetch', async (imageUrl: string, thunkAPI) => {
    const fResult = await fetch(imageUrl, { mode: 'cors' })
    const blob = await fResult.blob()
    const reader = new FileReader();

    return await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}, { idGenerator: (arg) => arg } //so async thunk is hopefully called just one time per image
)


export interface CachedImage {
    imageUrl: string,
    imageLoaded: boolean,
    imageError: boolean,
    imageData: string | null,
}

export interface ImageCacheSlice {
    cachedImages: CachedImage[]
}
const imageCacheSlice = createSlice({
    name: "imageCacheSlice",
    initialState: { cachedImages: [] } as ImageCacheSlice,
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchImageForCache.pending, (state, action) => {
            const existingImage = state.cachedImages.find(i => i.imageUrl === action.meta.arg)
            if (!!existingImage) {

            } else {
                state.cachedImages.push({ imageUrl: action.meta.arg, imageLoaded: false, imageError: false, imageData: null })
            }
        })
        builder.addCase(fetchImageForCache.fulfilled, (state, action) => {
            const existingImage = state.cachedImages.find(i => i.imageUrl === action.meta.arg)
            if (!!existingImage) {
                existingImage.imageError = false
                existingImage.imageLoaded = true
                existingImage.imageData = action.payload
            } else {
                state.cachedImages.push({ imageUrl: action.meta.arg, imageLoaded: true, imageError: false, imageData: action.payload })
            }
        })
        builder.addCase(fetchImageForCache.rejected, (state, action) => {
            const existingImage = state.cachedImages.find(i => i.imageUrl === action.meta.arg)
            if (!!existingImage) {
                existingImage.imageError = true
                existingImage.imageLoaded = false
                existingImage.imageData = null
            } else {
                state.cachedImages.push({ imageUrl: action.meta.arg, imageLoaded: true, imageError: true, imageData: null })
            }
        })
    }
})

export const { } = imageCacheSlice.actions
export default imageCacheSlice.reducer

export const selectCachedImages = (state: AppState) => state?.imageCache?.cachedImages
