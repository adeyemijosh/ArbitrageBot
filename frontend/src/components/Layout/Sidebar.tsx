import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)

  const navigation = [
    { name: 'Overview', href: 'overview', icon: '📊' },
    { name: 'Transactions', href: 'transactions', icon: '💸' },
    { name: 'Assets', href: 'assets', icon: '💰' },
    { name: 'Data Tracking', href: 'data-tracking', icon: '📈' },
    { name: 'Source Code', href: 'source-code', icon: '💻' },
    { name: 'History', href: 'history', icon: '📜' },
    { name: 'Token Stats', href: 'token-stats', icon: '📊' },
  ]

  if (!currentWorkspace) {
    return null
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {currentWorkspace.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {currentWorkspace.address}
        </p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          currentWorkspace.type === 'wallet' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {currentWorkspace.type === 'wallet' ? 'Wallet' : 'Contract'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname.includes(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Workspace ID: {currentWorkspace.id}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Created: {new Date(currentWorkspace.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default Sidebar