import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetWorkspacesQuery } from '../../store/api/workspaceApi'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorBoundary from '../Common/ErrorBoundary'

const SourceCode: React.FC = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace)
  const workspaceId = currentWorkspace?.id || ''
  
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [methodParams, setMethodParams] = useState<string>('')
  const [senderAddress, setSenderAddress] = useState<string>('')

  const { data: contractSource, isLoading, error } = useGetWorkspacesQuery(undefined, {
    skip: !workspaceId || currentWorkspace.type !== 'contract'
  })

  const [interactWithContract, { isLoading: interacting }] = useGetWorkspacesQuery

  const handleContractInteraction = async () => {
    if (!workspaceId || !selectedMethod) return

    try {
      await interactWithContract({
        workspaceId,
        method: selectedMethod,
        params: methodParams ? JSON.parse(methodParams) : [],
        sender: senderAddress || undefined
      }).unwrap()
    } catch (error) {
      console.error('Failed to interact with contract:', error)
    }
  }

  if (!currentWorkspace) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">Please select a workspace to view source code.</p>
      </div>
    )
  }

  if (currentWorkspace.type !== 'contract') {
    return (
      <div className="card">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Source Code View</h3>
          <p className="text-gray-600">This view is only available for contract workspaces.</p>
          <p className="text-sm text-gray-500 mt-2">Selected workspace type: {currentWorkspace.type}</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Contract Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Contract Address</h4>
              <p className="text-sm text-gray-900 font-mono">{currentWorkspace.address}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Contract Type</h4>
              <p className="text-sm text-gray-900 capitalize">{currentWorkspace.type}</p>
            </div>
          </div>
        </div>

        {/* Contract Interaction Panel */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Interaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Select a method</option>
                {contractSource?.methods?.map((method) => (
                  <option key={method.name} value={method.name}>
                    {method.name} ({method.visibility})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parameters (JSON)</label>
              <input
                type="text"
                value={methodParams}
                onChange={(e) => setMethodParams(e.target.value)}
                placeholder='["param1", "param2"]'
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sender Address (Optional)</label>
              <input
                type="text"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="0x..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleContractInteraction}
              disabled={interacting || !selectedMethod}
              className="btn-primary"
            >
              {interacting ? 'Interacting...' : 'Execute Method'}
            </button>
            <button className="btn-secondary">
              View ABI
            </button>
            <button className="btn-secondary">
              View Bytecode
            </button>
          </div>
        </div>

        {/* Source Code Display */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Code</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" text="Loading contract source..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading contract source
            </div>
          ) : contractSource ? (
            <div className="space-y-6">
              {/* Contract Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Contract Metadata</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{contractSource.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Compiler:</span>
                    <span className="ml-2 font-medium">{contractSource.compilerVersion}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Optimization:</span>
                    <span className="ml-2 font-medium">{contractSource.optimization ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>

              {/* Methods List */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contract Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {contractSource.methods?.map((method) => (
                    <div key={method.name} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sm font-medium text-gray-900">
                            {method.name}
                          </span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded ${
                            method.visibility === 'public' ? 'bg-blue-100 text-blue-800' :
                            method.visibility === 'external' ? 'bg-green-100 text-green-800' :
                            method.visibility === 'private' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {method.visibility}
                          </span>
                        </div>
                        <span className={`text-xs ${
                          method.stateMutability === 'view' || method.stateMutability === 'pure' 
                            ? 'text-green-600' 
                            : 'text-blue-600'
                        }`}>
                          {method.stateMutability}
                        </span>
                      </div>
                      {method.parameters && method.parameters.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          Params: {method.parameters.map(p => p.type).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Code */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Source Code</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-100 overflow-auto max-h-96">
                    {contractSource.sourceCode || 'Source code not available'}
                  </pre>
                </div>
              </div>

              {/* ABI */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">ABI</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-100 overflow-auto max-h-64">
                    {JSON.stringify(contractSource.abi, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No contract source available.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default SourceCode