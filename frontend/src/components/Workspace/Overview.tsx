import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspaceOverviewQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const Overview: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''
  
  const { data: overview, isLoading, error } = useGetWorkspaceOverviewQuery(workspaceId, {
    skip: !workspaceId,
    pollingInterval: 60000, // Poll every minute
  })

  if (!currentWorkspace) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">Please select a workspace to view overview.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Native Token Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.nativeTokenBalance || '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">ETH or native token</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">💎</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value Locked</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${overview?.tvl?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Real-time TVL</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gas Consumption</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.gasConsumption?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Gas units</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">⛽</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.transactionCount || '0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total count</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Panel (for contract workspaces) */}
        {currentWorkspace.type === 'contract' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Panel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Activity</h4>
                <p className="text-sm text-blue-700">
                  View transaction activity and contract interactions over time.
                </p>
                <button className="mt-2 btn-primary text-sm">
                  View Activity
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Interact</h4>
                <p className="text-sm text-purple-700">
                  Call contract methods with optional sender impersonation.
                </p>
                <button className="mt-2 btn-primary text-sm">
                  Interact
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">KPIs</h4>
                <p className="text-sm text-green-700">
                  View current values of data tracked in the Data Tracking system.
                </p>
                <button className="mt-2 btn-primary text-sm">
                  View KPIs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{currentWorkspace.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{currentWorkspace.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-gray-900">{currentWorkspace.address}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Timestamps</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(currentWorkspace.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">
                    {new Date(currentWorkspace.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium text-green-600">
                    {overview?.lastUpdated ? new Date(overview.lastUpdated).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">WebSocket Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">API Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Overview