import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetTransactionsQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const statusColor: Record<string, string> = {
  success: '#00ff88', failed: '#ef4444', pending: '#f59e0b',
}
const statusBg: Record<string, string> = {
  success: 'rgba(0,255,136,0.1)', failed: 'rgba(239,68,68,0.1)', pending: 'rgba(245,158,11,0.1)',
}
const typeIcon: Record<string, string> = {
  arbitrage: '◈', deposit: '▼', withdrawal: '▲', incoming: '▼', outgoing: '▲', contract_call: '⌘',
}

const Transactions: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const walletAddress = currentWorkspace?.address || ''

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [transactionType, setTransactionType] = useState<'all' | 'arbitrage' | 'deposit' | 'withdrawal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all')

  const { data: transactions, isLoading, error } = useGetTransactionsQuery(
    { walletAddress, timeRange, transactionType, status: statusFilter } as any,
    { skip: !walletAddress, pollingInterval: 30000 }
  )

  const txList = (transactions as any)?.data || transactions || []
  const successCount = txList.filter((t: any) => t.status === 'success').length
  const failedCount = txList.filter((t: any) => t.status === 'failed').length
  const successRate = txList.length > 0 ? Math.round((successCount / txList.length) * 100) : 0

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view transactions.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Filters */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
            {[
              { label: 'Time Range', value: timeRange, setter: setTimeRange, options: [['1h','Last Hour'],['24h','Last 24h'],['7d','Last 7 Days'],['30d','Last 30 Days']] },
              { label: 'Type', value: transactionType, setter: setTransactionType, options: [['all','All Types'],['arbitrage','Arbitrage'],['deposit','Deposit'],['withdrawal','Withdrawal']] },
              { label: 'Status', value: statusFilter, setter: setStatusFilter, options: [['all','All Status'],['success','Success'],['failed','Failed'],['pending','Pending']] },
            ].map(({ label, value, setter, options }) => (
              <div key={label}>
                <p className="section-label" style={{ marginBottom: 6 }}>{label}</p>
                <select className="dark-select" value={value} onChange={e => (setter as any)(e.target.value)}>
                  {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total', value: txList.length, accent: '#3b82f6', icon: '◈' },
            { label: 'Successful', value: successCount, accent: '#00ff88', icon: '✓' },
            { label: 'Failed', value: failedCount, accent: '#ef4444', icon: '✗' },
            { label: 'Success Rate', value: `${successRate}%`, accent: '#a855f7', icon: '◉' },
          ].map(({ label, value, accent, icon }) => (
            <div key={label} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, pointerEvents: 'none', background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)` }} />
              <p className="section-label" style={{ marginBottom: 6 }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: accent, letterSpacing: '-0.02em' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Transaction History</p>
          {isLoading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading transactions..." />
            </div>
          ) : error ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading transactions</p>
          ) : txList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="dark-table">
                <thead>
                  <tr>
                    {['Time', 'Type', 'Amount', 'Token', 'Status', 'Hash'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txList.map((tx: any) => (
                    <tr key={tx.hash}>
                      <td className="mono" style={{ fontSize: 11 }}>{new Date(tx.timestamp).toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#6366f1', fontSize: 12 }}>{typeIcon[tx.type] || '◈'}</span>
                          <span style={{ color: '#94a3b8', fontSize: 12, textTransform: 'capitalize' }}>{tx.type}</span>
                        </div>
                      </td>
                      <td className="mono" style={{ color: '#f1f5f9', fontSize: 12 }}>
                        {Number(tx.amount || tx.value || 0).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="mono" style={{ color: '#94a3b8', fontSize: 12 }}>{tx.tokenSymbol || 'ETH'}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 10px', borderRadius: 20, fontSize: 11,
                          fontFamily: 'var(--font-mono)',
                          background: statusBg[tx.status] || 'rgba(255,255,255,0.05)',
                          color: statusColor[tx.status] || '#94a3b8',
                          border: `1px solid ${statusColor[tx.status] || '#374151'}30`,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[tx.status] || '#374151', display: 'inline-block' }} />
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
                          className="mono" style={{ color: '#3b82f6', fontSize: 11, textDecoration: 'none' }}
                          onMouseEnter={e => (e.target as HTMLElement).style.textDecoration = 'underline'}
                          onMouseLeave={e => (e.target as HTMLElement).style.textDecoration = 'none'}
                        >
                          {tx.hash?.slice(0, 10)}…
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#374151', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No transactions found for the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Transactions