import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useGetWalletBalancesQuery, useGetTVLDataQuery, useAddProjectTokenMutation, useRemoveProjectTokenMutation } from '../../store/api/workspaceApi'
import { addTVLDataPoint } from '../../store/chartSlice'
import { updateBalance } from '../../store/walletSlice'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'
import TVLChart from '../Charts/TVLChart'
import ProfitLossChart from '../Charts/ProfitLossChart'

const Assets: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const { wallet } = useSelector((state: RootState) => state.wallet)

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [interval] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('1h')
  const [showAddToken, setShowAddToken] = useState(false)
  const [newTokenAddress, setNewTokenAddress] = useState('')

  const walletAddress = currentWorkspace?.address || ''

  const { data: balances, isLoading: balancesLoading, error: balancesError } = useGetWalletBalancesQuery(walletAddress, {
    skip: !walletAddress, pollingInterval: 30000,
  })
  const { data: tvlChartData, isLoading: tvlLoading, error: tvlError } = useGetTVLDataQuery(
    { walletAddress, timeRange, interval } as any,
    { skip: !walletAddress, pollingInterval: 10000 }
  )
  const [addProjectToken, { isLoading: addingToken }] = useAddProjectTokenMutation()
  const [removeProjectToken, { isLoading: removingToken }] = useRemoveProjectTokenMutation()

  useEffect(() => {
    if (tvlChartData?.length) dispatch(addTVLDataPoint((tvlChartData as any)[tvlChartData.length - 1]))
  }, [tvlChartData, dispatch])

  useEffect(() => {
    if (balances) balances.forEach(b => dispatch(updateBalance(b)))
  }, [balances, dispatch])

  const handleAddToken = async () => {
    if (!newTokenAddress || !walletAddress) return
    try {
      await addProjectToken({ walletAddress, tokenAddress: newTokenAddress }).unwrap()
      setNewTokenAddress(''); setShowAddToken(false)
    } catch (e) { console.error(e) }
  }

  const handleRemoveToken = async (tokenAddress: string) => {
    try { await removeProjectToken({ walletAddress, tokenAddress }).unwrap() } catch (e) { console.error(e) }
  }

  const totalUSDValue = balances?.reduce((t, b) => t + b.usdValue, 0) || 0
  const totalTVL = wallet?.tvl || 0

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view assets.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Value Locked', value: `$${totalTVL.toLocaleString()}`, sub: 'Real-time value', icon: '◈', accent: '#3b82f6' },
            { label: 'Total USD Value', value: `$${totalUSDValue.toLocaleString()}`, sub: 'All tracked tokens', icon: '▲', accent: '#00ff88' },
            { label: 'Project Tokens', value: String(balances?.length || 0), sub: 'Tracked assets', icon: '⬡', accent: '#a855f7' },
            { label: 'Tracking Status', value: 'Active', sub: 'Live updates', icon: '◉', accent: '#00ff88' },
          ].map(({ label, value, sub, accent }) => (
            <div key={label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 90, height: 90, pointerEvents: 'none', background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)` }} />
              <p className="section-label" style={{ marginBottom: 8 }}>{label}</p>
              <p style={{ color: label === 'Tracking Status' ? '#00ff88' : '#f1f5f9', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</p>
              <p className="mono" style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* TVL Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Total Value Locked (TVL)</p>
              <p className="mono" style={{ color: '#374151', fontSize: 11, marginTop: 2 }}>Historical chart</p>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {(['1h', '24h', '7d', '30d'] as const).map(r => (
                <button key={r} onClick={() => setTimeRange(r)} style={{
                  background: timeRange === r ? 'rgba(59,130,246,0.15)' : 'transparent',
                  border: timeRange === r ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
                  color: timeRange === r ? '#3b82f6' : '#475569',
                  padding: '3px 10px', borderRadius: 6, fontSize: 11,
                  cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
                }}>{r}</button>
              ))}
              <button className="btn-secondary" style={{ fontSize: 11, padding: '4px 12px', marginLeft: 8 }}>Export</button>
            </div>
          </div>
          {tvlLoading ? (
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading TVL data..." />
            </div>
          ) : tvlError ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading TVL data</p>
          ) : (
            <TVLChart data={(tvlChartData as any) || []} height={300} />
          )}
        </div>

        {/* Token Balances */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Token Balances</p>
            <button className={showAddToken ? 'btn-secondary' : 'btn-primary'} style={{ fontSize: 12, padding: '6px 14px' }}
              onClick={() => setShowAddToken(!showAddToken)}>
              {showAddToken ? '✕ Cancel' : '+ Add Token'}
            </button>
          </div>

          {showAddToken && (
            <div style={{ marginBottom: 16, padding: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', gap: 10 }}>
              <input className="dark-input" type="text" value={newTokenAddress}
                onChange={e => setNewTokenAddress(e.target.value)}
                placeholder="Enter token contract address (0x...)" />
              <button className="btn-primary" onClick={handleAddToken} disabled={addingToken}
                style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                {addingToken ? 'Adding…' : 'Add'}
              </button>
            </div>
          )}

          {balancesLoading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading balances..." />
            </div>
          ) : balancesError ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading token balances</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dark-table">
                <thead>
                  <tr>{['Token', 'Balance', 'Price', 'USD Value', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {balances?.map(b => (
                    <tr key={b.tokenAddress}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, color: '#6366f1', fontFamily: 'var(--font-mono)',
                          }}>{b.symbol?.slice(0, 3)}</div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{b.name}</p>
                            <p className="mono" style={{ fontSize: 10, color: '#475569' }}>{b.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>
                        {Number(b.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>
                        ${b.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </td>
                      <td className="mono" style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 600 }}>
                        ${b.usdValue.toLocaleString()}
                      </td>
                      <td>
                        <button className="btn-danger" onClick={() => handleRemoveToken(b.tokenAddress)} disabled={removingToken}>
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

        {/* P&L Chart */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Profit / Loss Analysis</p>
          <ProfitLossChart data={[]} height={280} />
        </div>

      </div>
    </ErrorBoundary>
  )
}

export default Assets