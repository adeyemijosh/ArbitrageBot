import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TVLDataPoint } from '../../types'

interface TVLChartProps {
  data: TVLDataPoint[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

const TVLChart: React.FC<TVLChartProps> = ({
  data,
  height = 400,
  showGrid = true,
  showLegend = true,
}) => {
  // Calculate min and max values for better Y-axis scaling
  const minValue = Math.min(...data.map(d => d.tvl))
  const maxValue = Math.max(...data.map(d => d.tvl))
  const range = maxValue - minValue
  const padding = range * 0.1

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  const formatTooltip = (value: number) => {
    return [`$${value.toLocaleString()}`, 'TVL']
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          stroke="#6b7280"
          fontSize={12}
        />
        
        <YAxis
          tickFormatter={formatYAxis}
          stroke="#6b7280"
          fontSize={12}
          domain={[minValue - padding, maxValue + padding]}
        />
        
        <Tooltip
          labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        )}

        {/* TVL Line */}
        <Line
          type="monotone"
          dataKey="tvl"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2 }}
        />

        {/* Reference lines for min/max */}
        {data.length > 0 && (
          <>
            <ReferenceLine
              y={minValue}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{
                value: `Min: $${minValue.toLocaleString()}`,
                position: 'insideTopRight',
                fill: '#ef4444',
                fontSize: 12,
              }}
            />
            <ReferenceLine
              y={maxValue}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: `Max: $${maxValue.toLocaleString()}`,
                position: 'insideTopRight',
                fill: '#10b981',
                fontSize: 12,
              }}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TVLChart