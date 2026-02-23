import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Workspace, WorkspaceOverview } from '../types'

interface WorkspaceState {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  overview: WorkspaceOverview | null
  loading: boolean
  error: string | null
}

const initialState: WorkspaceState = {
  currentWorkspace: null,
  workspaces: [],
  overview: null,
  loading: false,
  error: null,
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload
      state.error = null
    },
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload
      state.loading = false
      state.error = null
    },
    setOverview: (state, action: PayloadAction<WorkspaceOverview>) => {
      state.overview = action.payload
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
    clearWorkspace: (state) => {
      state.currentWorkspace = null
      state.overview = null
      state.error = null
    },
  },
})

export const {
  setCurrentWorkspace,
  setWorkspaces,
  setOverview,
  setLoading,
  setError,
  clearError,
  clearWorkspace,
} = workspaceSlice.actions

export default workspaceSlice.reducer