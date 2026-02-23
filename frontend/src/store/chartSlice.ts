import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { 
  TVLDataPoint, 
  PerformanceDataPoint, 
  ProfitLossDataPoint,
  ChartConfig 
} from '../types'

interface ChartState {
  tvlData: TVLDataPoint[]
  performanceData: PerformanceDataPoint[]
  profitLossData: ProfitLossDataPoint[]
  config: ChartConfig
  loading: boolean
  error: string | null
}

const initialState: ChartState = {
  tvlData: [],
  performanceData: [],
  profitLossData: [],
  config: {
    timeRange: '24h',
    interval: '1h',
    showGrid: true,
    showLegend: true,
    animationDuration: 500,
  },
  loading: false,
  error: null,
}

export const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setTVLData: (state, action: PayloadAction<TVLDataPoint[]>) => {
      state.tvlData = action.payload
      state.loading = false
      state.error = null
    },
    setPerformanceData: (state, action: PayloadAction<PerformanceDataPoint[]>) => {
      state.performanceData = action.payload
      state.loading = false
      state.error = null
    },
    setProfitLossData: (state, action: PayloadAction<ProfitLossDataPoint[]>) => {
      state.profitLossData = action.payload
      state.loading = false
      state.error = null
    },
    setChartConfig: (state, action: PayloadAction<Partial<ChartConfig>>) => {
      state.config = { ...state.config, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
    addTVLDataPoint: (state, action: PayloadAction<TVLDataPoint>) => {
      state.tvlData.push(action.payload)
      // Keep only last 1000 data points to prevent memory issues
      if (state.tvlData.length > 1000) {
        state.tvlData = state.tvlData.slice(-1000)
      }
    },
    addProfitLossDataPoint: (state, action: PayloadAction<ProfitLossDataPoint>) => {
      state.profitLossData.push(action.payload)
      // Keep only last 1000 data points
      if (state.profitLossData.length > 1000) {
        state.profitLossData = state.profitLossData.slice(-1000)
      }
    },
  },
})

export const {
  setTVLData,
  setPerformanceData,
  setProfitLossData,
  setChartConfig,
  setLoading,
  setError,
  clearError,
  addTVLDataPoint,
  addProfitLossDataPoint,
} = chartSlice.actions

export default chartSlice.reducer