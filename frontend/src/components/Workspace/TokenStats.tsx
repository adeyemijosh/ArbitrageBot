import React, { useState } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useGetWorkspacesQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const TokenStats: React.FC = () => {
  const { currentWorkspace } = useAppSelector(state => state.workspace)
  const workspaceId = currentWorkspace?.id || ''

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [selectedToken, setSelectedToken] = useState('all')

  const { data: tokenStats, isLoading, error } = useGetWorkspacesQuery(undefined, {
    skip: !workspaceId, pollingInterval: 30000,
  })

  const stats = tokenStats as any[]

  const best = stats?.length ? stats.reduce((b, c) => c.priceChange24h > b.priceChange24h ? c : b) : null
  const worst = stats?.length ? stats.reduce((b, c) => c.priceChange24h < b.priceChange24h ? c : b) : null
  const avgVol = stats?.length ? stats.reduce((s, t) => s + (t.volume || 0), 0) / stats.length : 0

  const fmtChange = (v: number) => `${v >= 0 ? '+' : ''}${v?.toFixed(2)}%`

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view token stats.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Controls */}
        <div className="card">
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Time Range</p>
              <select className="dark-select" value={timeRange} onChange={e => setTimeRange(e.target.value as any)}>
                {[['1h','Last Hour'],['24h','Last 24h'],['7d','7 Days'],['30d','30 Days']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Token</p>
              <select className="dark-select" value={selectedToken} onChange={e => setSelectedToken(e.target.value)}>
                <option value="all">All Tokens</option>
                <option value="weth">WETH</option>
                <option value="dai">DAI</option>
                <option value="usdc">USDC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Tokens', value: stats?.length || 0, accent: '#3b82f6', icon: '⬡' },
            { label: 'Best Performer', value: best?.symbol || 'N/A', accent: '#00ff88', icon: '▲' },
            { label: 'Worst Performer', value: worst?.symbol || 'N/A', accent: '#ef4444', icon: '▼' },
            { label: 'Avg Volume', value: `$${avgVol.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, accent: '#a855f7', icon: '◈' },
          ].map(({ label, value, accent, icon }) => (
            <div key={label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 90, height: 90, pointerEvents: 'none', background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)` }} />
              <p className="section-label" style={{ marginBottom: 8 }}>{label}</p>
              <p style={{ color: accent, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Token Performance</p>
          {isLoading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading token stats..." />
            </div>
          ) : error ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading token stats</p>
          ) : stats?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="dark-table">
                <thead>
                  <tr>{['Token','Price','24h Change','Volume','Market Cap','Liquidity'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {stats.map((token: any) => (
                    <tr key={token.address}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, color: '#6366f1', fontFamily: 'var(--font-mono)',
                          }}>{token.symbol?.slice(0,3)}</div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{token.name}</p>
                            <p className="mono" style={{ fontSize: 10, color: '#475569' }}>{token.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="mono" style={{ color: '#f1f5f9', fontSize: 12 }}>
                        ${token.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </td>
                      <td>
                        <span className="mono" style={{ color: token.priceChange24h >= 0 ? '#00ff88' : '#ef4444', fontSize: 12, fontWeight: 600 }}>
                          {fmtChange(token.priceChange24h)}
                        </span>
                      </td>
                      <td className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>${token.volume?.toLocaleString()}</td>
                      <td className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>${token.marketCap?.toLocaleString()}</td>
                      <td className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>${token.liquidity?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#374151', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No token stats available</p>
            </div>
          )}
        </div>

        {/* Market Overview */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Market Overview</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              ['Total Market Cap', `$${stats?.reduce((s: number, t: any) => s + (t.marketCap || 0), 0).toLocaleString()}`],
              ['Total Volume (24h)', `$${stats?.reduce((s: number, t: any) => s + (t.volume || 0), 0).toLocaleString()}`],
              ['Total Liquidity', `$${stats?.reduce((s: number, t: any) => s + (t.liquidity || 0), 0).toLocaleString()}`],
              ['Average Change', stats?.length ? fmtChange(stats.reduce((s: number, t: any) => s + (t.priceChange24h || 0), 0) / stats.length) : '0.00%'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#475569', fontSize: 13 }}>{k}</span>
                <span className="mono" style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ErrorBoundary>
  )
}

export default TokenStats