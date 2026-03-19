# FRONTEND CODE

## index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ArbitrageBot Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## package.json
```json
{
  "name": "arbitragebot-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.6.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1",
    "recharts": "^2.12.4",
    "tailwindcss": "^3.3.6",
    "web-vitals": "^3.5.0",
    "ws": "^8.14.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@types/recharts": "^1.8.29",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.32",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}
```

## vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
```

## tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
```

## index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Chart container styles */
.chart-container {
  @apply w-full h-64 md:h-80 lg:h-96;
}

/* Card styles */
.card {
  @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200;
}

/* Button styles */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors;
}

/* Input styles */
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* Badge styles */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}
```

## App.tsx
```typescript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import Dashboard from './components/Dashboard'
import Workspace from './components/Workspace/Workspace'
import Overview from './components/Workspace/Overview'
import Transactions from './components/Workspace/Transactions'
import Assets from './components/Workspace/Assets'
import DataTracking from './components/Workspace/DataTracking'
import SourceCode from './components/Workspace/SourceCode'
import History from './components/Workspace/History'
import TokenStats from './components/Workspace/TokenStats'
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/Common/ErrorBoundary'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="workspace/:workspaceId" element={<Workspace />}>
                  <Route index element={<Overview />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="assets" element={<Assets />} />
                  <Route path="data-tracking" element={<DataTracking />} />
                  <Route path="source-code" element={<SourceCode />} />
                  <Route path="history" element={<History />} />
                  <Route path="token-stats" element={<TokenStats />} />
                </Route>
              </Route>
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </ErrorBoundary>
      </Router>
    </Provider>
  )
}

export default App
```

## types/index.ts
```typescript
// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Workspace types
export interface Workspace {
  id: string
  name: string
  type: 'wallet' | 'contract'
  address: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceOverview {
  workspaceId: string
  totalValueLocked: number
  totalProfit: number
  totalTransactions: number
  activeTokens: number
  lastUpdated: string
}

// Wallet types
export interface Wallet {
  address: string
  balance: string
  totalValueUsd: number
  totalProfitUsd: number
  lastUpdated: string
}

export interface TokenBalance {
  tokenAddress: string
  symbol: string
  name: string
  balance: string
  decimals: number
  priceUsd: number
  valueUsd: number
  isProjectToken: boolean
  lastUpdated: string
}

// Transaction types
export interface Transaction {
  hash: string
  type: 'arbitrage' | 'swap' | 'transfer'
  status: 'pending' | 'success' | 'failed'
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  timestamp: string
  profit?: number
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  amountOut?: string
}

// Chart data types
export interface TVLDataPoint {
  timestamp: string
  value: number
}

export interface PerformanceDataPoint {
  timestamp: string
  value: number
  percentage: number
}

export interface ProfitLossDataPoint {
  timestamp: string
  profit: number
  loss: number
  net: number
}

export interface ProfitLossMetrics {
  totalProfit: number
  totalLoss: number
  netProfit: number
  profitFactor: number
  winRate: number
  maxDrawdown: number
  lastUpdated: string
}

// Analytics types
export interface AnalyticsData {
  totalValueLocked: number
  totalProfit: number
  totalTransactions: number
  activeTokens: number
  lastUpdated: string
}

// Error types
export interface ApiError {
  message: string
  code?: string
  details?: any
}

// WebSocket types
export interface WebSocketMessage {
  type: 'update' | 'error' | 'status'
  data: any
  timestamp: string
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string
  websocketUrl: string
  defaultTimeRange: string
  defaultInterval: string
  supportedTokens: string[]
}
```

## store/store.ts
```typescript
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { workspaceApi } from './api/workspaceApi'
import workspaceSlice from './workspaceSlice'
import chartSlice from './chartSlice'
import walletSlice from './walletSlice'

export const store = configureStore({
  reducer: {
    workspace: workspaceSlice,
    charts: chartSlice,
    wallet: walletSlice,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workspaceApi.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## store/api/workspaceApi.ts
```typescript
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
```

## store/workspaceSlice.ts
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Workspace, WorkspaceOverview } from '../types'
import { workspaceApi } from './api/workspaceApi'

// Async thunks
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getWorkspaces.initiate()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchWorkspace = createAsyncThunk(
  'workspace/fetchWorkspace',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getWorkspace.initiate(workspaceId)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchWorkspaceOverview = createAsyncThunk(
  'workspace/fetchWorkspaceOverview',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getWorkspaceOverview.initiate(workspaceId)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

interface WorkspaceState {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  overview: WorkspaceOverview | null
  loading: boolean
  error: string | null
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  overview: null,
  loading: false,
  error: null,
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch workspaces
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false
        state.workspaces = action.payload || []
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch workspaces'
      })

    // Fetch workspace
    builder
      .addCase(fetchWorkspace.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkspace.fulfilled, (state, action) => {
        state.loading = false
        state.currentWorkspace = action.payload || null
      })
      .addCase(fetchWorkspace.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch workspace'
      })

    // Fetch workspace overview
    builder
      .addCase(fetchWorkspaceOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkspaceOverview.fulfilled, (state, action) => {
        state.loading = false
        state.overview = action.payload || null
      })
      .addCase(fetchWorkspaceOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch workspace overview'
      })
  },
})

export const { setCurrentWorkspace, clearError } = workspaceSlice.actions

// Selectors
export const selectWorkspaces = (state: RootState) => state.workspace.workspaces
export const selectCurrentWorkspace = (state: RootState) => state.workspace.currentWorkspace
export const selectWorkspaceOverview = (state: RootState) => state.workspace.overview
export const selectWorkspaceLoading = (state: RootState) => state.workspace.loading
export const selectWorkspaceError = (state: RootState) => state.workspace.error

export default workspaceSlice.reducer
```

## store/chartSlice.ts
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { 
  TVLDataPoint, 
  PerformanceDataPoint, 
  ProfitLossDataPoint,
  AnalyticsData 
} from '../types'
import { workspaceApi } from './api/workspaceApi'

// Async thunks
export const fetchTVLData = createAsyncThunk(
  'charts/fetchTVLData',
  async (params: { walletAddress: string; timeRange: string; interval: string }, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getTVLData.initiate(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchPerformanceData = createAsyncThunk(
  'charts/fetchPerformanceData',
  async (params: { walletAddress: string; timeRange: string; interval: string }, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getPerformanceData.initiate(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchProfitLossData = createAsyncThunk(
  'charts/fetchProfitLossData',
  async (params: { walletAddress: string; timeRange: string; interval: string }, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getProfitLossData.initiate(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchAnalyticsData = createAsyncThunk(
  'charts/fetchAnalyticsData',
  async (walletAddress: string, { rejectWithValue }) => {
    try {
      // This would be a new endpoint in the API
      const response = await fetch(`/api/wallets/${walletAddress}/analytics`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

interface ChartState {
  tvlData: TVLDataPoint[]
  performanceData: PerformanceDataPoint[]
  profitLossData: ProfitLossDataPoint[]
  analytics: AnalyticsData | null
  loading: boolean
  error: string | null
  selectedTimeRange: string
  selectedInterval: string
}

const initialState: ChartState = {
  tvlData: [],
  performanceData: [],
  profitLossData: [],
  analytics: null,
  loading: false,
  error: null,
  selectedTimeRange: '24h',
  selectedInterval: '1h',
}

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setSelectedTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload
    },
    setSelectedInterval: (state, action) => {
      state.selectedInterval = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch TVL data
    builder
      .addCase(fetchTVLData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTVLData.fulfilled, (state, action) => {
        state.loading = false
        state.tvlData = action.payload || []
      })
      .addCase(fetchTVLData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch TVL data'
      })

    // Fetch performance data
    builder
      .addCase(fetchPerformanceData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.loading = false
        state.performanceData = action.payload || []
      })
      .addCase(fetchPerformanceData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch performance data'
      })

    // Fetch profit/loss data
    builder
      .addCase(fetchProfitLossData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfitLossData.fulfilled, (state, action) => {
        state.loading = false
        state.profitLossData = action.payload || []
      })
      .addCase(fetchProfitLossData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch profit/loss data'
      })

    // Fetch analytics data
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload || null
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch analytics data'
      })
  },
})

export const { 
  setSelectedTimeRange, 
  setSelectedInterval, 
  clearError 
} = chartSlice.actions

// Selectors
export const selectTVLData = (state: RootState) => state.charts.tvlData
export const selectPerformanceData = (state: RootState) => state.charts.performanceData
export const selectProfitLossData = (state: RootState) => state.charts.profitLossData
export const selectAnalytics = (state: RootState) => state.charts.analytics
export const selectChartLoading = (state: RootState) => state.charts.loading
export const selectChartError = (state: RootState) => state.charts.error
export const selectSelectedTimeRange = (state: RootState) => state.charts.selectedTimeRange
export const selectSelectedInterval = (state: RootState) => state.charts.selectedInterval

export default chartSlice.reducer
```

## store/walletSlice.ts
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Wallet, TokenBalance, Transaction, ProfitLossMetrics, PaginatedResponse } from '../types'
import { workspaceApi } from './api/workspaceApi'

// Async thunks
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (walletAddress: string, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getWallet.initiate(walletAddress)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchWalletBalances = createAsyncThunk(
  'wallet/fetchWalletBalances',
  async (walletAddress: string, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getWalletBalances.initiate(walletAddress)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchWalletProfitLoss = createAsyncThunk(
  'wallet/fetchWalletProfitLoss',
  async (walletAddress: string, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getWalletProfitLoss.initiate(walletAddress)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (params: { walletAddress: string; page?: number; limit?: number; startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.getTransactions.initiate(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const addProjectToken = createAsyncThunk(
  'wallet/addProjectToken',
  async (params: { walletAddress: string; tokenAddress: string }, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.addProjectToken.initiate(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const removeProjectToken = createAsyncThunk(
  'wallet/removeProjectToken',
  async (params: { walletAddress: string; tokenAddress: string }, { rejectWithValue }) => {
    try {
      const response = await workspaceApi.endpoints.removeProjectToken.initiate(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

interface WalletState {
  wallet: Wallet | null
  balances: TokenBalance[]
  profitLoss: ProfitLossMetrics | null
  transactions: PaginatedResponse<Transaction> | null
  loading: boolean
  error: string | null
  selectedWalletAddress: string | null
}

const initialState: WalletState = {
  wallet: null,
  balances: [],
  profitLoss: null,
  transactions: null,
  loading: false,
  error: null,
  selectedWalletAddress: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedWalletAddress: (state, action) => {
      state.selectedWalletAddress = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearWalletData: (state) => {
      state.wallet = null
      state.balances = []
      state.profitLoss = null
      state.transactions = null
      state.selectedWalletAddress = null
    },
  },
  extraReducers: (builder) => {
    // Fetch wallet
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false
        state.wallet = action.payload || null
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch wallet'
      })

    // Fetch wallet balances
    builder
      .addCase(fetchWalletBalances.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletBalances.fulfilled, (state, action) => {
        state.loading = false
        state.balances = action.payload || []
      })
      .addCase(fetchWalletBalances.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch wallet balances'
      })

    // Fetch wallet profit/loss
    builder
      .addCase(fetchWalletProfitLoss.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletProfitLoss.fulfilled, (state, action) => {
        state.loading = false
        state.profitLoss = action.payload || null
      })
      .addCase(fetchWalletProfitLoss.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch wallet profit/loss'
      })

    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload || null
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch transactions'
      })

    // Add project token
    builder
      .addCase(addProjectToken.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload.data) {
          const newToken = action.payload.data
          const existingIndex = state.balances.findIndex(
            balance => balance.tokenAddress === newToken.tokenAddress
          )
          if (existingIndex >= 0) {
            state.balances[existingIndex] = { ...newToken, isProjectToken: true }
          } else {
            state.balances.push({ ...newToken, isProjectToken: true })
          }
        }
      })
      .addCase(addProjectToken.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add project token'
      })

    // Remove project token
    builder
      .addCase(removeProjectToken.fulfilled, (state, action) => {
        if (action.payload?.success) {
          const { tokenAddress } = action.meta.arg
          state.balances = state.balances.map(balance =>
            balance.tokenAddress === tokenAddress
              ? { ...balance, isProjectToken: false }
              : balance
          )
        }
      })
      .addCase(removeProjectToken.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove project token'
      })
  },
})

export const { 
  setSelectedWalletAddress, 
  clearError, 
  clearWalletData 
} = walletSlice.actions

// Selectors
export const selectWallet = (state: RootState) => state.wallet.wallet
export const selectWalletBalances = (state: RootState) => state.wallet.balances
export const selectWalletProfitLoss = (state: RootState) => state.wallet.profitLoss
export const selectTransactions = (state: RootState) => state.wallet.transactions
export const selectWalletLoading = (state: RootState) => state.wallet.loading
export const selectWalletError = (state: RootState) => state.wallet.error
export const selectSelectedWalletAddress = (state: RootState) => state.wallet.selectedWalletAddress
export const selectProjectTokens = (state: RootState) => 
  state.wallet.balances.filter(balance => balance.isProjectToken)

export default walletSlice.reducer
```

## hooks/useAppSelector.ts
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

## components/Dashboard.tsx
```typescript
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Workspace } from '../types'

const Dashboard: React.FC = () => {
  const { workspaces, loading } = useSelector((state: RootState) => state.workspace)

  const mockWorkspaces: Workspace[] = [
    {
      id: 'wallet-1',
      name: 'Main Wallet',
      type: 'wallet',
      address: '0x742d35Cc6634C0532925a3b8D',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T15:45:00Z',
    },
    {
      id: 'contract-1',
      name: 'Arbitrage Contract',
      type: 'contract',
      address: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      createdAt: '2024-01-10T08:15:00Z',
      updatedAt: '2024-01-19T12:30:00Z',
    },
  ]

  const currentWorkspaces = workspaces.length > 0 ? workspaces : mockWorkspaces

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your arbitrage operations and workspace performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Refresh Data
          </button>
          <button className="btn-primary">
            Add Workspace
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total TVL</p>
              <p className="text-2xl font-bold text-gray-900">$45,230.50</p>
              <p className="text-xs text-green-600 mt-1">+12.5% (24h)</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">💰</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">$2,150.75</p>
              <p className="text-xs text-green-600 mt-1">+8.3% (24h)</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">📈</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workspaces</p>
              <p className="text-2xl font-bold text-gray-900">{currentWorkspaces.length}</p>
              <p className="text-xs text-gray-600 mt-1">Real-time monitoring</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspaces Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentWorkspaces.map((workspace) => (
            <Link
              key={workspace.id}
              to={`/workspace/${workspace.id}`}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    workspace.type === 'wallet' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    <span className="text-lg">
                      {workspace.type === 'wallet' ? '💼' : '🏗️'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {workspace.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {workspace.address}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  workspace.type === 'wallet' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {workspace.type === 'wallet' ? 'Wallet' : 'Contract'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(workspace.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">View Details</span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="font-medium">Arbitrage Opportunity Found</p>
                <p className="text-sm text-gray-500">WETH/DAI pair - Profit: 0.015 ETH</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📊</span>
              </div>
              <div>
                <p className="font-medium">TVL Update</p>
                <p className="text-sm text-gray-500">Total Value Locked: $45,230.50</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">15 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🔄</span>
              </div>
              <div>
                <p className="font-medium">Contract Deployment</p>
                <p className="text-sm text-gray-500">New arbitrage contract deployed</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

## components/Layout/Layout.tsx
```typescript
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)

  // Show sidebar only when we have a current workspace and are in a workspace route
  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')
  const showSidebar = isWorkspaceRoute && currentWorkspace

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {showSidebar && (
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
```

## components/Layout/Header.tsx
```typescript
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { currentWorkspace } from '../../store/workspaceSlice'

const Header: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)

  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AB</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ArbitrageBot</h1>
                {isWorkspaceRoute && currentWorkspace && (
                  <p className="text-sm text-gray-500">{currentWorkspace.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            {isWorkspaceRoute && (
              <>
                <Link
                  to={`/workspace/${currentWorkspace?.id}/overview`}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Overview
                </Link>
                <Link
                  to={`/workspace/${currentWorkspace?.id}/transactions`}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Transactions
                </Link>
                <Link
                  to={`/workspace/${currentWorkspace?.id}/assets`}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Assets
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="btn-secondary text-sm">
              Settings
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
```

## components/Layout/Sidebar.tsx
```typescript
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)

  const navigation = [
    { name: 'Overview', href: 'overview', icon: '📊' },
    { name: 'Transactions', href: 'transactions', icon: '🔄' },
    { name: 'Assets', href: 'assets', icon: '💼' },
    { name: 'Data Tracking', href: 'data-tracking', icon: '📈' },
    { name: 'Source Code', href: 'source-code', icon: '💻' },
    { name: 'History', href: 'history', icon: '📜' },
    { name: 'Token Stats', href: 'token-stats', icon: '🪙' },
  ]

  if (!currentWorkspace) {
    return null
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{currentWorkspace.name}</h2>
        <p className="text-sm text-gray-500 mt-1 truncate">{currentWorkspace.address}</p>
        <div className="mt-2 flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            currentWorkspace.type === 'wallet' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {currentWorkspace.type === 'wallet' ? 'Wallet' : 'Contract'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname.endsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
```

## components/Common/ErrorBoundary.tsx
```typescript
import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
              <p className="mt-2 text-sm text-gray-600">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-primary"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="w-full btn-secondary"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Error Details:</h4>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

## components/Common/LoadingSpinner.tsx
```typescript
import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
        role="status"
        aria-label="loading"
      />
      {text && (
        <span className="ml-3 text-sm text-gray-600">{text}</span>
      )}
    </div>
  )
}

export default LoadingSpinner
```

## components/Workspace/Workspace.tsx
```typescript
import React, { useEffect } from 'react'
import { useParams, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchWorkspace, fetchWorkspaceOverview } from '../../store/workspaceSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const Workspace: React.FC = () => {
  const { workspaceId } = useParams()
  const dispatch = useDispatch()
  const { currentWorkspace, overview, loading, error } = useSelector((state: RootState) => state.workspace)

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchWorkspace(workspaceId))
      dispatch(fetchWorkspaceOverview(workspaceId))
    }
  }, [workspaceId, dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading workspace..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Workspace</h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!currentWorkspace) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900">Workspace Not Found</h3>
          <p className="text-gray-600 mt-2">The workspace you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                currentWorkspace.type === 'wallet' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                <span className="text-2xl">
                  {currentWorkspace.type === 'wallet' ? '💼' : '🏗️'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentWorkspace.name}</h1>
                <p className="text-gray-600">{currentWorkspace.address}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    currentWorkspace.type === 'wallet' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {currentWorkspace.type === 'wallet' ? 'Wallet' : 'Contract'}
                  </span>
                  {overview && (
                    <span className="text-sm text-gray-500">
                      Last updated: {new Date(overview.lastUpdated).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary">Refresh</button>
              <button className="btn-primary">Settings</button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value Locked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${overview.totalValueLocked.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">💰</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${overview.totalProfit.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">📈</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.totalTransactions.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">🔄</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.activeTokens}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600">🪙</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="card">
          <Outlet />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Workspace
```

## components/Workspace/Overview.tsx
```typescript
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchWorkspaceOverview } from '../../store/workspaceSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectTVLData, selectPerformanceData, selectProfitLossData } from '../../store/chartSlice'
import { fetchTVLData, fetchPerformanceData, fetchProfitLossData } from '../../store/chartSlice'
import TVLChart from '../Charts/TVLChart'
import ProfitLossChart from '../Charts/ProfitLossChart'
import LoadingSpinner from '../Common/LoadingSpinner'

const Overview: React.FC = () => {
  const dispatch = useDispatch()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const tvlData = useAppSelector(selectTVLData)
  const performanceData = useAppSelector(selectPerformanceData)
  const profitLossData = useAppSelector(selectProfitLossData)
  const selectedTimeRange = useAppSelector(state => state.charts.selectedTimeRange)
  const selectedInterval = useAppSelector(state => state.charts.selectedInterval)

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchWorkspaceOverview(currentWorkspace.id))
      dispatch(fetchTVLData({
        walletAddress: currentWorkspace.address,
        timeRange: selectedTimeRange,
        interval: selectedInterval
      }))
      dispatch(fetchPerformanceData({
        walletAddress: currentWorkspace.address,
        timeRange: selectedTimeRange,
        interval: selectedInterval
      }))
      dispatch(fetchProfitLossData({
        walletAddress: currentWorkspace.address,
        timeRange: selectedTimeRange,
        interval: selectedInterval
      }))
    }
  }, [currentWorkspace, dispatch, selectedTimeRange, selectedInterval])

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view overview.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Value Locked (TVL)</h3>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">24h</button>
              <button className="btn-secondary text-sm">7d</button>
              <button className="btn-secondary text-sm">30d</button>
            </div>
          </div>
          <div className="chart-container">
            {tvlData.length > 0 ? (
              <TVLChart data={tvlData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner text="Loading TVL data..." />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profit & Loss</h3>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">24h</button>
              <button className="btn-secondary text-sm">7d</button>
              <button className="btn-secondary text-sm">30d</button>
            </div>
          </div>
          <div className="chart-container">
            {profitLossData.length > 0 ? (
              <ProfitLossChart data={profitLossData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner text="Loading profit/loss data..." />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Total Profit</p>
                <p className="text-2xl font-bold text-green-900">$2,150.75</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📈</span>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12.5% (24h)</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Win Rate</p>
                <p className="text-2xl font-bold text-blue-900">78%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">🎯</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">Above average</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Max Drawdown</p>
                <p className="text-2xl font-bold text-purple-900">-15.2%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">📉</span>
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">Within risk limits</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="font-medium">Successful Arbitrage</p>
                <p className="text-sm text-gray-500">WETH/DAI pair - Profit: 0.015 ETH</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📊</span>
              </div>
              <div>
                <p className="font-medium">TVL Update</p>
                <p className="text-sm text-gray-500">Total Value Locked: $45,230.50</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">15 min ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
```

## components/Workspace/Transactions.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchTransactions } from '../../store/walletSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectTransactions } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const Transactions: React.FC = () => {
  const dispatch = useDispatch()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const transactions = useAppSelector(selectTransactions)
  const loading = useAppSelector(state => state.wallet.loading)
  const error = useAppSelector(state => state.wallet.error)

  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchTransactions({
        walletAddress: currentWorkspace.address,
        page,
        limit,
        startDate,
        endDate
      }))
    }
  }, [currentWorkspace, dispatch, page, limit, startDate, endDate])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleFilter = () => {
    setPage(1)
    // Trigger fetch with new filters
    if (currentWorkspace) {
      dispatch(fetchTransactions({
        walletAddress: currentWorkspace.address,
        page: 1,
        limit,
        startDate,
        endDate
      }))
    }
  }

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view transactions.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="btn-primary"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <div className="text-sm text-gray-600">
              Showing {transactions?.pagination?.page || 1} of {transactions?.pagination?.totalPages || 1}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Loading transactions..." />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : transactions?.data && transactions.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hash
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.data.map((transaction) => (
                    <tr key={transaction.hash} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {transaction.hash.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`badge ${
                          transaction.type === 'arbitrage' ? 'badge-info' :
                          transaction.type === 'swap' ? 'badge-warning' :
                          'badge-secondary'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`badge ${
                          transaction.status === 'success' ? 'badge-success' :
                          transaction.status === 'failed' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amountOut ? `${transaction.amountOut} ${transaction.tokenOut}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.profit ? `$${transaction.profit.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found.
            </div>
          )}

          {/* Pagination */}
          {transactions && transactions.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {((transactions.pagination.page - 1) * limit) + 1} to{' '}
                {Math.min(transactions.pagination.page * limit, transactions.pagination.total)} of{' '}
                {transactions.pagination.total} transactions
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= transactions.pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Transactions
```

## components/Workspace/Assets.tsx
```typescript
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchWalletBalances, addProjectToken, removeProjectToken } from '../../store/walletSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectWalletBalances, selectProjectTokens } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const Assets: React.FC = () => {
  const dispatch = useDispatch()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const balances = useAppSelector(selectWalletBalances)
  const projectTokens = useAppSelector(selectProjectTokens)
  const loading = useAppSelector(state => state.wallet.loading)
  const error = useAppSelector(state => state.wallet.error)

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('value')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchWalletBalances(currentWorkspace.address))
    }
  }, [currentWorkspace, dispatch])

  const handleAddProjectToken = (tokenAddress: string) => {
    if (currentWorkspace) {
      dispatch(addProjectToken({
        walletAddress: currentWorkspace.address,
        tokenAddress
      }))
    }
  }

  const handleRemoveProjectToken = (tokenAddress: string) => {
    if (currentWorkspace) {
      dispatch(removeProjectToken({
        walletAddress: currentWorkspace.address,
        tokenAddress
      }))
    }
  }

  const filteredBalances = balances.filter(balance =>
    balance.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    balance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    balance.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedBalances = [...filteredBalances].sort((a, b) => {
    let aValue: number, bValue: number

    switch (sortBy) {
      case 'value':
        aValue = a.valueUsd
        bValue = b.valueUsd
        break
      case 'balance':
        aValue = parseFloat(a.balance)
        bValue = parseFloat(b.balance)
        break
      case 'symbol':
        aValue = a.symbol.localeCompare(b.symbol)
        bValue = 0
        return sortOrder === 'asc' ? aValue : -aValue
      default:
        return 0
    }

    if (aValue === bValue) return 0
    return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1)
  })

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view assets.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Tokens
              </label>
              <input
                type="text"
                placeholder="Search by symbol, name, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex space-x-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="value">Value (USD)</option>
                  <option value="balance">Balance</option>
                  <option value="symbol">Symbol</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="input"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${balances.reduce((total, balance) => total + balance.valueUsd, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">💼</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{balances.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">🪙</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Project Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{projectTokens.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Token Balances</h3>
            <div className="text-sm text-gray-600">
              {filteredBalances.length} tokens found
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Loading token balances..." />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : sortedBalances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value (USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBalances.map((balance) => (
                    <tr key={balance.tokenAddress} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {balance.symbol.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {balance.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {balance.symbol}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                              {balance.tokenAddress}
                            </div>
                          </div>
                          {balance.isProjectToken && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Project Token
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {parseFloat(balance.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${balance.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={balance.valueUsd > 0 ? 'text-green-600' : 'text-gray-900'}>
                          ${balance.valueUsd.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {balance.isProjectToken ? (
                          <button
                            onClick={() => handleRemoveProjectToken(balance.tokenAddress)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove from Project
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddProjectToken(balance.tokenAddress)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Add to Project
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tokens found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Assets
```

## components/Workspace/DataTracking.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchWalletProfitLoss } from '../../store/walletSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectWalletProfitLoss } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const DataTracking: React.FC = () => {
  const dispatch = useDispatch()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const profitLoss = useAppSelector(selectWalletProfitLoss)
  const loading = useAppSelector(state => state.wallet.loading)
  const error = useAppSelector(state => state.wallet.error)

  const [timeRange, setTimeRange] = useState('24h')
  const [metrics, setMetrics] = useState({
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0,
    profitFactor: 0,
    winRate: 0,
    maxDrawdown: 0,
  })

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchWalletProfitLoss(currentWorkspace.address))
    }
  }, [currentWorkspace, dispatch])

  useEffect(() => {
    if (profitLoss) {
      setMetrics({
        totalProfit: profitLoss.totalProfit,
        totalLoss: profitLoss.totalLoss,
        netProfit: profitLoss.netProfit,
        profitFactor: profitLoss.profitFactor,
        winRate: profitLoss.winRate,
        maxDrawdown: profitLoss.maxDrawdown,
      })
    }
  }, [profitLoss])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    // In a real implementation, this would trigger a new API call with the time range
  }

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view data tracking.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Data Tracking & Analytics</h3>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`btn-secondary text-sm ${
                    timeRange === range ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  ${metrics.totalProfit.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📈</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Total profit from successful arbitrage operations
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loss</p>
                <p className="text-2xl font-bold text-red-600">
                  ${metrics.totalLoss.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600">📉</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Total loss from failed arbitrage operations
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${metrics.netProfit.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">💰</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Net profit after accounting for all losses
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Factor</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.profitFactor.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">📊</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Ratio of gross profit to gross loss
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {(metrics.winRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">🎯</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Percentage of successful arbitrage operations
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.maxDrawdown.toFixed(2)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600">⚠️</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Maximum observed loss from a peak to a trough
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Profit</span>
                <span className="font-semibold text-green-600">
                  +${metrics.totalProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Loss</span>
                <span className="font-semibold text-red-600">
                  -${metrics.totalLoss.toLocaleString()}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Net Result</span>
                <span className={`font-bold ${
                  metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.netProfit >= 0 ? '+' : ''}${metrics.netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Risk-Reward Ratio</span>
                <span className="font-semibold">
                  {(metrics.profitFactor).toFixed(2)}:1
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">
                  {(metrics.winRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maximum Drawdown</span>
                <span className="font-semibold text-orange-600">
                  {metrics.maxDrawdown.toFixed(2)}%
                </span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Analysis:</strong> Your arbitrage strategy shows{' '}
                  {metrics.winRate > 0.5 ? 'strong performance' : 'room for improvement'}{' '}
                  with a win rate of {(metrics.winRate * 100).toFixed(1)}% and a profit factor of{' '}
                  {metrics.profitFactor.toFixed(2)}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {profitLoss && (
          <div className="card">
            <div className="text-sm text-gray-500 text-center">
              Last updated: {new Date(profitLoss.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default DataTracking
```

## components/Workspace/SourceCode.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const SourceCode: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  
  const [contractCode, setContractCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching contract source code
    const fetchContractCode = async () => {
      try {
        setLoading(true)
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock contract code
        const mockCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ArbitrageBot {
    using SafeMath for uint256;
    
    address public owner;
    IERC20 public token;
    uint256 public minProfit;
    
    struct ArbitrageOpportunity {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        uint256 deadline;
    }
    
    event ArbitrageExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 profit
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor(address _token, uint256 _minProfit) {
        owner = msg.sender;
        token = IERC20(_token);
        minProfit = _minProfit;
    }
    
    function executeArbitrage(ArbitrageOpportunity calldata opportunity) external onlyOwner {
        require(block.timestamp <= opportunity.deadline, "Deadline passed");
        
        // Implementation would go here
        // This is a simplified example
    }
    
    function updateMinProfit(uint256 _minProfit) external onlyOwner {
        minProfit = _minProfit;
    }
    
    function withdrawTokens(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner, _amount);
    }
}`
        
        setContractCode(mockCode)
      } catch (err) {
        setError('Failed to load contract source code')
      } finally {
        setLoading(false)
      }
    }

    if (currentWorkspace) {
      fetchContractCode()
    }
  }, [currentWorkspace])

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view source code.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contract Source Code</h3>
              <p className="text-sm text-gray-600 mt-1">
                Solidity source code for the arbitrage contract
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary text-sm">
                Download
              </button>
              <button className="btn-primary text-sm">
                Verify Contract
              </button>
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contract Address</p>
                <p className="text-sm font-mono text-gray-900 mt-1">
                  {currentWorkspace.address}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">🏗️</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solidity Version</p>
                <p className="text-sm text-gray-900 mt-1">^0.8.0</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📝</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verification Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Source Code */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Source Code</h3>
            <div className="text-sm text-gray-500">
              {contractCode.split('\n').length} lines of code
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Loading source code..." />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-400 font-mono">ArbitrageBot.sol</span>
              </div>
              <div className="p-4">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {contractCode}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Security Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Reentrancy</p>
                  <p className="text-xs text-green-600">Protected</p>
                </div>
                <span className="text-green-600">✅</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Overflow/Underflow</p>
                  <p className="text-xs text-green-600">SafeMath used</p>
                </div>
                <span className="text-green-600">✅</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Gas Optimization</p>
                  <p className="text-xs text-yellow-600">Review recommended</p>
                </div>
                <span className="text-yellow-600">⚠️</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Access Control</p>
                  <p className="text-xs text-green-600">Owner only functions</p>
                </div>
                <span className="text-green-600">✅</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">External Calls</p>
                  <p className="text-xs text-blue-600">Limited to verified contracts</p>
                </div>
                <span className="text-blue-600">ℹ️</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Audit Status</p>
                  <p className="text-xs text-green-600">No critical issues</p>
                </div>
                <span className="text-green-600">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default SourceCode
```

## components/Workspace/History.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchTransactions } from '../../store/walletSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectTransactions } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const History: React.FC = () => {
  const dispatch = useDispatch()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const transactions = useAppSelector(selectTransactions)
  const loading = useAppSelector(state => state.wallet.loading)
  const error = useAppSelector(state => state.wallet.error)

  const [page, setPage] = useState(1)
  const [limit] = useState(50)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchTransactions({
        walletAddress: currentWorkspace.address,
        page,
        limit,
        startDate: dateRange.start,
        endDate: dateRange.end
      }))
    }
  }, [currentWorkspace, dispatch, page, limit, dateRange])

  const handleFilter = () => {
    setPage(1)
    if (currentWorkspace) {
      dispatch(fetchTransactions({
        walletAddress: currentWorkspace.address,
        page: 1,
        limit,
        startDate: dateRange.start,
        endDate: dateRange.end
      }))
    }
  }

  const filteredTransactions = transactions?.data?.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type === filterType
    const statusMatch = filterStatus === 'all' || transaction.status === filterStatus
    return typeMatch && statusMatch
  }) || []

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'arbitrage': return 'bg-blue-100 text-blue-800'
      case 'swap': return 'bg-green-100 text-green-800'
      case 'transfer': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view transaction history.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="arbitrage">Arbitrage</option>
                <option value="swap">Swap</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="input"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleFilter}
              className="btn-primary"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setFilterType('all')
                setFilterStatus('all')
                setDateRange({ start: '', end: '' })
                setPage(1)
                if (currentWorkspace) {
                  dispatch(fetchTransactions({
                    walletAddress: currentWorkspace.address,
                    page: 1,
                    limit,
                    startDate: '',
                    endDate: ''
                  }))
                }
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions?.pagination?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">📊</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions?.data?.filter(t => t.status === 'success').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions?.data?.filter(t => t.status === 'failed').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600">❌</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {transactions?.data?.length > 0 
                    ? Math.round((transactions.data.filter(t => t.status === 'success').length / transactions.data.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {transactions?.pagination?.total || 0} transactions
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Loading transaction history..." />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.hash} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === 'arbitrage' ? 'Arbitrage Opportunity' : 
                           transaction.type === 'swap' ? 'Token Swap' : 'Token Transfer'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Hash: {transaction.hash.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                      {transaction.profit && (
                        <p className="text-sm text-green-600 font-semibold">
                          +${transaction.profit.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">From:</span>
                      <span className="ml-2 font-mono text-xs text-gray-900 truncate block">
                        {transaction.from}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">To:</span>
                      <span className="ml-2 font-mono text-xs text-gray-900 truncate block">
                        {transaction.to}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 text-gray-900">
                        {transaction.amountIn ? `${transaction.amountIn} ${transaction.tokenIn}` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {transaction.gasUsed && (
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Gas Used: {transaction.gasUsed}</span>
                      <span>Gas Price: {transaction.gasPrice}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          {transactions && transactions.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {((transactions.pagination.page - 1) * limit) + 1} to{' '}
                {Math.min(transactions.pagination.page * limit, transactions.pagination.total)} of{' '}
                {transactions.pagination.total} transactions
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= transactions.pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default History
```

## components/Workspace/TokenStats.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchWalletBalances } from '../../store/walletSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectWalletBalances } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const TokenStats: React.FC = () => {
  const dispatch = useDispatch()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const balances = useAppSelector(selectWalletBalances)
  const loading = useAppSelector(state => state.wallet.loading)
  const error = useAppSelector(state => state.wallet.error)

  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchWalletBalances(currentWorkspace.address))
    }
  }, [currentWorkspace, dispatch])

  const selectedTokenData = balances.find(b => b.tokenAddress === selectedToken)

  const getTopTokens = () => {
    return balances
      .sort((a, b) => b.valueUsd - a.valueUsd)
      .slice(0, 10)
  }

  const getLargestMovements = () => {
    // Mock data for token movements
    return [
      { token: 'ETH', change: 12.5, type: 'positive' },
      { token: 'USDC', change: -3.2, type: 'negative' },
      { token: 'DAI', change: 8.7, type: 'positive' },
      { token: 'USDT', change: -1.1, type: 'negative' },
      { token: 'WBTC', change: 15.3, type: 'positive' },
    ]
  }

  const getDistributionData = () => {
    const totalValue = balances.reduce((sum, balance) => sum + balance.valueUsd, 0)
    return balances.map(balance => ({
      ...balance,
      percentage: totalValue > 0 ? (balance.valueUsd / totalValue) * 100 : 0
    })).sort((a, b) => b.percentage - a.percentage)
  }

  if (!currentWorkspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a workspace to view token statistics.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Token Statistics & Analytics</h3>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`btn-secondary text-sm ${
                    timeRange === range ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Tokens by Value */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Tokens by Value</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Loading token data..." />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : getTopTokens().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value (USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Portfolio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getTopTokens().map((token, index) => {
                    const percentage = (token.valueUsd / balances.reduce((sum, b) => sum + b.valueUsd, 0)) * 100
                    return (
                      <tr 
                        key={token.tokenAddress} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedToken(selectedToken === token.tokenAddress ? null : token.tokenAddress)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {token.symbol.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {token.name}
                              </div>
                              <div className="text-sm text-gray-500">{token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${token.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="text-green-600">
                            ${token.valueUsd.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage.toFixed(2)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No token data available.
            </div>
          )}
        </div>

        {/* Token Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
            {getDistributionData().length > 0 ? (
              <div className="space-y-3">
                {getDistributionData().map((token) => (
                  <div key={token.tokenAddress} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{token.symbol}</div>
                        <div className="text-xs text-gray-500">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {token.percentage.toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        ${token.valueUsd.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No distribution data available.
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Largest Token Movements</h3>
            <div className="space-y-3">
              {getLargestMovements().map((movement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{movement.token}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{movement.token}</div>
                      <div className="text-xs text-gray-500">Token Movement</div>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    movement.type === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.type === 'positive' ? '+' : ''}{movement.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Token Details */}
        {selectedToken && selectedTokenData && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTokenData.name} ({selectedTokenData.symbol}) Details
              </h3>
              <button
                onClick={() => setSelectedToken(null)}
                className="btn-secondary text-sm"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Current Balance</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {parseFloat(selectedTokenData.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">{selectedTokenData.symbol.charAt(0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Current Price</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${selectedTokenData.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">$</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Total Value</p>
                    <p className="text-2xl font-bold text-purple-900">
                      ${selectedTokenData.valueUsd.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">💰</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Token Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Token Address:</span>
                    <span className="font-mono text-xs">{selectedTokenData.tokenAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decimals:</span>
                    <span>{selectedTokenData.decimals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Is Project Token:</span>
                    <span>{selectedTokenData.isProjectToken ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{new Date(selectedTokenData.lastUpdated).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Portfolio Impact</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Portfolio Percentage:</span>
                    <span className="font-semibold">
                      {((selectedTokenData.valueUsd / balances.reduce((sum, b) => sum + b.valueUsd, 0)) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank in Portfolio:</span>
                    <span className="font-semibold">
                      #{getTopTokens().findIndex(t => t.tokenAddress === selectedToken) + 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Range:</span>
                    <span className="font-semibold">{timeRange}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default TokenStats
```

## components/Charts/TVLChart.tsx
```typescript
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { TVLDataPoint } from '../../types'

interface TVLChartProps {
  data: TVLDataPoint[]
}

const TVLChart: React.FC<TVLChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp).toLocaleDateString(),
    formattedValue: point.value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    })
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-green-600">
            TVL: {payload[0].value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            })}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => 
            `$${(value / 1000000).toFixed(0)}M`
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="value"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#059669"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: '#059669', strokeWidth: 2, fill: '#ffffff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default TVLChart
```

## components/Charts/ProfitLossChart.tsx
```typescript
import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Cell,
} from 'recharts'
import { ProfitLossDataPoint } from '../../types'

interface ProfitLossChartProps {
  data: ProfitLossDataPoint[]
}

const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp).toLocaleDateString(),
    formattedProfit: point.profit.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }),
    formattedLoss: point.loss.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }),
    formattedNet: point.net.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    })
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              })}
            </p>
          ))}
        </div>
      ))
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => 
            `$${(value / 1000).toFixed(0)}K`
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {/* Profit Bars */}
        <Bar
          dataKey="profit"
          fill="#10b981"
          name="Profit"
          radius={[4, 4, 0, 0]}
        />
        
        {/* Loss Bars */}
        <Bar
          dataKey="loss"
          fill="#ef4444"
          name="Loss"
          radius={[4, 4, 0, 0]}
        />
        
        {/* Net Line */}
        <Line
          type="monotone"
          dataKey="net"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
          name="Net"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ProfitLossChart
```

## mocks/handlers.ts
```typescript
import { rest } from 'msw'

// Mock API handlers for development/testing
export const handlers = [
  // Workspace endpoints
  rest.get('/api/workspaces', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 'wallet-1',
          name: 'Main Wallet',
          type: 'wallet',
          address: '0x742d35Cc6634C0532925a3b8D',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T15:45:00Z',
        },
        {
          id: 'contract-1',
          name: 'Arbitrage Contract',
          type: 'contract',
          address: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
          createdAt: '2024-01-10T08:15:00Z',
          updatedAt: '2024-01-19T12:30:00Z',
        },
      ])
    )
  }),

  rest.get('/api/workspaces/:workspaceId', (req, res, ctx) => {
    const { workspaceId } = req.params
    return res(
      ctx.json({
        id: workspaceId,
        name: 'Main Wallet',
        type: 'wallet',
        address: '0x742d35Cc6634C0532925a3b8D',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T15:45:00Z',
      })
    )
  }),

  rest.get('/api/workspaces/:workspaceId/overview', (req, res, ctx) => {
    return res(
      ctx.json({
        workspaceId: req.params.workspaceId as string,
        totalValueLocked: 45230.50,
        totalProfit: 2150.75,
        totalTransactions: 156,
        activeTokens: 12,
        lastUpdated: new Date().toISOString(),
      })
    )
  }),

  // Wallet endpoints
  rest.get('/api/wallets/:walletAddress', (req, res, ctx) => {
    return res(
      ctx.json({
        address: req.params.walletAddress as string,
        balance: '10.5',
        totalValueUsd: 45230.50,
        totalProfitUsd: 2150.75,
        lastUpdated: new Date().toISOString(),
      })
    )
  }),

  rest.get('/api/wallets/:walletAddress/balances', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          tokenAddress: '0x742d35Cc6634C0532925a3b8D',
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '10.5',
          decimals: 18,
          priceUsd: 3200.50,
          valueUsd: 33605.25,
          isProjectToken: true,
          lastUpdated: new Date().toISOString(),
        },
        {
          tokenAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
          symbol: 'DAI',
          name: 'Dai Stablecoin',
          balance: '11625.25',
          decimals: 18,
          priceUsd: 1.00,
          valueUsd: 11625.25,
          isProjectToken: false,
          lastUpdated: new Date().toISOString(),
        },
      ])
    )
  }),

  rest.get('/api/wallets/:walletAddress/analytics/profit-loss', (req, res, ctx) => {
    return res(
      ctx.json({
        totalProfit: 2150.75,
        totalLoss: 320.50,
        netProfit: 1830.25,
        profitFactor: 6.71,
        winRate: 0.78,
        maxDrawdown: 15.2,
        lastUpdated: new Date().toISOString(),
      })
    )
  }),

  // Transaction endpoints
  rest.get('/api/wallets/:walletAddress/transactions', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1')
    const limit = parseInt(req.url.searchParams.get('limit') || '20')
    
    const mockTransactions = Array.from({ length: 100 }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      type: i % 3 === 0 ? 'arbitrage' : i % 3 === 1 ? 'swap' : 'transfer',
      status: i % 4 === 0 ? 'failed' : 'success',
      from: '0x742d35Cc6634C0532925a3b8D',
      to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      value: '1.5',
      gasUsed: '21000',
      gasPrice: '20',
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      profit: Math.random() * 100,
      tokenIn: 'ETH',
      tokenOut: 'DAI',
      amountIn: '1.0',
      amountOut: '3200.0',
    }))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = mockTransactions.slice(startIndex, endIndex)

    return res(
      ctx.json({
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: mockTransactions.length,
          totalPages: Math.ceil(mockTransactions.length / limit),
        },
      })
    )
  }),

  // Chart data endpoints
  rest.get('/api/wallets/:walletAddress/charts/tvl', (req, res, ctx) => {
    const timeRange = req.url.searchParams.get('timeRange') || '24h'
    const interval = req.url.searchParams.get('interval') || '1h'
    
    const now = new Date()
    const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30
    
    const tvlData = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date(now.getTime() - (dataPoints - i) * 60 * 60 * 1000)
      return {
        timestamp: date.toISOString(),
        value: 45000 + Math.random() * 1000,
      }
    })

    return res(ctx.json(tvlData))
  }),

  rest.get('/api/wallets/:walletAddress/charts/performance', (req, res, ctx) => {
    const timeRange = req.url.searchParams.get('timeRange') || '24h'
    const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30
    
    const now = new Date()
    const performanceData = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date(now.getTime() - (dataPoints - i) * 60 * 60 * 1000)
      const baseValue = 100
      const randomChange = (Math.random() - 0.5) * 10
      return {
        timestamp: date.toISOString(),
        value: baseValue + randomChange,
        percentage: randomChange,
      }
    })

    return res(ctx.json(performanceData))
  }),

  rest.get('/api/wallets/:walletAddress/charts/profit-loss', (req, res, ctx) => {
    const timeRange = req.url.searchParams.get('timeRange') || '24h'
    const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30
    
    const now = new Date()
    const profitLossData = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date(now.getTime() - (dataPoints - i) * 60 * 60 * 1000)
      return {
        timestamp: date.toISOString(),
        profit: Math.random() * 100,
        loss: Math.random() * 50,
        net: Math.random() * 50,
      }
    })

    return res(ctx.json(profitLossData))
  }),

  // Project tokens endpoints
  rest.post('/api/wallets/:walletAddress/project-tokens', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          tokenAddress: '0x742d35Cc6634C0532925a3b8D',
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '10.5',
          decimals: 18,
          priceUsd: 3200.50,
          valueUsd: 33605.25,
          isProjectToken: true,
          lastUpdated: new Date().toISOString(),
        },
      })
    )
  }),

  rest.delete('/api/wallets/:walletAddress/project-tokens/:tokenAddress', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
      })
    )
  }),
]