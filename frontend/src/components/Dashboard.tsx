import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Workspace } from '../types'

const Dashboard: React.FC = () => {
  const { workspaces, loading } = useSelector((state: RootState) => state.workspace)

  const mockWorkspaces: Workspace[] = [
    {
      id: 'wallet-1',
      name: 'Main Wallet',
      type: 'wallet',
      address: '0x742d35Cc6634C0532925a3b8D',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T15:45:00Z',
    },
    {
      id: 'contract-1',
      name: 'Arbitrage Contract',
      type: 'contract',
      address: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      createdAt: '2024-01-10T08:15:00Z',
      updatedAt: '2024-01-19T12:30:00Z',
    },
  ]

  const currentWorkspaces = workspaces.length > 0 ? workspaces : mockWorkspaces

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your arbitrage operations and workspace performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Refresh Data
          </button>
          <button className="btn-primary">
            Add Workspace
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total TVL</p>
              <p className="text-2xl font-bold text-gray-900">$45,230.50</p>
              <p className="text-xs text-green-600 mt-1">+12.5% (24h)</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">💰</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">$2,150.75</p>
              <p className="text-xs text-green-600 mt-1">+8.3% (24h)</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">📈</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workspaces</p>
              <p className="text-2xl font-bold text-gray-900">{currentWorkspaces.length}</p>
              <p className="text-xs text-gray-600 mt-1">Real-time monitoring</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspaces Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentWorkspaces.map((workspace) => (
            <Link
              key={workspace.id}
              to={`/workspace/${workspace.id}`}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    workspace.type === 'wallet' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    <span className="text-lg">
                      {workspace.type === 'wallet' ? '💼' : '🏗️'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {workspace.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {workspace.address}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  workspace.type === 'wallet' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {workspace.type === 'wallet' ? 'Wallet' : 'Contract'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(workspace.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">View Details</span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="font-medium">Arbitrage Opportunity Found</p>
                <p className="text-sm text-gray-500">WETH/DAI pair - Profit: 0.015 ETH</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📊</span>
              </div>
              <div>
                <p className="font-medium">TVL Update</p>
                <p className="text-sm text-gray-500">Total Value Locked: $45,230.50</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">15 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🔄</span>
              </div>
              <div>
                <p className="font-medium">Contract Deployment</p>
                <p className="text-sm text-gray-500">New arbitrage contract deployed</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard