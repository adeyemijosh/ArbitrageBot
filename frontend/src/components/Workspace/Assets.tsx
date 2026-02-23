import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useGetWalletBalancesQuery, useGetTVLDataQuery, useAddProjectTokenMutation, useRemoveProjectTokenMutation } from '../../store/api/workspaceApi'
import { addTVLDataPoint } from '../../store/chartSlice'
import { addTransaction, updateBalance } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'
import TVLChart from '../Charts/TVLChart'
import ProfitLossChart from '../Charts/ProfitLossChart'

const Assets: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const { tvlData } = useSelector((state: RootState) => state.charts)
  const { wallet } = useSelector((state: RootState) => state.wallet)
  
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('1h')
  const [showAddToken, setShowAddToken] = useState(false)
  const [newTokenAddress, setNewTokenAddress] = useState('')

  const walletAddress = currentWorkspace?.address || ''
  
  const { data: balances, isLoading: balancesLoading, error: balancesError } = useGetWalletBalancesQuery(walletAddress, {
    skip: !walletAddress,
    pollingInterval: 30000, // Poll every 30 seconds
  })

  const { data: tvlChartData, isLoading: tvlLoading, error: tvlError } = useGetTVLDataQuery({
    walletAddress,
    timeRange,
    interval
  }, {
    skip: !walletAddress,
    pollingInterval: 10000, // Poll every 10 seconds for TVL
  })

  const [addProjectToken, { isLoading: addingToken }] = useAddProjectTokenMutation()
  const [removeProjectToken, { isLoading: removingToken }] = useRemoveProjectTokenMutation()

  // Update Redux store with new data
  useEffect(() => {
    if (tvlChartData && tvlChartData.length > 0) {
      // Add latest TVL data point
      const latestPoint = tvlChartData[tvlChartData.length - 1]
      dispatch(addTVLDataPoint(latestPoint))
    }
  }, [tvlChartData, dispatch])

  useEffect(() => {
    if (balances) {
      // Update balances in Redux store
      balances.forEach(balance => {
        dispatch(updateBalance(balance))
      })
    }
  }, [balances, dispatch])

  const handleAddProjectToken = async () => {
    if (!newTokenAddress || !walletAddress) return

    try {
      await addProjectToken({
        walletAddress,
        tokenAddress: newTokenAddress
      }).unwrap()
      setNewTokenAddress('')
      setShowAddToken(false)
    } catch (error) {
      console.error('Failed to add project token:', error)
    }
  }

  const handleRemoveProjectToken = async (tokenAddress: string) => {
    if (!walletAddress) return

    try {
      await removeProjectToken({
        walletAddress,
        tokenAddress
      }).unwrap()
    } catch (error) {
      console.error('Failed to remove project token:', error)
    }
  }

  const totalUSDValue = balances?.reduce((total, balance) => total + balance.usdValue, 0) || 0
  const totalTVL = wallet?.tvl || 0

  if (!currentWorkspace) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">Please select a workspace to view assets.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* TVL Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value Locked</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalTVL.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Real-time value</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total USD Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalUSDValue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">All tracked tokens</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📊</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Project Tokens</p>
                <p className="text-2xl font-bold text-gray-900">
                  {balances?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Tracked assets</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">🏷️</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tracking Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
                <p className="text-xs text-gray-500 mt-1">Live updates</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🟢</span>
              </div>
            </div>
          </div>
        </div>

        {/* TVL Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Value Locked (TVL)</h3>
            <div className="flex items-center space-x-4">
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
              <button className="btn-secondary text-sm">
                Export Data
              </button>
            </div>
          </div>
          {tvlLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="md" text="Loading TVL data..." />
            </div>
          ) : tvlError ? (
            <div className="h-64 flex items-center justify-center text-red-500">
              Error loading TVL data
            </div>
          ) : (
            <TVLChart data={tvlChartData || []} height={400} />
          )}
        </div>

        {/* Token Balances */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Token Balances</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddToken(!showAddToken)}
                className="btn-primary text-sm"
              >
                {showAddToken ? 'Cancel' : 'Add Token'}
              </button>
            </div>
          </div>

          {showAddToken && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTokenAddress}
                  onChange={(e) => setNewTokenAddress(e.target.value)}
                  placeholder="Enter token contract address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddProjectToken}
                  disabled={addingToken}
                  className="btn-primary"
                >
                  {addingToken ? 'Adding...' : 'Add Token'}
                </button>
              </div>
            </div>
          )}

          {balancesLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" text="Loading balances..." />
            </div>
          ) : balancesError ? (
            <div className="text-red-500 text-center py-8">
              Error loading token balances
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      USD Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {balances?.map((balance) => (
                    <tr key={balance.tokenAddress} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              {balance.symbol}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {balance.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {balance.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(balance.balance).toLocaleString(undefined, {
                          maximumFractionDigits: 6
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${balance.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${balance.usdValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveProjectToken(balance.tokenAddress)}
                          disabled={removingToken}
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
          )}
        </div>

        {/* Profit/Loss Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit/Loss Analysis</h3>
          <ProfitLossChart height={300} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Assets