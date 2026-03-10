import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { ProfitLossDataPoint } from '../../types'

interface ProfitLossChartProps {
  data: ProfitLossDataPoint[]
  height?: number
}

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(8,8,16,0.96)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '10px 14px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
    }}>
      <p style={{ color: '#475569', fontSize: 10, marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color, fontSize: 12, margin: '2px 0', fontFamily: 'var(--font-mono)' }}>
          {entry.name}:{' '}
          {typeof entry.value === 'number'
            ? entry.value < 0
              ? `-$${Math.abs(entry.value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
              : `$${entry.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
            : entry.value}
        </p>
      ))}
    </div>
  )
}

const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data, height = 300 }) => {
  const chartData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    lossDisplay: -Math.abs(point.loss),
  }))

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        No profit/loss data available
      </div>
    )
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="profitBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="lossBar" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

          <XAxis
            dataKey="date"
            stroke="transparent"
            tick={{ fill: '#374151', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            interval={1}
          />

          <YAxis
            tickFormatter={(v) => `$${Math.abs(v / 1000).toFixed(1)}K`}
            stroke="transparent"
            tick={{ fill: '#374151', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            width={48}
          />

          <Tooltip content={<DarkTooltip />} />

          <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />

          <Bar dataKey="profit" fill="url(#profitBar)" name="Profit" radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="lossDisplay" fill="url(#lossBar)" name="Loss" radius={[0, 0, 3, 3]} maxBarSize={18} />
          <Line
            type="monotone"
            dataKey="netProfit"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            name="Net"
            activeDot={{ r: 4, fill: '#6366f1', stroke: '#080810', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, paddingLeft: 4, marginTop: 8 }}>
        {[['Profit', '#00ff88'], ['Loss', '#ef4444'], ['Net', '#6366f1']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            <span style={{ color: '#475569', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default ProfitLossChart