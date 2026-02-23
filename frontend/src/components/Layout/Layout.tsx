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