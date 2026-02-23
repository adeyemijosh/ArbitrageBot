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