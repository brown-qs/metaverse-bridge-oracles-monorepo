import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const bridgeApi = createApi({
    reducerPath: 'bridgeApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_BACKEND_API_URL}/` }),
    endpoints: (builder) => ({
        getAssets: builder.query<void, void>({
            query: () => `/user/resources`,
        }),
    }),
})

export const { useGetAssetsQuery } = bridgeApi
