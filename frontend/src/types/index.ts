// Workspace Types
import { ReactNode } from 'react';

export interface Workspace {
  timestamp: string | number | Date;
  value: any;
  metadata: any;
  priceChange24h: any;
  symbol: ReactNode;
  volume: number;
  price: any;
  marketCap: any;
  liquidity: any;
  id: string;
  name: string;
  type: 'contract' | 'wallet';
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceOverview {
  workspaceId: string;
  nativeTokenBalance: string;
  tvl: number;
  gasConsumption: number;
  transactionCount: number;
  lastUpdated: string;
}

// Wallet Types
export interface Wallet {
  address: string;
  nativeTokenBalance: string;
  tvl: number;
  transactions: Transaction[];
  balances: TokenBalance[];
}

export interface TokenBalance {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  usdValue: number;
  price: number;
}

// Transaction Types
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: string;
  status: 'success' | 'failed';
  type: 'incoming' | 'outgoing' | 'contract_call';
  description?: string;
}

// Chart Types
export interface TVLDataPoint {
  timestamp: number;
  tvl: number;
  usdValue: number;
}

export interface PerformanceDataPoint {
  timestamp: number;
  roi: number;
  totalProfit: number;
  totalLoss: number;
}

export interface ProfitLossDataPoint {
  timestamp: number;
  profit: number;
  loss: number;
  netProfit: number;
}

export interface ProfitLossMetrics {
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  roi: number;
  winRate: number;
  averageProfit: number;
  averageLoss: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  timestamp: number;
  data: any;
}

export interface TVLUpdateEvent extends WebSocketEvent {
  type: 'tvl_update';
  workspaceId: string;
  tvl: number;
  usdValue: number;
}

export interface ProfitUpdateEvent extends WebSocketEvent {
  type: 'profit_update';
  workspaceId: string;
  profit: number;
  loss: number;
  netProfit: number;
}

export interface TransactionUpdateEvent extends WebSocketEvent {
  type: 'transaction_update';
  walletAddress: string;
  transaction: Transaction;
}

// Configuration Types
export interface AppConfig {
  stagenetApiUrl: string;
  stagenetWebSocketUrl: string;
  walletAddress: string;
  updateInterval: number;
}

// Historical Data Types
export interface HistoricalRecord {
  id: string;
  timestamp: string;
  type: 'tvl' | 'profit' | 'transactions';
  value: number;
  metadata?: Record<string, any>;
}

// Chart Configuration
export interface ChartConfig {
  timeRange: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  interval: '1m' | '5m' | '15m' | '1h' | '1d';
  showGrid: boolean;
  showLegend: boolean;
  animationDuration: number;
}
