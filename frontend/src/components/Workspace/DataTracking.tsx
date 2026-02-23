import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspacesQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const DataTracking: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''
  
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [metricType, setMetricType] = useState<'all' | 'price' | 'volume' | 'liquidity' | 'profit'>('all')

  const { data: dataPoints, isLoading, error } = useGetWorkspacesQuery(undefined, {
    skip: !workspaceId,
    pollingInterval: 10000, // Poll every 10 seconds
  })

  const [addDataPoint, { isLoading: addingDataPoint }] = useGetWorkspacesQuery
  const [removeDataPoint, { isLoading: removingDataPoint }] = useGetWorkspacesQuery

  const [newDataPoint, setNewDataPoint] = useState({
    metricType: 'price',
    value: '',
    timestamp: Date.now(),
    metadata: {}
  })

  const handleAddDataPoint = async () => {
    if (!workspaceId) return

    try {
      await addDataPoint({
        workspaceId,
        dataPoint: {
          ...newDataPoint,
          value: parseFloat(newDataPoint.value),
          timestamp: new Date().toISOString()
        }
      }).unwrap()
      setNewDataPoint({
        metricType: 'price',
        value: '',
        timestamp: Date.now(),
        metadata: {}
      })
    } catch (error) {
      console.error('Failed to add data point:', error)
    }
  }

  const handleRemoveDataPoint = async (dataPointId: string) => {
    if (!workspaceId) return

    try {
      await removeDataPoint({
        workspaceId,
        dataPointId
      }).unwrap()
    } catch (error) {
      console.error('Failed to remove data point:', error)
    }
  }

  const getMetricColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'price': return 'bg-blue-100 text-blue-800'
      case 'volume': return 'bg-green-100 text-green-800'
      case 'liquidity': return 'bg-purple-100 text-purple-800'
      case 'profit': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!currentWorkspace) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">Please select a workspace to view data tracking.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Controls */}
        <div className="card">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Metrics</option>
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="liquidity">Liquidity</option>
                <option value="profit">Profit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Data Point Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Data Point</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
              <select
                value={newDataPoint.metricType}
                onChange={(e) => setNewDataPoint({...newDataPoint, metricType: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="liquidity">Liquidity</option>
                <option value="profit">Profit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="number"
                value={newDataPoint.value}
                onChange={(e) => setNewDataPoint({...newDataPoint, value: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Metadata (JSON)</label>
              <input
                type="text"
                value={JSON.stringify(newDataPoint.metadata)}
                onChange={(e) => {
                  try {
                    setNewDataPoint({...newDataPoint, metadata: JSON.parse(e.target.value)})
                  } catch {
                    // Ignore invalid JSON
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleAddDataPoint}
              disabled={addingDataPoint}
              className="btn-primary"
            >
              {addingDataPoint ? 'Adding...' : 'Add Data Point'}
            </button>
          </div>
        </div>

        {/* Data Points List */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Points</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" text="Loading data points..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading data points
            </div>
          ) : dataPoints && dataPoints.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metadata
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataPoints.map((point) => (
                    <tr key={point.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(point.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMetricColor(point.metricType)}`}>
                          {point.metricType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {point.value.toLocaleString(undefined, {
                          maximumFractionDigits: 6
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {JSON.stringify(point.metadata)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveDataPoint(point.id)}
                          disabled={removingDataPoint}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data points found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default DataTracking