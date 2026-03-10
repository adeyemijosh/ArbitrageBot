import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspaceOverviewQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const MetricCard = ({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: string; accent: string }) => (
  <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: 0, right: 0, width: 100, height: 100, pointerEvents: 'none',
      background: `radial-gradient(circle at top right, ${accent}18, transparent 70%)`,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p className="section-label" style={{ marginBottom: 8 }}>{label}</p>
        <p style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
        <p className="mono" style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>{sub}</p>
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `${accent}18`, border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: accent,
      }}>{icon}</div>
    </div>
  </div>
)

const Overview: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''

  const { data: overview, isLoading, error } = useGetWorkspaceOverviewQuery(workspaceId, {
    skip: !workspaceId,
    pollingInterval: 60000,
  })

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view overview.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Metric Cards */}
        {isLoading ? (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
            <LoadingSpinner size="md" text="Loading overview..." />
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <p style={{ color: '#ef4444', fontSize: 13, fontFamily: 'var(--font-mono)' }}>Error loading overview data</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <MetricCard label="Native Token Balance" value={overview?.nativeTokenBalance || '0.00'} sub="ETH or native token" icon="◆" accent="#a855f7" />
            <MetricCard label="Total Value Locked" value={`$${overview?.tvl?.toLocaleString() || '0'}`} sub="Real-time TVL" icon="◈" accent="#3b82f6" />
            <MetricCard label="Gas Consumption" value={overview?.gasConsumption?.toLocaleString() || '0'} sub="Gas units used" icon="⛽" accent="#f59e0b" />
            <MetricCard label="Transactions" value={overview?.transactionCount?.toLocaleString() || '0'} sub="Total count" icon="⇄" accent="#00ff88" />
          </div>
        )}

        {/* Contract Panel */}
        {currentWorkspace.type === 'contract' && (
          <div className="card">
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Contract Panel</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Activity', desc: 'View transaction activity and contract interactions over time.', accent: '#3b82f6', icon: '▲' },
                { label: 'Interact', desc: 'Call contract methods with optional sender impersonation.', accent: '#a855f7', icon: '⌘' },
                { label: 'KPIs', desc: 'View current values of data tracked in the Data Tracking system.', accent: '#00ff88', icon: '◉' },
              ].map(({ label, desc, accent, icon }) => (
                <div key={label} style={{
                  background: `${accent}08`,
                  border: `1px solid ${accent}20`,
                  borderRadius: 12, padding: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: accent, fontSize: 14 }}>{icon}</span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{label}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 12, lineHeight: 1.5 }}>{desc}</p>
                  <button className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>
                    View {label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Workspace Info</p>
            {[
              ['Name', currentWorkspace.name],
              ['Type', currentWorkspace.type],
              ['Address', currentWorkspace.address],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#475569', fontSize: 12 }}>{k}</span>
                <span className="mono" style={{ color: '#94a3b8', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Timestamps</p>
            {[
              ['Created', new Date(currentWorkspace.createdAt).toLocaleString()],
              ['Updated', new Date(currentWorkspace.updatedAt).toLocaleString()],
              ['Last Synced', overview?.lastUpdated ? new Date(overview.lastUpdated).toLocaleString() : 'N/A'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#475569', fontSize: 12 }}>{k}</span>
                <span className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Status</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { dot: '#00ff88', label: 'Live Data', pulse: true },
              { dot: '#3b82f6', label: 'WebSocket Connected' },
              { dot: '#a855f7', label: 'API Healthy' },
            ].map(({ dot, label, pulse }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className={pulse ? 'live-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: dot, boxShadow: `0 0 6px ${dot}` }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ErrorBoundary>
  )
}

export default Overview