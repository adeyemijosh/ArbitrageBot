import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspacesQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const visibilityColor: Record<string, string> = {
  public: '#3b82f6', external: '#00ff88', private: '#ef4444', internal: '#f59e0b',
}

const SourceCode: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''

  const [selectedMethod, setSelectedMethod] = useState('')
  const [methodParams, setMethodParams] = useState('')
  const [senderAddress, setSenderAddress] = useState('')

  const { data: contractSource, isLoading, error } = useGetWorkspacesQuery(undefined, {
    skip: !workspaceId || currentWorkspace?.type !== 'contract',
  })

  const source = contractSource as any

  if (!currentWorkspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>Please select a workspace to view source code.</p>
      </div>
    )
  }

  if (currentWorkspace.type !== 'contract') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Contract Workspaces Only</p>
        <p style={{ color: '#475569', fontSize: 13 }}>This view is only available for contract workspaces.</p>
        <p className="mono" style={{ color: '#374151', fontSize: 11, marginTop: 6 }}>Current type: {currentWorkspace.type}</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Contract Info */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Contract Information</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Contract Address</p>
              <p className="mono" style={{ color: '#6366f1', fontSize: 12, wordBreak: 'break-all' }}>{currentWorkspace.address}</p>
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Contract Type</p>
              <span className="badge badge-green">{currentWorkspace.type}</span>
            </div>
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Contract Interaction</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Method</p>
              <select className="dark-select" value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)} style={{ width: '100%' }}>
                <option value="">Select a method</option>
                {source?.methods?.map((m: any) => (
                  <option key={m.name} value={m.name}>{m.name} ({m.visibility})</option>
                ))}
              </select>
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Parameters (JSON)</p>
              <input className="dark-input" type="text" value={methodParams}
                onChange={e => setMethodParams(e.target.value)} placeholder='["param1", "param2"]' />
            </div>
            <div>
              <p className="section-label" style={{ marginBottom: 6 }}>Sender Address (optional)</p>
              <input className="dark-input" type="text" value={senderAddress}
                onChange={e => setSenderAddress(e.target.value)} placeholder="0x..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" disabled={!selectedMethod} style={{ fontSize: 13 }}>Execute Method</button>
            <button className="btn-secondary" style={{ fontSize: 13 }}>View ABI</button>
            <button className="btn-secondary" style={{ fontSize: 13 }}>View Bytecode</button>
          </div>
        </div>

        {/* Source Code */}
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Source Code</p>
          {isLoading ? (
            <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" text="Loading contract source..." />
            </div>
          ) : error ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error loading contract source</p>
          ) : source ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Metadata */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Contract Metadata</p>
                <div style={{ display: 'flex', gap: 32 }}>
                  {[['Name', source.name], ['Compiler', source.compilerVersion], ['Optimization', source.optimization ? 'Enabled' : 'Disabled']].map(([k, v]) => (
                    <div key={k}>
                      <p className="section-label">{k}</p>
                      <p className="mono" style={{ color: '#f1f5f9', fontSize: 12, marginTop: 3 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods */}
              {source.methods?.length > 0 && (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Contract Methods</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {source.methods.map((method: any) => (
                      <div key={method.name} style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 8, padding: 10,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{method.name}</span>
                          <span style={{
                            padding: '1px 8px', borderRadius: 20, fontSize: 9,
                            fontFamily: 'var(--font-mono)',
                            background: `${visibilityColor[method.visibility] || '#374151'}18`,
                            color: visibilityColor[method.visibility] || '#94a3b8',
                            border: `1px solid ${visibilityColor[method.visibility] || '#374151'}30`,
                          }}>{method.visibility}</span>
                        </div>
                        <p className="mono" style={{ fontSize: 10, color: method.stateMutability === 'view' || method.stateMutability === 'pure' ? '#00ff88' : '#3b82f6' }}>
                          {method.stateMutability}
                        </p>
                        {method.parameters?.length > 0 && (
                          <p className="mono" style={{ fontSize: 10, color: '#374151', marginTop: 3 }}>
                            {method.parameters.map((p: any) => p.type).join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Solidity Source</p>
                <div style={{
                  background: '#0a0a14', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: 16, maxHeight: 360, overflow: 'auto',
                }}>
                  <pre className="mono" style={{ fontSize: 11, color: '#94a3b8', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {source.sourceCode || 'Source code not available'}
                  </pre>
                </div>
              </div>

              {/* ABI */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>ABI</p>
                <div style={{
                  background: '#0a0a14', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: 16, maxHeight: 220, overflow: 'auto',
                }}>
                  <pre className="mono" style={{ fontSize: 11, color: '#6366f1', margin: 0 }}>
                    {JSON.stringify(source.abi, null, 2)}
                  </pre>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#374151', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No contract source available</p>
            </div>
          )}
        </div>

      </div>
    </ErrorBoundary>
  )
}

export default SourceCode