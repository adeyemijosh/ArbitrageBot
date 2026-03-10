import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout: React.FC = () => {
  const location = useLocation()
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')
  const showSidebar = isWorkspaceRoute && currentWorkspace

  const containerRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 30 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div ref={containerRef} style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>

      {/* Ambient cursor glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 60% 50% at ${glowPos.x}% ${glowPos.y}%, rgba(59,130,246,0.04), transparent)`,
        transition: 'background 0.4s ease',
      }} />

      {/* Grid texture */}
      <div className="grid-texture" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      {showSidebar && (
        <div style={{ width: 220, flexShrink: 0, position: 'relative', zIndex: 10 }}>
          <Sidebar />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout