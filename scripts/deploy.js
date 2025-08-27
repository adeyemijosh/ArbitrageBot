const { ethers } = require("hardhat");

async function main() {
    // Get signer and network
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log("Deploying Arbitrage Contract...");
    console.log("Deploying with account:", deployer.address);
    console.log("Network:", network.name, "(Chain ID:", network.chainId + ")");

    // Get balance and check sufficiency
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    const minBalance = ethers.parseEther("0.0002");
    if (balance < minBalance) {
        throw new Error(`Insufficient balance. Need at least ${ethers.formatEther(minBalance)} ETH`);
    }

    // Load router addresses from environment
    const UNISWAP_V3_ROUTER = process.env.UNISWAP_V3_ROUTER;
    const SUSHISWAP_V2_ROUTER = process.env.SUSHISWAP_V2_ROUTER;

    if (!UNISWAP_V3_ROUTER || !SUSHISWAP_V2_ROUTER) {
        throw new Error("Router addresses not found in .env file");
    }

    console.log("Using routers:");
    console.log("   Uniswap V3:", UNISWAP_V3_ROUTER);
    console.log("   SushiSwap V2:", SUSHISWAP_V2_ROUTER);

    // Deploy contract
    console.log("Deploying contract...");
    const Arbitrage = await ethers.getContractFactory("Arbitrage");

    // Deploy with gas settings for local networks
    const txOverrides = {
        gasLimit: 8000000,
        gasPrice: (network.name === "hardhat" || network.name === "localhost") ?
            ethers.parseUnits('50', 'gwei') :
            undefined
    };

    const arbitrage = await Arbitrage.deploy(
        UNISWAP_V3_ROUTER,
        SUSHISWAP_V2_ROUTER,
        txOverrides
    );

    // Wait for deployment
    await arbitrage.waitForDeployment();
    const contractAddress = await arbitrage.getAddress();

    // Get transaction receipt
    const deploymentTx = arbitrage.deploymentTransaction();
    const receipt = await deploymentTx.wait();

    console.log("Deployment successful!");
    console.log("Contract address:", contractAddress);
    console.log("Transaction hash:", receipt.hash);
    console.log("Gas used:", receipt.gasUsed.toString());

    // Display contract details
    console.log("\nContract Details:");
    console.log("Owner:", await arbitrage.owner());
    console.log("Uniswap Router:", await arbitrage.uniswapRouter());
    console.log("Sushiswap Router:", await arbitrage.sushiswapRouter());

    // Save deployment info - Convert BigInt values to strings for JSON serialization
    const deploymentInfo = {
        network: network.name,
        chainId: network.chainId.toString(),
        contractAddress: contractAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        txHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        routers: {
            uniswap: UNISWAP_V3_ROUTER,
            sushiswap: SUSHISWAP_V2_ROUTER
        }
    };

    console.log("\nDeployment info:", JSON.stringify(deploymentInfo, null, 2));

    // Display verification command for real networks
    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log("\n Verify contract:");
        console.log(`npx hardhat verify --network ${network.name} ${contractAddress} "${UNISWAP_V3_ROUTER}" "${SUSHISWAP_V2_ROUTER}"`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });