import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizes = { sm: 16, md: 24, lg: 36 }

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
    <div
      className="spinner"
      style={{ width: sizes[size], height: sizes[size] }}
    />
    {text && (
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{text}</p>
    )}
  </div>
)

export default LoadingSpinner