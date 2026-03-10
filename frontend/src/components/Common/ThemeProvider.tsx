import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setThemeMode, updateSystemTheme } from '../../store/themeSlice'

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch()
  const { mode, isDark } = useSelector((state: RootState) => state.theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system' | null
    if (savedTheme) {
      dispatch(setThemeMode(savedTheme))
    } else {
      // Default to system preference
      dispatch(setThemeMode('system'))
    }
    setMounted(true)
  }, [dispatch])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      dispatch(updateSystemTheme())
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [dispatch])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Determine if we should use dark theme
    const shouldUseDark = mode === 'dark' || (mode === 'system' && isSystemDark)

    if (shouldUseDark) {
      root.classList.add('dark')
      // Set dark theme CSS variables
      root.style.setProperty('--bg-primary', '#0f172a')
      root.style.setProperty('--bg-secondary', '#111827')
      root.style.setProperty('--bg-tertiary', '#1f2937')
      root.style.setProperty('--bg-card', '#111827')
      root.style.setProperty('--bg-modal', '#0b1220')
      
      root.style.setProperty('--text-primary', '#f1f5f9')
      root.style.setProperty('--text-secondary', '#e5e7eb')
      root.style.setProperty('--text-tertiary', '#9ca3af')
      root.style.setProperty('--text-muted', '#6b7280')
      
      root.style.setProperty('--border-default', '#374151')
      root.style.setProperty('--border-subtle', '#1f2937')
      root.style.setProperty('--border-strong', '#4b5563')
      
      // Primary colors (blue)
      root.style.setProperty('--color-primary-50', '#eff6ff')
      root.style.setProperty('--color-primary-100', '#dbeafe')
      root.style.setProperty('--color-primary-200', '#bfdbfe')
      root.style.setProperty('--color-primary-300', '#93c5fd')
      root.style.setProperty('--color-primary-400', '#60a5fa')
      root.style.setProperty('--color-primary-500', '#3b82f6')
      root.style.setProperty('--color-primary-600', '#2563eb')
      root.style.setProperty('--color-primary-700', '#1d4ed8')
      root.style.setProperty('--color-primary-800', '#1e40af')
      root.style.setProperty('--color-primary-900', '#1e3a8a')
      
      // Secondary colors (gray)
      root.style.setProperty('--color-secondary-50', '#f9fafb')
      root.style.setProperty('--color-secondary-100', '#f3f4f6')
      root.style.setProperty('--color-secondary-200', '#e5e7eb')
      root.style.setProperty('--color-secondary-300', '#d1d5db')
      root.style.setProperty('--color-secondary-400', '#9ca3af')
      root.style.setProperty('--color-secondary-500', '#6b7280')
      root.style.setProperty('--color-secondary-600', '#4b5563')
      root.style.setProperty('--color-secondary-700', '#374151')
      root.style.setProperty('--color-secondary-800', '#1f2937')
      root.style.setProperty('--color-secondary-900', '#111827')
      
      // Success colors (green)
      root.style.setProperty('--color-success-50', '#ecfdf5')
      root.style.setProperty('--color-success-100', '#d1fae5')
      root.style.setProperty('--color-success-200', '#a7f3d0')
      root.style.setProperty('--color-success-300', '#6ee7b7')
      root.style.setProperty('--color-success-400', '#34d399')
      root.style.setProperty('--color-success-500', '#10b981')
      root.style.setProperty('--color-success-600', '#059669')
      root.style.setProperty('--color-success-700', '#047857')
      root.style.setProperty('--color-success-800', '#065f46')
      root.style.setProperty('--color-success-900', '#064e3b')
      
      // Warning colors (amber)
      root.style.setProperty('--color-warning-50', '#fffbeb')
      root.style.setProperty('--color-warning-100', '#fef3c7')
      root.style.setProperty('--color-warning-200', '#fde68a')
      root.style.setProperty('--color-warning-300', '#fcd34d')
      root.style.setProperty('--color-warning-400', '#fbbf24')
      root.style.setProperty('--color-warning-500', '#f59e0b')
      root.style.setProperty('--color-warning-600', '#d97706')
      root.style.setProperty('--color-warning-700', '#b45309')
      root.style.setProperty('--color-warning-800', '#92400e')
      root.style.setProperty('--color-warning-900', '#78350f')
      
      // Error colors (red)
      root.style.setProperty('--color-error-50', '#fef2f2')
      root.style.setProperty('--color-error-100', '#fee2e2')
      root.style.setProperty('--color-error-200', '#fecaca')
      root.style.setProperty('--color-error-300', '#fca5a5')
      root.style.setProperty('--color-error-400', '#f87171')
      root.style.setProperty('--color-error-500', '#ef4444')
      root.style.setProperty('--color-error-600', '#dc2626')
      root.style.setProperty('--color-error-700', '#b91c1c')
      root.style.setProperty('--color-error-800', '#991b1b')
      root.style.setProperty('--color-error-900', '#7f1d1d')
    } else {
      root.classList.remove('dark')
      // Set light theme CSS variables
      root.style.setProperty('--bg-primary', '#f8fafc')
      root.style.setProperty('--bg-secondary', '#f1f5f9')
      root.style.setProperty('--bg-tertiary', '#e2e8f0')
      root.style.setProperty('--bg-card', '#ffffff')
      root.style.setProperty('--bg-modal', '#ffffff')
      
      root.style.setProperty('--text-primary', '#0f172a')
      root.style.setProperty('--text-secondary', '#334155')
      root.style.setProperty('--text-tertiary', '#64748b')
      root.style.setProperty('--text-muted', '#94a3b8')
      
      root.style.setProperty('--border-default', '#e2e8f0')
      root.style.setProperty('--border-subtle', '#f1f5f9')
      root.style.setProperty('--border-strong', '#cbd5e1')
      
      // Primary colors (blue)
      root.style.setProperty('--color-primary-50', '#eff6ff')
      root.style.setProperty('--color-primary-100', '#dbeafe')
      root.style.setProperty('--color-primary-200', '#bfdbfe')
      root.style.setProperty('--color-primary-300', '#93c5fd')
      root.style.setProperty('--color-primary-400', '#60a5fa')
      root.style.setProperty('--color-primary-500', '#3b82f6')
      root.style.setProperty('--color-primary-600', '#2563eb')
      root.style.setProperty('--color-primary-700', '#1d4ed8')
      root.style.setProperty('--color-primary-800', '#1e40af')
      root.style.setProperty('--color-primary-900', '#1e3a8a')
      
      // Secondary colors (gray)
      root.style.setProperty('--color-secondary-50', '#f9fafb')
      root.style.setProperty('--color-secondary-100', '#f3f4f6')
      root.style.setProperty('--color-secondary-200', '#e5e7eb')
      root.style.setProperty('--color-secondary-300', '#d1d5db')
      root.style.setProperty('--color-secondary-400', '#9ca3af')
      root.style.setProperty('--color-secondary-500', '#6b7280')
      root.style.setProperty('--color-secondary-600', '#4b5563')
      root.style.setProperty('--color-secondary-700', '#374151')
      root.style.setProperty('--color-secondary-800', '#1f2937')
      root.style.setProperty('--color-secondary-900', '#111827')
      
      // Success colors (green)
      root.style.setProperty('--color-success-50', '#ecfdf5')
      root.style.setProperty('--color-success-100', '#d1fae5')
      root.style.setProperty('--color-success-200', '#a7f3d0')
      root.style.setProperty('--color-success-300', '#6ee7b7')
      root.style.setProperty('--color-success-400', '#34d399')
      root.style.setProperty('--color-success-500', '#10b981')
      root.style.setProperty('--color-success-600', '#059669')
      root.style.setProperty('--color-success-700', '#047857')
      root.style.setProperty('--color-success-800', '#065f46')
      root.style.setProperty('--color-success-900', '#064e3b')
      
      // Warning colors (amber)
      root.style.setProperty('--color-warning-50', '#fffbeb')
      root.style.setProperty('--color-warning-100', '#fef3c7')
      root.style.setProperty('--color-warning-200', '#fde68a')
      root.style.setProperty('--color-warning-300', '#fcd34d')
      root.style.setProperty('--color-warning-400', '#fbbf24')
      root.style.setProperty('--color-warning-500', '#f59e0b')
      root.style.setProperty('--color-warning-600', '#d97706')
      root.style.setProperty('--color-warning-700', '#b45309')
      root.style.setProperty('--color-warning-800', '#92400e')
      root.style.setProperty('--color-warning-900', '#78350f')
      
      // Error colors (red)
      root.style.setProperty('--color-error-50', '#fef2f2')
      root.style.setProperty('--color-error-100', '#fee2e2')
      root.style.setProperty('--color-error-200', '#fecaca')
      root.style.setProperty('--color-error-300', '#fca5a5')
      root.style.setProperty('--color-error-400', '#f87171')
      root.style.setProperty('--color-error-500', '#ef4444')
      root.style.setProperty('--color-error-600', '#dc2626')
      root.style.setProperty('--color-error-700', '#b91c1c')
      root.style.setProperty('--color-error-800', '#991b1b')
      root.style.setProperty('--color-error-900', '#7f1d1d')
    }

    // Save theme preference
    localStorage.setItem('theme-mode', mode)
  }, [mode, mounted, isDark])

  return <>{children}</>
}

export default ThemeProvider