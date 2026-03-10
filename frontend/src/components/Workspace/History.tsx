import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetTVLDataQuery, useGetProfitLossDataQuery, useGetTransactionsQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const typeColor: Record<string, string> = {
  tvl: '#3b82f6', profit: '#00ff88', transactions: '#a855f7',
}
const typeBg: Record<string, string> = {
  tvl: 'rgba(59,130,246,0.1)', profit: 'rgba(0,255,136,0.08)', transactions: 'rgba(168,85,247,0.1)',
}

const History: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [dataType, setDataType] = useState<'all' | 'tvl' | 'profit' | 'transactions'>('all')

  const { data: tvlData, isLoading: tvlLoading, error: tvlError } = useGetTVLDataQuery(
    { walletAddress: workspaceId, type: 'tvl', timeRange, interval: '1h' } as any,
    { skip: !workspaceId || (dataType !== 'all' && dataType !== 'tvl') }
  )
  const { data: profitData, isLoading: profitLoading, error: profitError } = useGetProfitLossDataQuery(
    { walletAddress: workspaceId, type: 'profit-loss', timeRange, interval: '1h' } as any,
    { skip: !workspaceId || (dataType !== 'all' && dataType !== 'profit') }
  )
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useGetTransactionsQuery(
    { walletAddress: workspaceId, page: 1, limit: 100 },
    { skip: !workspaceId || (dataType !== 'all' && dataType !== 'transactions') }
  )

  const historicalData = useMemo(() => {
    const data: any[] = []
    if (tvlData) data.push(...(tvlData as any[]).map(p => ({ id: `tvl-${p.timestamp}`, timestamp: new Date(p.timestamp).toISOString(), type: 'tvl', value: p.tvl, metadata: { usdValue: p.usdValue } })))
    if (profitData) data.push(...(profitData as any[]).map(p => ({ id: `profit-${p.timestamp}`, timestamp: new Date(p.timestamp).toISOString(), type: 'profit', value: p.netProfit, metadata: { profit: p.profit, loss: p.loss } })))
    if ((transactionsData as any)?.data) data.push(...(transactionsData as any).data.map((tx: any) => ({ id: tx.hash, timestamp: tx.timestamp, type: 'transactions', value: 1, metadata: { hash: tx.hash } })))
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [tvlData, profitData, transactionsData])

  const isLoading = tvlLoading || profitLoading || transactionsLoading
  const hasError = tvlError || profitError || transactionsError

  const fmt = (v: number, type: string) => (type === 'tvl' || type === 'profit') ? `$${v.toLocaleString()}` : v.toLocaleString()

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view history.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Controls */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              { label: 'Time Range', value: timeRange, setter: setTimeRange, options: [['1h','Last Hour'],['24h','Last 24h'],['7d','7 Days'],['30d','30 Days']] },
              { label: 'Data Type', value: dataType, setter: setDataType, options: [['all','All Data'],['tvl','TVL'],['profit','Profit'],['transactions','Transactions']] },
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

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Records', value: historicalData.length, accent: '#3b82f6', icon: '◈' },
            {
              label: 'Date Range',
              value: historicalData.length > 0
                ? `${new Date(historicalData[historicalData.length - 1].timestamp).toLocaleDateString()} → ${new Date(historicalData[0].timestamp).toLocaleDateString()}`
                : 'N/A',
              accent: '#00ff88', icon: '◷',
            },
            { label: 'Update Frequency', value: 'Real-time', accent: '#a855f7', icon: '⚡' },
          ].map(({ label, value, accent, icon }) => (
            <div key={label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 90, height: 90, pointerEvents: 'none', background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)` }} />
              <p className="section-label" style={{ marginBottom: 8 }}>{label}</p>
              <p style={{ color: '#f1f5f9', fontSize: typeof value === 'string' && value.includes('→') ? 13 : 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Historical Data</p>
          {isLoading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading historical data..." />
            </div>
          ) : hasError ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading historical data</p>
          ) : historicalData.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="dark-table">
                <thead>
                  <tr>{['Timestamp', 'Type', 'Value', 'Change', 'Metadata'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {historicalData.map((record, i) => {
                    const prev = i > 0 ? historicalData[i - 1].value : record.value
                    const change = record.value - prev
                    const changePct = prev !== 0 ? (change / Math.abs(prev)) * 100 : 0
                    return (
                      <tr key={record.id}>
                        <td className="mono" style={{ fontSize: 11 }}>{new Date(record.timestamp).toLocaleString()}</td>
                        <td>
                          <span style={{
                            display: 'inline-flex', padding: '2px 10px', borderRadius: 20, fontSize: 10,
                            fontFamily: 'var(--font-mono)', background: typeBg[record.type], color: typeColor[record.type],
                            border: `1px solid ${typeColor[record.type]}30`,
                          }}>{record.type}</span>
                        </td>
                        <td className="mono" style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 600 }}>{fmt(record.value, record.type)}</td>
                        <td>
                          <span className="mono" style={{ color: change >= 0 ? '#00ff88' : '#ef4444', fontSize: 11 }}>
                            {change >= 0 ? '+' : ''}{fmt(change, record.type)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="mono" style={{ color: '#374151', fontSize: 10 }}>{record.metadata ? JSON.stringify(record.metadata) : 'N/A'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#374151', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No historical data found for the selected filters</p>
            </div>
          )}
        </div>

        {/* Export */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Export Options</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" style={{ fontSize: 13 }}>Export CSV</button>
            <button className="btn-secondary" style={{ fontSize: 13 }}>Export JSON</button>
            <button className="btn-secondary" style={{ fontSize: 13 }}>Generate Report</button>
          </div>
        </div>

      </div>
    </ErrorBoundary>
  )
}

export default History