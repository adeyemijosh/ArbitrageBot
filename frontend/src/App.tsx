import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard'
import Workspace from './components/Workspace/Workspace'
import Overview from './components/Workspace/Overview'
import Transactions from './components/Workspace/Transactions'
import Assets from './components/Workspace/Assets'
import DataTracking from './components/Workspace/DataTracking'
import SourceCode from './components/Workspace/SourceCode'
import History from './components/Workspace/History'
import TokenStats from './components/Workspace/TokenStats'
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/Common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="workspace/:workspaceId" element={<Workspace />}>
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="assets" element={<Assets />} />
              <Route path="data-tracking" element={<DataTracking />} />
              <Route path="source-code" element={<SourceCode />} />
              <Route path="history" element={<History />} />
              <Route path="token-stats" element={<TokenStats />} />
            </Route>
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App