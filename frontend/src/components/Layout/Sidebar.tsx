import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const navItems = [
  { name: 'Overview',      href: 'overview',      icon: '◈' },
  { name: 'Transactions',  href: 'transactions',  icon: '⇄' },
  { name: 'Assets',        href: 'assets',        icon: '◆' },
  { name: 'Data Tracking', href: 'data-tracking', icon: '▲' },
  { name: 'Source Code',   href: 'source-code',   icon: '⌘' },
  { name: 'History',       href: 'history',       icon: '◷' },
  { name: 'Token Stats',   href: 'token-stats',   icon: '◉' },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)

  if (!currentWorkspace) return null

  return (
    <div style={{
      height: '100%',
      background: 'rgba(8,8,16,0.9)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Workspace info */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: currentWorkspace.type === 'wallet'
              ? 'rgba(59,130,246,0.15)'
              : 'rgba(0,255,136,0.1)',
            border: currentWorkspace.type === 'wallet'
              ? '1px solid rgba(59,130,246,0.3)'
              : '1px solid rgba(0,255,136,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            {currentWorkspace.type === 'wallet' ? '◆' : '⬡'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, color: '#f1f5f9',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {currentWorkspace.name}
            </p>
            <span className={`badge ${currentWorkspace.type === 'wallet' ? 'badge-blue' : 'badge-green'}`}>
              {currentWorkspace.type}
            </span>
          </div>
        </div>

        <p style={{
          fontSize: 10, color: '#374151', fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {currentWorkspace.address}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = location.pathname.includes(item.href)
          return (
            <Link key={item.name} to={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 8,
              marginBottom: 2,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              color: active ? '#f1f5f9' : '#475569',
              background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
              borderRight: active ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                  ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#475569'
                }
              }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0, color: active ? '#6366f1' : '#374151' }}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ fontSize: 10, color: '#374151', fontFamily: 'var(--font-mono)' }}>
          ID: {currentWorkspace.id}
        </p>
        <p style={{ fontSize: 10, color: '#374151', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
          Created: {new Date(currentWorkspace.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default Sidebar