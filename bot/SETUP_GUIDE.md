# Arbitrage Bot Setup Guide

## Overview
This is a Uniswap V3 arbitrage bot that monitors price differences between Uniswap V3 and Sushiswap V2 to find profitable arbitrage opportunities.

## Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- An Ethereum wallet with a private key
- Access to an Ethereum node (Infura, Alchemy, or direct node)

## Installation Steps

### 1. Install Node.js
If you don't have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Or use a version manager like nvm

### 2. Install Project Dependencies
```bash
cd ArbitrageBot
npm install
```

### 3. Configure Environment Variables
Edit the `.env` file with your configuration:

```bash
# Ethereum RPC URL for mainnet fork
STAGENET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Contract Addresses (Mainnet)
ARBITRAGE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
UNISWAP_V3_QUOTER=0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6
SUSHISWAP_V2_ROUTER=0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F

# Token Addresses (Mainnet)
WETH_ADDRESS=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
DAI_ADDRESS=0x6B175474E89094C44Da98b954EedeAC495271d0F

# Private Key for the bot wallet (use a dedicated wallet with minimal funds)
PRIVATE_KEY=your_private_key_here
```

### 4. Get Required Services

#### Infura Project ID
1. Go to [infura.io](https://infura.io/)
2. Create a free account
3. Create a new Ethereum project
4. Copy the Project ID and replace `YOUR_INFURA_PROJECT_ID` in the .env file

#### Private Key
1. Create a new Ethereum wallet (MetaMask, etc.)
2. Export the private key
3. **IMPORTANT**: Only use a wallet with minimal funds for testing
4. Replace `your_private_key_here` in the .env file

### 5. Deploy the Smart Contract
Before running the bot, you need to deploy the arbitrage contract:

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

This will deploy the contract to the local hardhat network for testing.

### 6. Run the Bot

#### Test Mode (Recommended First)
```bash
node bot/test.js
```
This will test the Uniswap V3 quote functionality.

#### Full Bot
```bash
node bot/index.js
```
The bot will start monitoring blocks and looking for arbitrage opportunities.

## Understanding the Bot

### How It Works
1. **Block Monitoring**: The bot listens for new Ethereum blocks
2. **Price Quoting**: For each block, it gets quotes for WETH→DAI on Uniswap V3
3. **Arbitrage Calculation**: It calculates if selling the DAI back to WETH on Sushiswap V2 would be profitable
4. **Execution**: If profitable, it executes the arbitrage trade

### Profit Calculation
```
Input: 0.0002 WETH
Step 1: WETH → DAI on Uniswap V3 (fee: 0.05%)
Step 2: DAI → WETH on Sushiswap V2
Profit = Final WETH - Initial WETH
```

### Example Output
```
[Block #23232851]
  Trade Path: WETH -> DAI (Uniswap) -> WETH (Sushiswap)
  0.0002 WETH -> 0.925062046729720159 DAI -> 0.000199011907983822 WETH
  No profitable opportunity found.
```

## Testing

### Smart Contract Tests
```bash
npx hardhat test
```

### Unit Tests
The test suite includes:
- Contract deployment tests
- Access control tests
- Arbitrage execution tests
- Profit calculation tests
- Withdraw functionality tests

## Important Notes

### Security
- **Use minimal funds** for testing
- **Never use your main wallet private key**
- The contract includes slippage protection (0.5%)
- Always test on a testnet before mainnet

### Gas Costs
- Arbitrage trades require gas fees
- The bot includes a gas limit of 1,000,000
- Profit must exceed gas costs to be worthwhile

### Network Requirements
- The bot uses mainnet fork for testing
- Requires access to real Uniswap V3 and Sushiswap V2 contracts
- Uses WETH/DAI pair for arbitrage

## Troubleshooting

### Common Issues
1. **"npm not recognized"**: Install Node.js
2. **"Contract not deployed"**: Run the deployment script first
3. **"RPC URL invalid"**: Check your Infura project ID
4. **"No profitable opportunities"**: This is normal - arbitrage opportunities are rare

### Debug Mode
Add console.log statements to `bot/index.js` to see detailed execution flow.

## Next Steps
1. Test thoroughly on testnet
2. Monitor gas prices
3. Consider adding more token pairs
4. Implement risk management
5. Add monitoring and alerting

## Disclaimer
This is a proof-of-concept and not production-ready. Real arbitrage requires:
- Low-latency connections
- Sophisticated risk management
- Substantial capital
- Professional infrastructure