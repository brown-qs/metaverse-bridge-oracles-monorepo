import { BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AppState } from ".."
import { setTokens } from "../slices/authSlice"

//wrap requests with authorization header
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_API_URL}/`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as AppState)?.auth?.token
        if (!!token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

//gets refresh token if token expires
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery("/refresh", api, extraOptions)
        if (!!refreshResult?.data) {
            api.dispatch(setTokens({ token: (refreshResult?.data as any)?.token ?? null, refreshToken: (refreshResult?.data as any)?.refreshToken ?? null }))
        } else {
            api.dispatch(setTokens({ token: null, refreshToken: null }))
        }
    }
    return result
}
export const bridgeApi = createApi({
    reducerPath: 'bridgeApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAssets: builder.query<void, void>({
            query: () => `/user/resources`,
        }),
    }),
})

export const { useGetAssetsQuery } = bridgeApi
