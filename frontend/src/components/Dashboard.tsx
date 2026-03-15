import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Workspace } from '../types'
import TVLChart from './Charts/TVLChart'
import ProfitLossChart from './Charts/ProfitLossChart'

// ── Mock chart data (replace with real Redux selectors when available) ───────
const mockTVLData = Array.from({ length: 48 }, (_, i) => ({
  timestamp: Date.now() - (47 - i) * 1800000,
  tvl: 2000000 + Math.sin(i * 0.3) * 200000 + Math.random() * 50000 + i * 2000,
  usdValue: 2000000 + Math.sin(i * 0.3) * 200000 + Math.random() * 50000 + i * 2000,
}))

const mockProfitLoss = Array.from({ length: 14 }, (_, i) => ({
  timestamp: Date.now() - (13 - i) * 86400000,
  profit: Math.random() * 800 + 200,
  loss: Math.random() * 300 + 50,
  netProfit: Math.random() * 500 - 80,
}))

const mockActivity = [
  { icon: '◈', color: '#00ff88', label: 'Arbitrage Opportunity Found', sub: 'WETH/DAI pair · Profit: 0.015 ETH', time: '2m ago' },
  { icon: '▲', color: '#3b82f6', label: 'TVL Update', sub: 'Total Value Locked: $2.09M', time: '15m ago' },
  { icon: '⬡', color: '#a855f7', label: 'Contract Deployment', sub: 'New arbitrage contract deployed', time: '1h ago' },
  { icon: '◈', color: '#00ff88', label: 'Arbitrage Executed', sub: 'USDC/ETH · Profit: 0.008 ETH', time: '2h ago' },
  { icon: '▼', color: '#ef4444', label: 'Gas Spike Detected', sub: 'Paused operations — 245 gwei', time: '3h ago' },
]

// ── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  change?: string
  changePositive?: boolean
  icon: string
  accent: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, changePositive, icon, accent }) => (
  <div className="card" style={{ flex: 1, overflow: 'hidden' }}>
    {/* Glow corner */}
    <div style={{
      position: 'absolute', top: 0, right: 0, width: 120, height: 120, pointerEvents: 'none',
      background: `radial-gradient(circle at top right, ${accent}18, transparent 70%)`,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p className="section-label" style={{ marginBottom: 8 }}>{label}</p>
        <p style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </p>
        {change && (
          <p style={{
            color: changePositive === false ? '#ef4444' : '#00ff88',
            fontSize: 11, marginTop: 6, fontFamily: 'var(--font-mono)',
          }}>{change}</p>
        )}
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: `${accent}18`, border: `1px solid ${accent}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, color: accent,
      }}>{icon}</div>
    </div>
  </div>
)

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { workspaces } = useSelector((state: RootState) => state.workspace)
  const [timeRange, setTimeRange] = React.useState<'24h' | '7d' | '30d'>('24h')

  const mockWorkspaces: Workspace[] = [
    {
      id: 'wallet-1', name: 'Main Wallet', type: 'wallet',
      address: '0x742d35Cc6634C0532925a3b8D',
      createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T15:45:00Z',
      timestamp: '', value: undefined, metadata: undefined,
      priceChange24h: undefined, symbol: undefined, volume: 0,
      price: undefined, marketCap: undefined, liquidity: undefined,
    },
  ]

  const displayWorkspaces = workspaces.length > 0 ? workspaces : mockWorkspaces

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
            Monitor your arbitrage operations and workspace performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            ↻ Refresh
          </button>
          <button className="btn-primary">
            + Add Workspace
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatCard label="Total TVL" value="$2.09M" change="+12.5% (24h)" icon="◈" accent="#3b82f6" />
        <StatCard label="Total Profit" value="$2,150.75" change="+8.3% (24h)" icon="▲" accent="#00ff88" />
        <StatCard label="Active Workspaces" value={String(displayWorkspaces.length)} change="Real-time monitoring" icon="⬡" accent="#a855f7" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* TVL Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>TVL Over Time</p>
              <p className="mono" style={{ color: '#374151', fontSize: 11, marginTop: 2 }}>Total Value Locked</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['24h', '7d', '30d'] as const).map(r => (
                <button key={r} onClick={() => setTimeRange(r)} style={{
                  background: timeRange === r ? 'rgba(59,130,246,0.15)' : 'transparent',
                  border: timeRange === r ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
                  color: timeRange === r ? '#3b82f6' : '#475569',
                  padding: '3px 10px', borderRadius: 6,
                  fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  transition: 'all 0.15s',
                }}>{r}</button>
              ))}
            </div>
          </div>
          <TVLChart data={mockTVLData} height={200} />
        </div>

        {/* P&L Chart */}
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Profit / Loss</p>
            <p className="mono" style={{ color: '#374151', fontSize: 11, marginTop: 2 }}>Daily breakdown + net trend</p>
          </div>
          <ProfitLossChart data={mockProfitLoss} height={200} />
        </div>
      </div>

      {/* Workspaces + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Workspaces */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Your Workspaces</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {displayWorkspaces.map(ws => (
              <Link key={ws.id} to={`/workspace/${ws.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{ws.name}</span>
                        <span className={`badge ${ws.type === 'wallet' ? 'badge-blue' : 'badge-green'}`}>
                          {ws.type}
                        </span>
                      </div>
                      <p className="mono" style={{ color: '#374151', fontSize: 10 }}>
                        {ws.address.slice(0, 22)}…
                      </p>
                      <p className="mono" style={{ color: '#374151', fontSize: 10, marginTop: 4 }}>
                        Updated {new Date(ws.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ color: '#374151', fontSize: 16 }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Recent Activity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mockActivity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 10px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${item.color}14`, border: `1px solid ${item.color}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, fontSize: 13,
                }}>{item.icon}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{item.label}</p>
                  <p className="mono" style={{
                    fontSize: 10, color: '#475569', margin: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{item.sub}</p>
                </div>

                <span className="mono" style={{ fontSize: 10, color: '#374151', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard