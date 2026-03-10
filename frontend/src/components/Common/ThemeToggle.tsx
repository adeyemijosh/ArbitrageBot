import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setThemeMode } from '../../store/themeSlice'
import { Sun, Moon, Monitor } from 'lucide-react'

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.theme)

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    dispatch(setThemeMode(newMode))
  }

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="w-5 h-5" />
      case 'dark':
        return <Moon className="w-5 h-5" />
      case 'system':
        return <Monitor className="w-5 h-5" />
      default:
        return <Sun className="w-5 h-5" />
    }
  }

  const getLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Light'
    }
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary bg-bg-card border border-border-default rounded-lg hover:bg-bg-tertiary hover:text-text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Toggle theme"
      >
        {getIcon()}
        <span className="hidden sm:inline">{getLabel()}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border-default rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {[
            { key: 'light', label: 'Light', icon: Sun, color: 'text-amber-500' },
            { key: 'dark', label: 'Dark', icon: Moon, color: 'text-blue-400' },
            { key: 'system', label: 'System', icon: Monitor, color: 'text-gray-400' },
          ].map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key as 'light' | 'dark' | 'system')}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-bg-tertiary transition-colors ${
                mode === key ? 'text-text-primary font-medium' : 'text-text-secondary'
              }`}
            >
              <Icon className={`w-4 h-4 ${color} ${mode === key ? 'opacity-100' : 'opacity-70'}`} />
              <span>{label}</span>
              {mode === key && (
                <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle