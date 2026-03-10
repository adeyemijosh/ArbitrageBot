import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspacesQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const metricColor: Record<string, string> = {
  price: '#3b82f6', volume: '#00ff88', liquidity: '#a855f7', profit: '#f59e0b',
}
const metricBg: Record<string, string> = {
  price: 'rgba(59,130,246,0.1)', volume: 'rgba(0,255,136,0.08)', liquidity: 'rgba(168,85,247,0.1)', profit: 'rgba(245,158,11,0.1)',
}

const DataTracking: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [metricType, setMetricType] = useState<'all' | 'price' | 'volume' | 'liquidity' | 'profit'>('all')
  const [newDataPoint, setNewDataPoint] = useState({ metricType: 'price', value: '', metadata: '{}' })

  const { data: dataPoints, isLoading, error } = useGetWorkspacesQuery(undefined, {
    skip: !workspaceId, pollingInterval: 10000,
  })

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view data tracking.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Controls */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Time Range</p>
              <select className="dark-select" value={timeRange} onChange={e => setTimeRange(e.target.value as any)}>
                {[['1h','Last Hour'],['24h','Last 24h'],['7d','7 Days'],['30d','30 Days']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Metric Type</p>
              <select className="dark-select" value={metricType} onChange={e => setMetricType(e.target.value as any)}>
                {[['all','All Metrics'],['price','Price'],['volume','Volume'],['liquidity','Liquidity'],['profit','Profit']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Add Data Point */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Add Custom Data Point</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Metric Type</p>
              <select className="dark-select" value={newDataPoint.metricType}
                onChange={e => setNewDataPoint(p => ({ ...p, metricType: e.target.value }))}>
                {['price','volume','liquidity','profit'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Value</p>
              <input className="dark-input" type="number" value={newDataPoint.value}
                onChange={e => setNewDataPoint(p => ({ ...p, value: e.target.value }))}
                placeholder="Enter value" />
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Metadata (JSON)</p>
              <input className="dark-input" type="text" value={newDataPoint.metadata}
                onChange={e => setNewDataPoint(p => ({ ...p, metadata: e.target.value }))}
                placeholder='{"key": "value"}' />
            </div>
          </div>
          <button className="btn-primary" style={{ fontSize: 13 }}>
            + Add Data Point
          </button>
        </div>

        {/* Data Points */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Data Points</p>
          {isLoading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading data points..." />
            </div>
          ) : error ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading data points</p>
          ) : (dataPoints as any[])?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="dark-table">
                <thead>
                  <tr>{['Time','Type','Value','Metadata','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {(dataPoints as any[]).map((point: any) => (
                    <tr key={point.id}>
                      <td className="mono" style={{ fontSize: 11 }}>{new Date(point.timestamp).toLocaleString()}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', padding: '2px 10px', borderRadius: 20, fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          background: metricBg[point.metricType] || 'rgba(255,255,255,0.05)',
                          color: metricColor[point.metricType] || '#94a3b8',
                          border: `1px solid ${metricColor[point.metricType] || '#374151'}30`,
                        }}>{point.metricType}</span>
                      </td>
                      <td className="mono" style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 600 }}>
                        {point.value?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className="mono" style={{ color: '#374151', fontSize: 10 }}>{JSON.stringify(point.metadata)}</td>
                      <td>
                        <button className="btn-danger">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#374151', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No data points found for the selected filters</p>
            </div>
          )}
        </div>

      </div>
    </ErrorBoundary>
  )
}

export default DataTracking