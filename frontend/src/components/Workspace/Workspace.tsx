import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspaceQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const Workspace: React.FC = () => {
  const { workspaceId } = useParams()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  
  const { data: workspace, isLoading, error } = useGetWorkspaceQuery(workspaceId || '', {
    skip: !workspaceId
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading workspace..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Workspace Not Found</h3>
          <p className="text-gray-600">The workspace you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                workspace?.type === 'wallet' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                <span className="text-2xl">
                  {workspace?.type === 'wallet' ? '💼' : '🏗️'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{workspace?.name}</h1>
                <p className="text-sm text-gray-500">{workspace?.address}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  workspace?.type === 'wallet' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {workspace?.type === 'wallet' ? 'Wallet' : 'Contract'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm font-medium">
                {workspace && new Date(workspace.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content will be rendered by child routes */}
      </div>
    </ErrorBoundary>
  )
}

export default Workspace