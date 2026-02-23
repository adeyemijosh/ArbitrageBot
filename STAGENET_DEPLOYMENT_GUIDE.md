# Stagenet Deployment Guide

This guide will help you deploy your ArbitrageBot contracts to the stagenet environment.

## Prerequisites

1. **Node.js and npm** installed
2. **Hardhat** configured (already set up in your project)
3. **Stagenet RPC URL** configured in `.env` file
4. **Private key** with stagenet ETH for deployment

## Environment Configuration

Your `.env` file should contain the following stagenet configuration:

```env
# Ethereum RPC URL for stagenet
STAGENET_RPC_URL=https://rpc.contract.dev/01b56ca07173fe8a417bbfdadde936f7

# Private Key for the bot wallet (use a dedicated wallet with minimal funds)
PRIVATE_KEY=your_private_key_here
```

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Verify Stagenet Configuration

Check your `hardhat.config.js` to ensure stagenet network is configured:

```javascript
stagenet: {
    type: "http",
    chainType: "l1",
    url: process.env.STAGENET_RPC_URL || "https://rpc.contract.dev/3bf1bb611043d73921481c879e5d18fa",
    accounts: [
        process.env.PRIVATE_KEY || "0x227e704e2958c63eafbeb303d1a486b768ad2651121bc59b66ee30fd1000e2c8"
    ]
}
```

### 3. Fund Your Stagenet Wallet

Ensure your deployment wallet has stagenet ETH. You can get stagenet ETH from:
- Stagenet faucets
- Your stagenet provider's test fund system

### 4. Deploy to Stagenet

Run the deployment script targeting the stagenet network:

```bash
npx hardhat run scripts/deploy.js --network stagenet
```

## What Gets Deployed

The deployment script will deploy the following contracts:

1. **Token A (Mock USDC)** - ERC20 mock token
2. **Token B (Mock DAI)** - ERC20 mock token  
3. **Uniswap V3 Router Mock** - Mock router for testing
4. **Sushiswap Router Mock** - Mock router for testing
5. **Arbitrage Contract** - Main arbitrage contract

## Post-Deployment Setup

After successful deployment, you'll receive contract addresses. Use these to configure your bot:

```javascript
// In your bot configuration
const config = {
  arbitrageContract: "0xYourArbitrageContractAddress",
  tokenA: "0xYourTokenAAddress",
  tokenB: "0xYourTokenBAddress",
  uniswapRouter: "0xYourUniswapRouterAddress",
  sushiswapRouter: "0xYourSushiswapRouterAddress"
};
```

## Testing the Deployment

1. **Verify Contract Addresses**: Ensure all contracts deployed successfully
2. **Check Token Balances**: Verify initial token distributions
3. **Test Approvals**: Confirm token approvals are set correctly
4. **Run Bot Tests**: Test your arbitrage bot with the deployed contracts

## Troubleshooting

### Common Issues

1. **Insufficient Funds**: Ensure your wallet has stagenet ETH
2. **Network Connection**: Verify your RPC URL is working
3. **Contract Verification**: Skip verification on stagenet (not necessary)

### Error Messages

- **"Account balance: Unable to fetch"**: Check network connection and RPC URL
- **"Deployment failed"**: Check private key and network configuration
- **"Contract verification failed"**: Normal on stagenet, deployment still successful

## Security Notes

1. **Use Test Funds Only**: Never use real funds on stagenet
2. **Secure Private Keys**: Store private keys securely
3. **Verify Contracts**: Double-check contract addresses before use
4. **Test Thoroughly**: Test all functionality before production deployment

## Next Steps

1. Configure your bot with the deployed contract addresses
2. Test arbitrage strategies on stagenet
3. Monitor contract interactions and gas usage
4. Optimize parameters based on stagenet testing
5. Prepare for mainnet deployment when ready

## Support

If you encounter issues:
1. Check the deployment logs for error details
2. Verify your `.env` configuration
3. Ensure network connectivity
4. Consult the Hardhat documentation for network-specific issues