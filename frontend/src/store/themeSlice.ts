import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
}

const initialState: ThemeState = {
  mode: 'system',
  isDark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      // Update isDark based on the new mode
      if (action.payload === 'system') {
        state.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        state.isDark = action.payload === 'dark'
      }
    },
    updateSystemTheme: (state) => {
      if (state.mode === 'system') {
        state.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    }
  }
})

export const { setThemeMode, updateSystemTheme } = themeSlice.actions
export default themeSlice.reducer