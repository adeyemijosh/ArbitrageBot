# Arbitrage Bot

A comprehensive arbitrage bot system featuring smart contract execution, real-time price monitoring, and an enhanced modern frontend dashboard. This project provides a complete solution for automated arbitrage trading with professional UI/UX design.

## Features

### Core System
- **Arbitrage Smart Contract**: A Solidity contract (`contracts/Arbitrage.sol`) that can execute a flash swap-like arbitrage between two tokens on Uniswap V3.
- **Price Monitoring Bot**: A Node.js script (`bot/index.js`) that listens for new blocks, fetches prices from a Uniswap V3 pool, and calculates quotes.
- **Hardhat Environment**: The project is set up with Hardhat for smart contract development, testing, and deployment.
- **Comprehensive Testing**: Includes test files for both the smart contract and the backend.

### Frontend Dashboard
- **Modern UI Design**: Professional container styling with improved visual separation and modern design elements
- **Real-time Workspace Management**: Create, manage, and switch between multiple workspaces
- **Live Analytics**: Real-time TVL tracking, profit/loss charts, and performance metrics
- **Interactive Charts**: Zoom, pan, and hover functionality for detailed data analysis
- **Responsive Design**: Mobile-first responsive UI built with Tailwind CSS
- **Multi-chain Support**: Support for different blockchain networks and contract types

## Project Structure

```
.
├── contracts
│   ├── Arbitrage.sol
│   └── ... (mock contracts for testing)
├── scripts
│   └── deploy.js
├── test
│   └── Arbitrage.test.js
├── bot
│   ├── index.js
│   └── abis.js
|    └── test.js
├── .env.example
├── hardhat.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A text editor (e.g., VS Code)
- An Ethereum wallet with a private key
- An Infura project ID or access to an Ethereum node

### Installation

1. **Clone the repository:**
   ```bash
   git clone 
   cd uniswap-v3-arbitrage-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file by copying the example: `cp .env.example .env`
   - Edit the `.env` file and add your Infura project ID and private key.

### Running the Bot

To start the price monitoring bot:

```bash
node bot/index.js
```

The bot will start listening for new blocks and printing price quotes to the console.

### Smart Contract Development

**Compile the contracts:**

```bash
npx hardhat compile
```

**Run the tests:**

```bash
npx hardhat test
```

**Deploy the contract:**

First, edit the `scripts/deploy.js` file to configure the Uniswap router address for your target network. Then, run:

```bash
npx hardhat run scripts/deploy.js --network <your-network>
```
```OUTPUT
[Block #23232851]
  Trade Path: WETH -> DAI (Uniswap) -> WETH (Sushiswap)
  0.0002 WETH -> 0.925062046729720159 DAI -> 0.000199011907983822 WETH
  No profitable opportunity found.

[Block #23232852]
  Trade Path: WETH -> DAI (Uniswap) -> WETH (Sushiswap)
  0.0002 WETH -> 0.925062046729720159 DAI -> 0.000199011907983822 WETH
  No profitable opportunity found.

[Block #23232853]
  Trade Path: WETH -> DAI (Uniswap) -> WETH (Sushiswap)
  0.0002 WETH -> 0.925062046729720159 DAI -> 0.000199011907983822 WETH
  No profitable opportunity found.
```

## Disclaimer

This is a Mvp. currently working on more features 
