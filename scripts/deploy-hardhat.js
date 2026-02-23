const hre = require("hardhat");

async function main() {
  console.log(" Starting deployment on Hardhat network...");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy ERC20 Mock tokens
  const ERC20Mock = await hre.ethers.getContractFactory("ERC20Mock");
  
  const tokenA = await ERC20Mock.deploy("Mock USDC", "USDC");
  await tokenA.deployed();
  console.log(" Token A deployed:", tokenA.address);

  const tokenB = await ERC20Mock.deploy("Mock DAI", "DAI");
  await tokenB.deployed();
  console.log(" Token B deployed:", tokenB.address);

  // Deploy Mock Routers
  const UniswapV3RouterMock = await hre.ethers.getContractFactory("UniswapV3RouterMock");
  const uniswapRouter = await UniswapV3RouterMock.deploy();
  await uniswapRouter.deployed();
  console.log(" Uniswap Router deployed:", uniswapRouter.address);

  const UniswapV2RouterMock = await hre.ethers.getContractFactory("UniswapV2RouterMock");
  const sushiswapRouter = await UniswapV2RouterMock.deploy();
  await sushiswapRouter.deployed();
  console.log(" Sushiswap Router deployed:", sushiswapRouter.address);

  // Deploy Arbitrage Contract
  const Arbitrage = await hre.ethers.getContractFactory("Arbitrage");
  const arbitrage = await Arbitrage.deploy(uniswapRouter.address, sushiswapRouter.address);
  await arbitrage.deployed();
  console.log(" Arbitrage Contract deployed:", arbitrage.address);

  console.log("\n Deployment completed!");
  console.log("\n Contract Addresses:");
  console.log("Token A:", tokenA.address);
  console.log("Token B:", tokenB.address);
  console.log("Uniswap Router:", uniswapRouter.address);
  console.log("Sushiswap Router:", sushiswapRouter.address);
  console.log("Arbitrage:", arbitrage.address);
}

main().catch((error) => {
  console.error(" Deployment failed:", error);
  process.exit(1);
});