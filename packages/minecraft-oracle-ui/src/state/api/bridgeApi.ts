import { SerializedError } from "@reduxjs/toolkit"
import { BaseQueryFn, createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { AppState } from ".."
import { setTokens } from "../slices/authSlice"
import { EmailLoginCode, EmailLoginCodeResponse, EmailLoginCodeVerifyResponse, UserProfileResponse } from "./types"



export const bridgeApi = createApi({
    reducerPath: 'bridgeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_BACKEND_API_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as AppState)?.auth?.accessToken
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
        emailLoginCodeVerify: builder.mutation<EmailLoginCodeVerifyResponse, string>({
            query: (loginKey) => ({
                url: `/auth/email/verify?loginKey=${loginKey}`,
                method: "GET",
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    if (!!result?.data?.jwt) {
                        dispatch(setTokens({ accessToken: result.data.jwt, refreshToken: null }));
                        window.localStorage.setItem('accessToken', result.data.jwt);
                    }
                } catch (error) { }
            }
        }),
        getAssets: builder.query<void, void>({
            query: () => `/user/resources`,
        }),
        userProfile: builder.query<UserProfileResponse, void>({
            query: () => `/user/profile`,
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

export const { useEmailLoginCodeMutation, useUserProfileQuery, useEmailLoginCodeVerifyMutation } = bridgeApi
