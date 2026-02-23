import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Workspace,
  WorkspaceOverview,
  Wallet,
  Transaction,
  TokenBalance,
  TVLDataPoint,
  PerformanceDataPoint,
  ProfitLossDataPoint,
  ProfitLossMetrics,
  PaginatedResponse,
  ApiResponse,
} from '../../types'

interface GetWorkspaceParams {
  workspaceId: string
}

interface GetTransactionsParams {
  walletAddress: string
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

interface GetChartDataParams {
  walletAddress: string
  type: 'tvl' | 'performance' | 'profit-loss'
  timeRange: string
  interval: string
}

export const workspaceApi = createApi({
  reducerPath: 'workspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
    prepareHeaders: (headers) => {
      // Add authentication headers if needed
      const token = localStorage.getItem('authToken')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Workspace', 'Wallet', 'Transactions', 'Charts'],
  endpoints: (builder) => ({
    // Workspace endpoints
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => '/workspaces',
      providesTags: ['Workspace'],
    }),
    getWorkspace: builder.query<Workspace, string>({
      query: (workspaceId) => `/workspaces/${workspaceId}`,
      providesTags: ['Workspace'],
    }),
    getWorkspaceOverview: builder.query<WorkspaceOverview, string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/overview`,
      providesTags: ['Workspace'],
    }),

    // Wallet endpoints
    getWallet: builder.query<Wallet, string>({
      query: (walletAddress) => `/wallets/${walletAddress}`,
      providesTags: ['Wallet'],
    }),
    getWalletBalances: builder.query<TokenBalance[], string>({
      query: (walletAddress) => `/wallets/${walletAddress}/balances`,
      providesTags: ['Wallet'],
    }),
    getWalletProfitLoss: builder.query<ProfitLossMetrics, string>({
      query: (walletAddress) => `/wallets/${walletAddress}/analytics/profit-loss`,
      providesTags: ['Wallet'],
    }),

    // Transaction endpoints
    getTransactions: builder.query<PaginatedResponse<Transaction>, GetTransactionsParams>({
      query: ({ walletAddress, page = 1, limit = 50, startDate, endDate }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        
        return `/wallets/${walletAddress}/transactions?${params.toString()}`
      },
      providesTags: ['Transactions'],
    }),

    // Chart data endpoints
    getTVLData: builder.query<TVLDataPoint[], GetChartDataParams>({
      query: ({ walletAddress, timeRange, interval }) => 
        `/wallets/${walletAddress}/charts/tvl?timeRange=${timeRange}&interval=${interval}`,
      providesTags: ['Charts'],
    }),
    getPerformanceData: builder.query<PerformanceDataPoint[], GetChartDataParams>({
      query: ({ walletAddress, timeRange, interval }) => 
        `/wallets/${walletAddress}/charts/performance?timeRange=${timeRange}&interval=${interval}`,
      providesTags: ['Charts'],
    }),
    getProfitLossData: builder.query<ProfitLossDataPoint[], GetChartDataParams>({
      query: ({ walletAddress, timeRange, interval }) => 
        `/wallets/${walletAddress}/charts/profit-loss?timeRange=${timeRange}&interval=${interval}`,
      providesTags: ['Charts'],
    }),

    // Project tokens management
    addProjectToken: builder.mutation<ApiResponse<TokenBalance>, { walletAddress: string; tokenAddress: string }>({
      query: ({ walletAddress, tokenAddress }) => ({
        url: `/wallets/${walletAddress}/project-tokens`,
        method: 'POST',
        body: { tokenAddress },
      }),
      invalidatesTags: ['Wallet'],
    }),
    removeProjectToken: builder.mutation<ApiResponse<void>, { walletAddress: string; tokenAddress: string }>({
      query: ({ walletAddress, tokenAddress }) => ({
        url: `/wallets/${walletAddress}/project-tokens/${tokenAddress}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wallet'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetWorkspacesQuery,
  useGetWorkspaceQuery,
  useGetWorkspaceOverviewQuery,
  useGetWalletQuery,
  useGetWalletBalancesQuery,
  useGetWalletProfitLossQuery,
  useGetTransactionsQuery,
  useGetTVLDataQuery,
  useGetPerformanceDataQuery,
  useGetProfitLossDataQuery,
  useAddProjectTokenMutation,
  useRemoveProjectTokenMutation,
} = workspaceApi