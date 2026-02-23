import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Wallet, Transaction, TokenBalance, ProfitLossMetrics } from '../types'

interface WalletState {
  wallet: Wallet | null
  transactions: Transaction[]
  balances: TokenBalance[]
  profitLoss: ProfitLossMetrics | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  balances: [],
  profitLoss: null,
  loading: false,
  error: null,
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallet = action.payload
      state.loading = false
      state.error = null
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload
      state.loading = false
      state.error = null
    },
    setBalances: (state, action: PayloadAction<TokenBalance[]>) => {
      state.balances = action.payload
      state.loading = false
      state.error = null
    },
    setProfitLoss: (state, action: PayloadAction<ProfitLossMetrics>) => {
      state.profitLoss = action.payload
      state.loading = false
      state.error = null
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
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
      // Keep only last 1000 transactions
      if (state.transactions.length > 1000) {
        state.transactions = state.transactions.slice(0, 1000)
      }
    },
    updateBalance: (state, action: PayloadAction<TokenBalance>) => {
      const index = state.balances.findIndex(
        balance => balance.tokenAddress === action.payload.tokenAddress
      )
      if (index >= 0) {
        state.balances[index] = action.payload
      } else {
        state.balances.push(action.payload)
      }
    },
    updateProfitLoss: (state, action: PayloadAction<Partial<ProfitLossMetrics>>) => {
      if (state.profitLoss) {
        state.profitLoss = { ...state.profitLoss, ...action.payload }
      }
    },
  },
})

export const {
  setWallet,
  setTransactions,
  setBalances,
  setProfitLoss,
  setLoading,
  setError,
  clearError,
  addTransaction,
  updateBalance,
  updateProfitLoss,
} = walletSlice.actions

export default walletSlice.reducer