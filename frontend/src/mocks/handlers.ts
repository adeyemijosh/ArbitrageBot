import { rest } from 'msw'
import {
  Workspace,
  WorkspaceOverview,
  Wallet,
  Transaction,
  TokenBalance,
  TVLDataPoint,
  PerformanceDataPoint,
  ProfitLossDataPoint,
  ProfitLossMetrics,
  PaginatedResponse,
  ApiResponse,
} from '../types'

// Mock data
const mockWorkspaces: Workspace[] = [
  {
      id: 'wallet-1',
      name: 'Main Wallet',
      type: 'wallet',
      address: '0x742d35Cc6634C0532925a3b8D',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T15:45:00Z',
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
  {
      id: 'contract-1',
      name: 'Arbitrage Contract',
      type: 'contract',
      address: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      createdAt: '2024-01-10T08:15:00Z',
      updatedAt: '2024-01-19T12:30:00Z',
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
  address: '0x742d35Cc6634C0532925a3b8D',
  nativeTokenBalance: '10.5',
  tvl: 45230.50,
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
    from: '0x742d35Cc6634C0532925a3b8D',
    to: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    value: '1000000000000000000',
    gasUsed: '21000',
    gasPrice: '20000000000',
    timestamp: '2024-01-20T15:45:00Z',
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
  rest.get('/api/workspaces', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: Workspace[]) => any }) => {
    return res(ctx.json(mockWorkspaces))
  }),

  rest.get('/api/workspaces/:workspaceId', (req: { params: { workspaceId: any } }, res: (arg0: any, arg1: undefined) => any, ctx: { status: (arg0: number) => any; json: (arg0: Workspace) => any }) => {
    const { workspaceId } = req.params
    const workspace = mockWorkspaces.find(w => w.id === workspaceId)
    if (!workspace) {
      return res(ctx.status(404), ctx.json({} as Workspace))
    }
    return res(ctx.json(workspace))
  }),

  rest.get('/api/workspaces/:workspaceId/overview', (req: { params: { workspaceId: string } }, res: (arg0: any) => any, ctx: { json: (arg0: WorkspaceOverview) => any }) => {
    const overview: WorkspaceOverview = {
      workspaceId: req.params.workspaceId as string,
      nativeTokenBalance: '10.5',
      tvl: 45230.50,
      gasConsumption: 1500,
      transactionCount: 156,
      lastUpdated: new Date().toISOString(),
    }
    return res(ctx.json(overview))
  }),

  // Wallet endpoints
  rest.get('/api/wallets/:walletAddress', (_: any, res: any, ctx: any) => {
    return res(ctx.json(mockWallet))
  }),

  rest.get('/api/wallets/:walletAddress/balances', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: TokenBalance[]) => any }) => {
    return res(ctx.json(mockWallet.balances))
  }),

  rest.get('/api/wallets/:walletAddress/analytics/profit-loss', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: ProfitLossMetrics) => any }) => {
    return res(ctx.json(mockProfitLossMetrics))
  }),

  // Transaction endpoints
  rest.get('/api/wallets/:walletAddress/transactions', (req: { url: { searchParams: { get: (arg0: string) => any } } }, res: (arg0: any) => any, ctx: { json: (arg0: PaginatedResponse<Transaction>) => any }) => {
    const page = parseInt(req.url.searchParams.get('page') || '1')
    const limit = parseInt(req.url.searchParams.get('limit') || '50')
    
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
    return res(ctx.json(paginatedResponse))
  }),

  // Chart data endpoints
  rest.get('/api/wallets/:walletAddress/charts/tvl', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: TVLDataPoint[]) => any }) => {
    return res(ctx.json(mockTVLData))
  }),

  rest.get('/api/wallets/:walletAddress/charts/performance', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: PerformanceDataPoint[]) => any }) => {
    return res(ctx.json(mockPerformanceData))
  }),

  rest.get('/api/wallets/:walletAddress/charts/profit-loss', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: ProfitLossDataPoint[]) => any }) => {
    return res(ctx.json(mockProfitLossData))
  }),

  // Project tokens management
  rest.post('/api/wallets/:walletAddress/project-tokens', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: { success: boolean; data: TokenBalance }) => any }) => {
    return res(ctx.json({
      success: true,
      data: mockWallet.balances[0],
    }))
  }),

  rest.delete('/api/wallets/:walletAddress/project-tokens/:tokenAddress', (req: any, res: (arg0: any) => any, ctx: { json: (arg0: { success: boolean; message: string }) => any }) => {
    return res(ctx.json({
      success: true,
      message: 'Token removed successfully',
    }))
  }),
]