import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(process.env.REACT_APP_SUBGRAPH_EXN_URL as string)

export const api = createApi({
  reducerPath: 'generatedSubgraphExnApi',
  baseQuery: graphqlRequestBaseQuery({ client }),
  endpoints: () => ({})
})

