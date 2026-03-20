// @ts-nocheck
import { http } from 'msw'
import {
  Workspace,
  WorkspaceOverview,
  Wallet,
  Transaction,
  TVLDataPoint,
  PerformanceDataPoint,
  ProfitLossDataPoint,
  ProfitLossMetrics,
  PaginatedResponse,

} from '../types'

// Mock data
const mockWorkspaces: Workspace[] = [
  {
      id: 'wallet-1',
      name: 'Main Wallet',
      type: 'wallet',
      address: '0xd88b53878abf92ab95564c3adff8bfd4a8647d7b',
      createdAt: '2026-03-19T10:30:00Z',
      updatedAt: '2026-03-19T15:45:00Z',
      timestamp: '',
      value: undefined,
      metadata: undefined,
      priceChange24h: undefined,
      symbol: undefined,
      volume: 0,
      price: undefined,
      marketCap: undefined,
      liquidity: undefined
  },
]

const mockWallet: Wallet = {
  address: '0xd88b53878abf92ab95564c3adff8bfd4a8647d7b',
  nativeTokenBalance: '1000',
  tvl: 2190000,
  transactions: [],
  balances: [
    {
      tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      balance: '1000000000000000000000',
      usdValue: 1000,
      price: 1.0,
    },
    {
      tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      balance: '5000000000000000000',
      usdValue: 15000,
      price: 3000.0,
    },
  ],
}

const mockTransactions: Transaction[] = [
  {
    hash: '0x1234567890abcdef',
    from: '0xd88b53878abf92ab95564c3adff8bfd4a8647d7b',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '1000000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T15:36:01Z',
    status: 'success',
    type: 'outgoing',
  },
  {
    hash: '0xabcdef1234567890',
    from: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    to: '0x742d35Cc6634C0532925a3b8D',
    value: '2000000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T14:36:01Z',
    status: 'success',
    type: 'incoming',
  },
  {
    hash: '0x1111111111111111',
    from: '0x742d35Cc6634C0532925a3b8D',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '500000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T13:36:01Z',
    status: 'success',
    type: 'outgoing',
  },
  {
    hash: '0x2222222222222222',
    from: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    to: '0x742d35Cc6634C0532925a3b8D',
    value: '1500000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T12:36:01Z',
    status: 'success',
    type: 'incoming',
  },
  {
    hash: '0x3333333333333333',
    from: '0x742d35Cc6634C0532925a3b8D',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '800000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T11:36:01Z',
    status: 'success',
    type: 'outgoing',
  },
  {
    hash: '0x4444444444444444',
    from: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    to: '0x742d35Cc6634C0532925a3b8D',
    value: '2200000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T10:36:01Z',
    status: 'success',
    type: 'incoming',
  },
  {
    hash: '0x5555555555555555',
    from: '0x742d35Cc6634C0532925a3b8D',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '1200000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T09:36:01Z',
    status: 'success',
    type: 'outgoing',
  },
  {
    hash: '0x6666666666666666',
    from: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    to: '0x742d35Cc6634C0532925a3b8D',
    value: '1800000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T08:36:01Z',
    status: 'success',
    type: 'incoming',
  },
  {
    hash: '0x7777777777777777',
    from: '0x742d35Cc6634C0532925a3b8D',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '600000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T07:36:01Z',
    status: 'success',
    type: 'outgoing',
  },
  {
    hash: '0x8888888888888888',
    from: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    to: '0x742d35Cc6634C0532925a3b8D',
    value: '1600000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T06:36:01Z',
    status: 'success',
    type: 'incoming',
  },
  {
    hash: '0x9999999999999999',
    from: '0x742d35Cc6634C0532925a3b8D',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '900000000000000000',
    gasUsed: '4436885',
    gasPrice: '20000000000',
    timestamp: '2026-03-19T05:36:01Z',
    status: 'success',
    type: 'outgoing',
  },
]

const mockTVLData: TVLDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - (23 - i) * 60 * 60 * 1000,
  tvl: 40000 + Math.random() * 10000,
  usdValue: 40000 + Math.random() * 10000,
}))

const mockPerformanceData: PerformanceDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - (23 - i) * 60 * 60 * 1000,
  roi: (Math.random() - 0.5) * 20,
  totalProfit: 1000 + Math.random() * 2000,
  totalLoss: 500 + Math.random() * 1000,
}))

const mockProfitLossData: ProfitLossDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - (23 - i) * 60 * 60 * 1000,
  profit: Math.random() * 100,
  loss: Math.random() * 50,
  netProfit: Math.random() * 50,
}))

const mockProfitLossMetrics: ProfitLossMetrics = {
  totalProfit: 2150.75,
  totalLoss: 500.25,
  netProfit: 1650.50,
  roi: 12.5,
  winRate: 75.0,
  averageProfit: 150.25,
  averageLoss: 75.10,
}

export const handlers = [
  // Workspace endpoints
  http.get('/api/workspaces', () => {
    return Response.json(mockWorkspaces)
  }),

  http.get('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params
    const workspace = mockWorkspaces.find(w => w.id === workspaceId)
    if (!workspace) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }
    return Response.json(workspace)
  }),

  http.get('/api/workspaces/:workspaceId/overview', ({ params }) => {
    const overview: WorkspaceOverview = {
      workspaceId: params.workspaceId as string,
      nativeTokenBalance: '1000',
      tvl: 2190000,
      gasConsumption: 4436885,
      transactionCount: 11,
      lastUpdated: '2026-03-19T15:36:01Z',
    }
    return Response.json(overview)
  }),

  // Wallet endpoints
  http.get('/api/wallets/:walletAddress', () => {
    return Response.json(mockWallet)
  }),

  http.get('/api/wallets/:walletAddress/balances', () => {
    return Response.json(mockWallet.balances)
  }),

  http.get('/api/wallets/:walletAddress/analytics/profit-loss', () => {
    return Response.json(mockProfitLossMetrics)
  }),

  // Transaction endpoints
  http.get('/api/wallets/:walletAddress/transactions', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const paginatedResponse: PaginatedResponse<Transaction> = {
      data: mockTransactions,
      success: true,
      pagination: {
        page,
        limit,
        total: mockTransactions.length,
        totalPages: Math.ceil(mockTransactions.length / limit),
      },
    }
    return Response.json(paginatedResponse)
  }),

  // Chart data endpoints
  http.get('/api/wallets/:walletAddress/charts/tvl', () => {
    return Response.json(mockTVLData)
  }),

  http.get('/api/wallets/:walletAddress/charts/performance', () => {
    return Response.json(mockPerformanceData)
  }),

  http.get('/api/wallets/:walletAddress/charts/profit-loss', () => {
    return Response.json(mockProfitLossData)
  }),

  // Project tokens management
  http.post('/api/wallets/:walletAddress/project-tokens', () => {
    return Response.json({
      success: true,
      data: mockWallet.balances[0],
    })
  }),

  http.delete('/api/wallets/:walletAddress/project-tokens/:tokenAddress', () => {
    return Response.json({
      success: true,
      message: 'Token removed successfully',
    })
  }),
]