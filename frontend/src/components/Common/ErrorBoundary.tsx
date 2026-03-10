import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    console.error('ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}>
          <div style={{
            maxWidth: 400, width: '100%',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 16, padding: 28,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, margin: '0 auto 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>⚠</div>

            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', textAlign: 'center', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 20 }}>
              An unexpected error occurred. Please refresh the page.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => window.location.reload()}>
                Refresh Page
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => this.setState({ hasError: false })}>
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Error Details
                </summary>
                <pre style={{
                  marginTop: 8, fontSize: 10, color: '#ef4444',
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)',
                  borderRadius: 8, padding: 10, overflow: 'auto', maxHeight: 120,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary