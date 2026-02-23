import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ProfitLossDataPoint } from '../../types'

interface ProfitLossChartProps {
  data: ProfitLossDataPoint[]
}

const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data }) => {
  const chartData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp).toLocaleDateString(),
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              })}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
        <Bar dataKey="loss" fill="#ef4444" name="Loss" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
          name="Net"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ProfitLossChart