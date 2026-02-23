import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetTVLDataQuery, useGetProfitLossDataQuery, useGetTransactionsQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const History: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''
  
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [dataType, setDataType] = useState<'all' | 'tvl' | 'profit' | 'transactions'>('all')

  // Get historical data based on selected type
  const {
    data: tvlData,
    isLoading: tvlLoading,
    error: tvlError
  } = useGetTVLDataQuery(
    { walletAddress: workspaceId, type: 'tvl', timeRange: timeRange, interval: '1h' },
    { skip: !workspaceId || (dataType !== 'all' && dataType !== 'tvl') }
  )

  const {
    data: profitData,
    isLoading: profitLoading,
    error: profitError
  } = useGetProfitLossDataQuery(
    { walletAddress: workspaceId, type: 'profit-loss', timeRange: timeRange, interval: '1h' },
    { skip: !workspaceId || (dataType !== 'all' && dataType !== 'profit') }
  )

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError
  } = useGetTransactionsQuery(
    { walletAddress: workspaceId, page: 1, limit: 100 },
    { skip: !workspaceId || (dataType !== 'all' && dataType !== 'transactions') }
  )

  // Combine and format historical data
  const historicalData = useMemo(() => {
    const data: any[] = []
    
    if (tvlData) {
      data.push(...tvlData.map((point, index) => ({
        id: `tvl-${point.timestamp}`,
        timestamp: new Date(point.timestamp).toISOString(),
        type: 'tvl',
        value: point.tvl,
        metadata: { usdValue: point.usdValue }
      })))
    }
    
    if (profitData) {
      data.push(...profitData.map((point, index) => ({
        id: `profit-${point.timestamp}`,
        timestamp: new Date(point.timestamp).toISOString(),
        type: 'profit',
        value: point.netProfit,
        metadata: { profit: point.profit, loss: point.loss }
      })))
    }
    
    if (transactionsData?.data) {
      data.push(...transactionsData.data.map((tx, index) => ({
        id: tx.hash,
        timestamp: tx.timestamp,
        type: 'transactions',
        value: 1, // Count transactions
        metadata: { hash: tx.hash, from: tx.from, to: tx.to, value: tx.value }
      })))
    }
    
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [tvlData, profitData, transactionsData])

  const isLoading = tvlLoading || profitLoading || transactionsLoading
  const error = tvlError || profitError || transactionsError

  const formatDataValue = (value: number, type: string) => {
    if (type === 'tvl' || type === 'profit') {
      return `$${value.toLocaleString()}`
    }
    return value.toLocaleString()
  }

  if (!currentWorkspace) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">Please select a workspace to view history.</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Data</option>
                <option value="tvl">TVL</option>
                <option value="profit">Profit</option>
                <option value="transactions">Transactions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {historicalData?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Range</p>
                <p className="text-2xl font-bold text-gray-900">
                  {historicalData && historicalData.length > 0 
                    ? `${new Date(historicalData[0].timestamp).toLocaleDateString()} - ${new Date(historicalData[historicalData.length - 1].timestamp).toLocaleDateString()}`
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Update Frequency</p>
                <p className="text-2xl font-bold text-blue-600">Real-time</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data Table */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Data</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" text="Loading historical data..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading historical data
            </div>
          ) : historicalData && historicalData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metadata
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalData.map((record, index) => {
                    const prevValue = index > 0 ? historicalData[index - 1].value : record.value
                    const change = record.value - prevValue
                    const changePercent = prevValue !== 0 ? (change / Math.abs(prevValue)) * 100 : 0
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.type === 'tvl' ? 'bg-blue-100 text-blue-800' :
                            record.type === 'profit' ? 'bg-green-100 text-green-800' :
                            record.type === 'transactions' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatDataValue(record.value, record.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${
                            change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {change >= 0 ? '+' : ''}{formatDataValue(change, record.type)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.metadata ? JSON.stringify(record.metadata) : 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No historical data found for the selected filters.
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
          <div className="flex space-x-4">
            <button className="btn-primary">
              Export CSV
            </button>
            <button className="btn-secondary">
              Export JSON
            </button>
            <button className="btn-secondary">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default History