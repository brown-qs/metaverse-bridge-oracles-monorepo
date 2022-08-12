import { SerializedError } from "@reduxjs/toolkit"
import { BaseQueryFn, createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { AppState } from ".."
import { setTokens } from "../slices/authSlice"
import { EmailLoginCode, EmailLoginCodeResponse } from "./types"



export const bridgeApi = createApi({
    reducerPath: 'bridgeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_BACKEND_API_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as AppState)?.auth?.token
            if (!!token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
        emailLoginCode: builder.mutation<EmailLoginCodeResponse, EmailLoginCode>({
            query: (body) => ({
                url: "/auth/email/login",
                method: "POST",
                body
            })
        }),

        getAssets: builder.query<void, void>({
            query: () => `/user/resources`,
        }),
    }),
})

export const bridgeApiErrorFormatter = (error: any): string => {
    if (!!error?.data?.message) {
        return String(error?.data?.message)
    } else if (!!error?.data?.error) {
        return String(error?.data?.error)
    } else if (!!error?.error) {
        return String(error?.error)
    } else {
        return String(error)
    }

}

export const { useEmailLoginCodeMutation, useGetAssetsQuery } = bridgeApi
