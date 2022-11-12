import { SerializedError } from "@reduxjs/toolkit"
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { AppState } from ".."
import { StandardizedOnChainToken } from "../../utils/graphqlReformatter"
import { setTokens } from "../slices/authSlice"
import { setMigrationStatus, setOutTransactionHash } from "../slices/transactionsSlice"
import { BridgedAssetDto, CallparamDto, CompositeConfigDto, EmailLoginCode, EmailLoginCodeResponse, EmailLoginCodeVerifyResponse, InBatchRequestDto, InConfirmRequestDto, InConfirmResponseDto, MigrateResponseDto, Oauth2PublicClientDto, OutBatchRequestDto, OutConfirmRequestDto, OutConfirmResponseDto, RecognizedAssetsDto, SkinResponse, SkinSelectRequest, UserProfileResponse } from "./types"


// ---------------------------------------------------------- //
// CUSTOM BASE QUERY THAT HANDLES AUTH LOGOUTS
// ---------------------------------------------------------- //
const authFetchBaseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_API_URL}`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as AppState)?.auth?.accessToken
        if (!!token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const accessTokenBeforeRequest = (api.getState() as AppState)?.auth?.accessToken
    let result = await authFetchBaseQuery(args, api, extraOptions)
    if (result?.error?.status === 401) {
        const accessTokenAfterRequest = (api.getState() as AppState)?.auth?.accessToken
        //check that there was no reauth while request was in flight
        console.log(`bridgeApi:: 401 error accessTokenBeforeRequest: ${accessTokenBeforeRequest} accessTokenAfterRequest: ${accessTokenAfterRequest}`)
        if (!!accessTokenBeforeRequest && !!accessTokenAfterRequest && (accessTokenBeforeRequest === accessTokenAfterRequest)) {
            console.log("bridgeApi:: user was logged out because of 401 (token expired)")
            api.dispatch(setTokens({ accessToken: null, refreshToken: null }));
        }
    }
    return result
}


// ---------------------------------------------------------- //
// BRIDGE API
// ---------------------------------------------------------- //
export const bridgeApi = createApi({
    reducerPath: 'bridgeApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Skin", "Profile", "InGameResources"],
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
            invalidatesTags: ["Profile"],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    if (!!result?.data?.jwt) {
                        dispatch(setTokens({ accessToken: result.data.jwt, refreshToken: null }));
                    }
                } catch (error) { }
            }
        }),
        emailChange: builder.mutation<EmailLoginCodeResponse, EmailLoginCode>({
            query: (body) => ({
                url: "/auth/email/change",
                method: "PUT",
                body
            })
        }),
        gamerTagSet: builder.mutation<void, { gamerTag: string }>({
            query: (body) => ({
                url: "/user/gamertag",
                method: "PUT",
                body
            }),
            invalidatesTags: ["Profile"]
        }),
        minecraftRedirect: builder.mutation<{ redirectUrl: string }, void>({
            query: () => ("/auth/minecraft/login")
        }),
        minecraftLink: builder.mutation<void, string>({
            query: (qs) => (`/auth/minecraft/link${qs}`),
            invalidatesTags: ["Profile"]
        }),
        minecraftUnlink: builder.mutation<void, void>({
            query: () => ({
                url: `/auth/minecraft/unlink`,
                method: "DELETE"
            }),
            invalidatesTags: ["Profile"]
        }),
        getInGameItems: builder.query<BridgedAssetDto[], void>({
            query: () => `/user/in-game-items`,
        }),
        getInGameResources: builder.query<BridgedAssetDto[], void>({
            query: () => `/user/in-game-resources`,
            providesTags: ["InGameResources"]
        }),
        summon: builder.mutation<boolean, { recipient: string, chainId: number }>({
            query: (body) => ({
                url: `/oracle/summon`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["Profile"]
        }),
        migrateIn: builder.mutation<CallparamDto[], InBatchRequestDto>({
            query: (body) => ({
                url: `/oracle/migrate-in`,
                method: "PUT",
                body
            }),
        }),
        migrate: builder.mutation<MigrateResponseDto, InConfirmRequestDto>({
            query: (body) => ({
                url: `/oracle/migrate`,
                method: "PUT",
                body
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    if (!!result?.data) {
                        const transactionStatus = result?.data?.transactionStatus
                        const transactionHash = result?.data?.transactionHash
                        console.log(`migrate:: bridge hash: ${args.hash} transactionStatus: ${transactionStatus} transactionHash: ${transactionHash}`)
                        if (!!transactionStatus) {
                            dispatch(setMigrationStatus({ bridgeHash: args.hash, migrationStatus: transactionStatus }));
                        }
                        if (!!transactionHash) {
                            dispatch(setOutTransactionHash({ bridgeHash: args.hash, outTransactionHash: transactionHash }));
                        }
                    }
                } catch (error) { }
            }
        }),
        in: builder.mutation<CallparamDto[], InBatchRequestDto>({
            query: (body) => ({
                url: `/oracle/in`,
                method: "PUT",
                body
            }),
        }),
        inConfirm: builder.mutation<InConfirmResponseDto, InConfirmRequestDto>({
            query: (body) => ({
                url: `/oracle/in/confirm`,
                method: "PUT",
                body
            }),
        }),
        out: builder.mutation<CallparamDto[], OutBatchRequestDto>({
            query: (body) => ({
                url: `/oracle/out`,
                method: "PUT",
                body
            }),
        }),
        outConfirm: builder.mutation<OutConfirmResponseDto, OutConfirmRequestDto>({
            query: (body) => ({
                url: `/oracle/out/confirm`,
                method: "PUT",
                body
            }),
        }),
        getAssets: builder.query<void, void>({
            query: () => `/user/resources`,
        }),
        userProfile: builder.query<UserProfileResponse, void>({
            query: () => `/user/profile`,
            providesTags: ["Profile"]
        }),
        getRecognizedAssets: builder.query<RecognizedAssetsDto[], void>({
            query: () => `/asset/recognized-assets`,
        }),
        getSkins: builder.query<SkinResponse[], void>({
            query: () => `/user/skins`,
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Skin' as const, id })), { type: 'Skin', id: "LIST" }]
                    : [{ type: 'Skin', id: "LIST" }],
        }),
        setSkin: builder.mutation<void, SkinSelectRequest>({
            query: (body) => ({
                url: "/user/skin",
                method: "PUT",
                body
            }),

            async onQueryStarted(skin, { dispatch, queryFulfilled }) {
                //optimistic update to skin selection
                const patchResult = dispatch(
                    bridgeApi.util.updateQueryData('getSkins', undefined, (draft) => {
                        for (const sk of draft) {
                            if (sk.id === skin.id) {
                                Object.assign(sk, { equipped: true })
                            } else if (sk.equipped === true) {
                                Object.assign(sk, { equipped: false })
                            }
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                    dispatch(bridgeApi.util.invalidateTags([{ type: 'Skin', id: "LIST" }]))
                }
            },
        }),
        oauthInfo: builder.query<Oauth2PublicClientDto, string>({
            query: (clientId) => ({
                url: `oauth2/client/${clientId}/public`,
                method: "GET"
            }),
        }),
        oauthAuthorize: builder.mutation<{ url: string }, URLSearchParams>({
            query: (urlSearchParams) => ({
                url: `/oauth2/authorize`,
                method: "GET",
                params: Object.fromEntries(urlSearchParams)
            }),
        }),
        activeGame: builder.query<boolean, void>({
            query: () => (`/user/inprogress`),
        }),
        customizerConfig: builder.query<CompositeConfigDto, { chainId: number | string, assetAddress: string }>({
            query: ({ chainId, assetAddress }) => (`composite/config/${chainId}/${assetAddress}`),
        }),
        getExos: builder.mutation<StandardizedOnChainToken[], string>({
            query: (address) => ({
                url: `/asset/exos/${address.toLowerCase()}`,
                method: "GET",
            }),
        }),
    }),

})


export const rtkQueryErrorFormatter = (error: any): string => {
    let strErr = ""
    if (!!error?.data?.message) {
        strErr = String(error?.data?.message)
    } else if (!!error?.data?.error) {
        strErr = String(error?.data?.error)
    } else if (!!error?.error) {
        strErr = String(error?.error)
    } else {
        strErr = String(error)
    }
    strErr = strErr.replace("BadRequestException: ", "")
    return strErr
}

export const { useMigrateInMutation, useMigrateMutation, useGetExosMutation, useCustomizerConfigQuery, useInMutation, useOutMutation, useOutConfirmMutation, useInConfirmMutation, useActiveGameQuery, useOauthInfoQuery, useOauthAuthorizeMutation, useSummonMutation, useGetInGameResourcesQuery, useMinecraftUnlinkMutation, useMinecraftLinkMutation, useMinecraftRedirectMutation, useGamerTagSetMutation, useEmailChangeMutation, useGetInGameItemsQuery, useGetRecognizedAssetsQuery, useSetSkinMutation, useEmailLoginCodeMutation, useUserProfileQuery, useEmailLoginCodeVerifyMutation, useGetSkinsQuery } = bridgeApi
