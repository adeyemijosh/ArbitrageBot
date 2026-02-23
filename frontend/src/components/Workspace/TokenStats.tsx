import React, { useState } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useGetWorkspacesQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const TokenStats: React.FC = () => {
  const { currentWorkspace } = useAppSelector((state) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''
  
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [selectedToken, setSelectedToken] = useState<string>('all')

  const { data: tokenStats, isLoading, error } = useGetWorkspacesQuery(undefined, {
    skip: !workspaceId,
    pollingInterval: 30000, // Poll every 30 seconds
  })

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
  }

  if (!currentWorkspace) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">Please select a workspace to view token stats.</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tokens</option>
                {/* Token options would be populated from API */}
                <option value="weth">WETH</option>
                <option value="dai">DAI</option>
                <option value="usdc">USDC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tokenStats?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🏷️</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Performer</p>
                <p className="text-2xl font-bold text-green-600">
                  {tokenStats && tokenStats.length > 0 
                    ? tokenStats.reduce((best, current) => 
                        current.priceChange24h > best.priceChange24h ? current : best
                      ).symbol
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🏆</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Worst Performer</p>
                <p className="text-2xl font-bold text-red-600">
                  {tokenStats && tokenStats.length > 0 
                    ? tokenStats.reduce((worst, current) => 
                        current.priceChange24h < worst.priceChange24h ? current : worst
                      ).symbol
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">📉</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Volume</p>
                <p className="text-2xl font-bold text-purple-600">
                  {tokenStats && tokenStats.length > 0 
                    ? `$${(tokenStats.reduce((sum, token) => sum + token.volume, 0) / tokenStats.length).toLocaleString()}`
                    : '$0'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Stats Table */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Performance</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" text="Loading token stats..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading token stats
            </div>
          ) : tokenStats && tokenStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Cap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liquidity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tokenStats.map((token) => (
                    <tr key={token.address} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              {token.symbol}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {token.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${token.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getChangeColor(token.priceChange24h)}`}>
                          {formatChange(token.priceChange24h)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${token.volume.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${token.marketCap.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${token.liquidity.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No token stats available.
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-3">
              {tokenStats && tokenStats.length > 0 ? (
                tokenStats.map((token) => (
                  <div key={token.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold">{token.symbol}</span>
                      <span className="text-sm text-gray-600">{token.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getChangeColor(token.priceChange24h)}`}>
                        {formatChange(token.priceChange24h)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${token.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No performance data available
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Market Cap</span>
                <span className="font-semibold">
                  ${tokenStats && tokenStats.length > 0 
                    ? tokenStats.reduce((sum, token) => sum + token.marketCap, 0).toLocaleString()
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Volume (24h)</span>
                <span className="font-semibold">
                  ${tokenStats && tokenStats.length > 0 
                    ? tokenStats.reduce((sum, token) => sum + token.volume, 0).toLocaleString()
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Liquidity</span>
                <span className="font-semibold">
                  ${tokenStats && tokenStats.length > 0 
                    ? tokenStats.reduce((sum, token) => sum + token.liquidity, 0).toLocaleString()
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Change</span>
                <span className="font-semibold">
                  {tokenStats && tokenStats.length > 0 
                    ? formatChange(tokenStats.reduce((sum, token) => sum + token.priceChange24h, 0) / tokenStats.length)
                    : '0.00%'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default TokenStats