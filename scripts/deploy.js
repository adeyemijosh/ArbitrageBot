const hre = require("hardhat");

async function main() {
  console.log(" Starting deployment...");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("=".repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  try {
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  } catch (error) {
    console.log("  Account balance: Unable to fetch (possibly no funds or network issue)");
  }

  // Deploy ERC20 Mock tokens
  console.log("\n Deploying ERC20 Mock tokens...");
  
  const ERC20Mock = await hre.ethers.getContractFactory("ERC20Mock");
  
  const tokenA = await ERC20Mock.deploy("Mock USDC", "USDC");
  await tokenA.waitForDeployment();
  console.log("   Token A (USDC) deployed:", await tokenA.getAddress());

  const tokenB = await ERC20Mock.deploy("Mock DAI", "DAI");
  await tokenB.waitForDeployment();
  console.log("   Token B (DAI) deployed:", await tokenB.getAddress());

  // Deploy Mock Routers
  console.log("\n  Deploying Mock Routers...");

  const UniswapV3RouterMock = await hre.ethers.getContractFactory("UniswapV3RouterMock");
  const uniswapRouter = await UniswapV3RouterMock.deploy();
  await uniswapRouter.waitForDeployment();
  console.log("   Uniswap V3 Router Mock deployed:", await uniswapRouter.getAddress());

  const UniswapV2RouterMock = await hre.ethers.getContractFactory("UniswapV2RouterMock");
  const sushiswapRouter = await UniswapV2RouterMock.deploy();
  await sushiswapRouter.waitForDeployment();
  console.log("   Sushiswap Router Mock deployed:", await sushiswapRouter.getAddress());

  // Deploy Arbitrage Contract
  console.log("\n  Deploying Arbitrage Contract...");
  
  const Arbitrage = await hre.ethers.getContractFactory("Arbitrage");
  const arbitrage = await Arbitrage.deploy(
    await uniswapRouter.getAddress(),
    await sushiswapRouter.getAddress()
  );
  await arbitrage.waitForDeployment();
  console.log("   Arbitrage contract deployed:", await arbitrage.getAddress());

  // Set up initial token balances
  console.log("\n  Setting up initial balances...");
  
  const initialAmount = hre.ethers.parseUnits("10000", 18);
  const arbitrageAddress = await arbitrage.getAddress();
  
  await tokenA.transfer(arbitrageAddress, initialAmount);
  console.log("   Transferred 10,000 Token A to arbitrage contract");
  
  await tokenB.transfer(arbitrageAddress, initialAmount);
  console.log("   Transferred 10,000 Token B to arbitrage contract");

  await tokenA.transfer(deployer.address, initialAmount);
  console.log("   Transferred 10,000 Token A to deployer");
  
  await tokenB.transfer(deployer.address, initialAmount);
  console.log("   Transferred 10,000 Token B to deployer");

  // Approve tokens
  console.log("\n  Approving tokens for arbitrage contract...");
  
  await tokenA.approve(arbitrageAddress, hre.ethers.MaxUint256);
  console.log("   Token A approved for arbitrage contract");
  
  await tokenB.approve(arbitrageAddress, hre.ethers.MaxUint256);
  console.log("   Token B approved for arbitrage contract");

  const tokenAAddress = await tokenA.getAddress();
  const tokenBAddress = await tokenB.getAddress();
  const uniswapAddress = await uniswapRouter.getAddress();
  const sushiswapAddress = await sushiswapRouter.getAddress();

  console.log("\n All contracts deployed successfully!");
  console.log("\n Deployment Summary:");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("=".repeat(60));
  console.log("Token A (USDC):", tokenAAddress);
  console.log("Token B (DAI):", tokenBAddress);
  console.log("Uniswap V3 Router:", uniswapAddress);
  console.log("Sushiswap Router:", sushiswapAddress);
  console.log("Arbitrage Contract:", arbitrageAddress);
  console.log("=".repeat(60));

  if (hre.network.name === "stagenet") {
    console.log("\n Stagenet deployment completed successfully!");
    console.log("   - All contracts are deployed and configured");
    console.log("   - Initial balances set up for testing");
    console.log("   - Tokens approved for arbitrage operations");
  }

  console.log("\n Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(" Deployment failed:", error);
    process.exit(1);
  });