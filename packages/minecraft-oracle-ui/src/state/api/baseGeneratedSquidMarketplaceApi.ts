import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(process.env.REACT_APP_SQUID_MULTIVERSE_URL as string)

export const api = createApi({
  reducerPath: 'generatedSquidMarketplaceApi',
  baseQuery: graphqlRequestBaseQuery({ client }),
  endpoints: () => ({})
})

