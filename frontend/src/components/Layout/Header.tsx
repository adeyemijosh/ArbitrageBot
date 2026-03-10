import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import ThemeToggle from '../Common/ThemeToggle'

const Header: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo + workspace */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '-0.05em',
              flexShrink: 0,
            }}>AB</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
              ArbitrageBot
            </span>
          </Link>

          <span style={{
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.3)',
            color: '#00ff88',
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 20,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88', display: 'inline-block' }} />
            LIVE
          </span>

          {isWorkspaceRoute && currentWorkspace && (
            <span style={{
              color: 'var(--text-muted)',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              paddingLeft: 8,
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}>
              {currentWorkspace.name}
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 2 }}>
          {[
            { label: 'Dashboard', to: '/' },
            ...(isWorkspaceRoute && currentWorkspace ? [
              { label: 'Overview', to: `/workspace/${currentWorkspace.id}/overview` },
              { label: 'Transactions', to: `/workspace/${currentWorkspace.id}/transactions` },
              { label: 'Assets', to: `/workspace/${currentWorkspace.id}/assets` },
            ] : []),
          ].map(({ label, to }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link key={label} to={to} style={{
                background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: 'none',
                color: active ? '#f1f5f9' : '#475569',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.color = '#94a3b8' }}
                onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.color = '#475569' }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
            Settings
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>U</div>
        </div>
      </div>
    </header>
  )
}

export default Header