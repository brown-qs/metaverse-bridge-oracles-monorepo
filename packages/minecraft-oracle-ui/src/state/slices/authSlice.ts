import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."

export interface AuthSliceState {
    token: string | null,
    refreshToken: string | null
}
const authSlice = createSlice({
    name: "auth",
    initialState: { token: null, refreshToken: null } as AuthSliceState,
    reducers: {
        setTokens: (state, action: PayloadAction<AuthSliceState>) => {
            const { token, refreshToken } = action.payload
            state.token = token
            state.refreshToken = refreshToken
        }
    }
})

export const { setTokens } = authSlice.actions
export default authSlice.reducer

export const selectAuth = (state: AppState) => state.auth