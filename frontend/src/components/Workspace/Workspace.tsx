import React from 'react'
import { useParams, Outlet } from 'react-router-dom'
import { useGetWorkspaceQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const Workspace: React.FC = () => {
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, error } = useGetWorkspaceQuery(workspaceId || '', { skip: !workspaceId })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <LoadingSpinner size="lg" text="Loading workspace..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Workspace Not Found</p>
        <p style={{ color: '#475569', fontSize: 13 }}>This workspace doesn't exist or you don't have access.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Workspace Header */}
        {workspace && (
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 200, height: 200, pointerEvents: 'none',
              background: workspace.type === 'wallet'
                ? 'radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 70%)'
                : 'radial-gradient(circle at top right, rgba(0,255,136,0.06), transparent 70%)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: workspace.type === 'wallet' ? 'rgba(59,130,246,0.15)' : 'rgba(0,255,136,0.1)',
                  border: workspace.type === 'wallet' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(0,255,136,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {workspace.type === 'wallet' ? '◆' : '⬡'}
                </div>
                <div>
                  <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 4 }}>
                    {workspace.name}
                  </h1>
                  <p className="mono" style={{ color: '#475569', fontSize: 11 }}>{workspace.address}</p>
                  <span className={`badge ${workspace.type === 'wallet' ? 'badge-blue' : 'badge-green'}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                    {workspace.type}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="section-label">Created</p>
                <p className="mono" style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Child routes render here */}
        <Outlet />
      </div>
    </ErrorBoundary>
  )
}

export default Workspace