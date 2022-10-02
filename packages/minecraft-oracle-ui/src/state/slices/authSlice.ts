import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."

export interface AuthSliceState {
    accessToken: string | null,
    refreshToken: string | null
}
//refresh token not implemented and probably won't be

const authSlice = createSlice({
    name: "auth",
    initialState: { accessToken: null, refreshToken: null } as AuthSliceState,
    reducers: {
        setTokens: (state, action: PayloadAction<AuthSliceState>) => {
            const { accessToken, refreshToken } = action.payload
            state.accessToken = accessToken
            state.refreshToken = refreshToken
        }
    }
})

export const { setTokens } = authSlice.actions
export default authSlice.reducer

export const selectAccessToken = (state: AppState) => state?.auth?.accessToken