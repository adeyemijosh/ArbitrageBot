require("dotenv").config();
const { ethers } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Route } = require("@uniswap/v3-sdk");
const { Pair, Route: RouteV2 } = require("@uniswap/v2-sdk");
const IUniswapV2PairABI = require("@uniswap/v2-core/build/IUniswapV2Pair.json").abi;

const {
    IUniswapV3PoolABI,
    ArbitrageABI,
} = require("./abis");

// --- CONFIGURATION ---
const ARBITRAGE_CONTRACT_ADDRESS = process.env.ARBITRAGE_CONTRACT_ADDRESS;
const UNISWAP_V3_QUOTER = process.env.UNISWAP_V3_QUOTER;
const SUSHISWAP_V2_ROUTER = process.env.SUSHISWAP_V2_ROUTER;

// Mainnet-fork Tokens
const WETH_ADDRESS = process.env.WETH_ADDRESS;
const DAI_ADDRESS = process.env.DAI_ADDRESS;

const WETH = new Token(1, ethers.getAddress(WETH_ADDRESS), 18, "WETH", "Wrapped Ether");
const DAI = new Token(1, ethers.getAddress(DAI_ADDRESS), 18, "DAI", "Dai Stablecoin");

const provider = new ethers.JsonRpcProvider(process.env.STAGENET_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const arbitrageContract = new ethers.Contract(ARBITRAGE_CONTRACT_ADDRESS, ArbitrageABI, wallet);

async function getUniswapV3Quote(tokenIn, tokenOut, amountIn, fee) {
    const quoter = new ethers.Contract(UNISWAP_V3_QUOTER, [
        'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external view returns (uint256 amountOut)'
    ], provider);

    try {
        const amountOut = await quoter.quoteExactInputSingle.staticCall(
            tokenIn.address,
            tokenOut.address,
            fee,
            amountIn,
            0
        );
        return amountOut;
    } catch (error) {
        console.error("Error getting V3 quote:", error);
        return 0n;
    }
}

async function getSushiswapQuote(tokenIn, tokenOut, amountIn) {
    const router = new ethers.Contract(SUSHISWAP_V2_ROUTER, [
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'
    ], provider);

    try {
        const amounts = await router.getAmountsOut(amountIn, [tokenIn.address, tokenOut.address]);
        return amounts[1];
    } catch (error) {
        console.error("Error getting V2 quote:", error);
        return 0n;
    }
}


async function main() {
    console.log("Arbitrage Bot Started...");
    console.log(`Monitoring WETH/DAI pair between Uniswap V3 and Sushiswap V2 on mainnet-fork.`);
    console.log("--------------------------------------------------------------------");

    if (ARBITRAGE_CONTRACT_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE" || !ARBITRAGE_CONTRACT_ADDRESS) {
        console.error("Please replace 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE' in bot/index.js with your deployed contract address.");
        return;
    }

    provider.on("block", async (blockNumber) => {
        console.log(`\n[Block #${blockNumber}]`);

        try {
            const amountIn = ethers.parseUnits("0.0002", 18); // Amount of WETH to trade
            const fee = 500; // Uniswap V3 pool fee (changed from 3000 to 500)

            // Opportunity: Buy DAI on Uniswap, Sell DAI on Sushiswap
            const uniswapAmountOut = await getUniswapV3Quote(WETH, DAI, amountIn, fee);
            if (uniswapAmountOut === 0n) {
                console.log("  - Uniswap V3 -> Sushiswap V2: Could not get Uniswap quote.");
                return;
            }

            const sushiswapAmountOut = await getSushiswapQuote(DAI, WETH, uniswapAmountOut);
            if (sushiswapAmountOut === 0n) {
                console.log("  - Uniswap V3 -> Sushiswap V2: Could not get Sushiswap quote.");
                return;
            }

            const profit = sushiswapAmountOut - amountIn;

            console.log(`  Trade Path: WETH -> DAI (Uniswap) -> WETH (Sushiswap)`);
            console.log(`  ${ethers.formatUnits(amountIn, 18)} WETH -> ${ethers.formatUnits(uniswapAmountOut, 18)} DAI -> ${ethers.formatUnits(sushiswapAmountOut, 18)} WETH`);

            if (profit > 0n) {
                console.log(`  !!! ARBITRAGE OPPORTUNITY FOUND !!!`);
                console.log(`  Profit: ${ethers.formatEther(profit)} WETH`);

                // Execute arbitrage
                console.log("  Executing arbitrage transaction...");
                const amountOutMinimum = (sushiswapAmountOut * 995n) / 1000n; // 0.5% slippage

                const tx = await arbitrageContract.executeArbitrage(
                    WETH.address,
                    DAI.address,
                    amountIn,
                    fee,
                    amountOutMinimum,
                    { gasLimit: 1000000 }
                );

                const receipt = await tx.wait();
                console.log(`  Transaction successful! Hash: ${receipt.transactionHash}`);

            } else {
                console.log(`  No profitable opportunity found.`);
            }

        } catch (error) {
            if (error.code === 'CALL_EXCEPTION') {
                console.error(`  Error during quote check (likely a pool doesn't exist): ${error.reason}`);
            } else {
                console.error("  An error occurred in the block handler:", error.message);
            }
        }
    });
}

main().catch((err) => {
    console.error("Unhandled error in main function:", err);
    process.exit(1);
});
