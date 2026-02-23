import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const Header: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            {isWorkspaceRoute && currentWorkspace && (
              <>
                <Link to={`/workspace/${currentWorkspace.id}/overview`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Overview</Link>
                <Link to={`/workspace/${currentWorkspace.id}/transactions`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Transactions</Link>
                <Link to={`/workspace/${currentWorkspace.id}/assets`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Assets</Link>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary text-sm">Settings</button>
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