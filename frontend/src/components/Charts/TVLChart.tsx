import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TVLDataPoint } from '../../types'

interface TVLChartProps {
  data: TVLDataPoint[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

const TVLTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const ts = payload[0]?.payload?.timestamp
  return (
    <div style={{
      background: 'rgba(8,8,16,0.95)',
      border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 10,
      padding: '10px 14px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#475569', fontSize: 10, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
        {ts ? new Date(ts).toLocaleString() : ''}
      </p>
      <p style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
        ${payload[0]?.value?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </p>
      {payload[1] && (
        <p style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          USD: ${payload[1]?.value?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </p>
      )}
    </div>
  )
}

const TVLChart: React.FC<TVLChartProps> = ({ data, height = 400, showGrid = true }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        No TVL data available
      </div>
    )
  }

  const values = data.map(d => d.tvl)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = (maxValue - minValue) * 0.12

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="60%" stopColor="#3b82f6" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="tvlLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
        )}

        <XAxis
          dataKey="timestamp"
          tickFormatter={(ts) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          stroke="transparent"
          tick={{ fill: '#374151', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          interval={Math.floor(data.length / 6)}
        />

        <YAxis
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
          stroke="transparent"
          tick={{ fill: '#374151', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          domain={[minValue - padding, maxValue + padding]}
          width={52}
        />

        <Tooltip content={<TVLTooltip />} />

        {/* Min / Max reference lines */}
        <ReferenceLine
          y={minValue}
          stroke="rgba(239,68,68,0.35)"
          strokeDasharray="4 4"
          label={{ value: `Low $${(minValue / 1000).toFixed(1)}K`, position: 'insideTopRight', fill: '#ef4444', fontSize: 9, fontFamily: 'var(--font-mono)' }}
        />
        <ReferenceLine
          y={maxValue}
          stroke="rgba(0,255,136,0.35)"
          strokeDasharray="4 4"
          label={{ value: `High $${(maxValue / 1000).toFixed(1)}K`, position: 'insideTopRight', fill: '#00ff88', fontSize: 9, fontFamily: 'var(--font-mono)' }}
        />

        <Area
          type="monotone"
          dataKey="tvl"
          stroke="url(#tvlLine)"
          strokeWidth={2}
          fill="url(#tvlGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6', stroke: '#080810', strokeWidth: 2 }}
          name="TVL"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default TVLChart