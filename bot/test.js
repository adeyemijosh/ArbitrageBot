require("dotenv").config();
const { ethers } = require("ethers");
const { Token } = require("@uniswap/sdk-core");

// --- CONFIGURATION ---
const UNISWAP_V3_QUOTER = process.env.UNISWAP_V3_QUOTER; // Correct mainnet QuoterV2

// Mainnet-fork Tokens
const WETH_ADDRESS = process.env.WETH_ADDRESS;
const DAI_ADDRESS = process.env.DAI_ADDRESS;

const WETH = new Token(1, ethers.getAddress(WETH_ADDRESS), 18, "WETH", "Wrapped Ether");
const DAI = new Token(1, ethers.getAddress(DAI_ADDRESS), 18, "DAI", "Dai Stablecoin");

const provider = new ethers.JsonRpcProvider(process.env.STAGENET_RPC_URL);

async function testQuote() {
    console.log("--- Running Uniswap V3 Quote Test ---");
    if (!process.env.STAGENET_RPC_URL) {
        console.error("STAGENET_RPC_URL not found in .env file.");
        return;
    }
    console.log("Using RPC URL:", process.env.STAGENET_RPC_URL);


    const quoter = new ethers.Contract(UNISWAP_V3_QUOTER, [
        'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external view returns (uint256 amountOut)'
    ], provider);

    const amountIn = ethers.parseUnits("0.0002", 18);
    const fee = 500;

    console.log(`Quoting 0.0002 WETH for DAI with fee ${fee}...`);

    try {
        const amountOut = await quoter.quoteExactInputSingle.staticCall(
            WETH.address,
            DAI.address,
            fee,
            amountIn,
            0
        );
        console.log("--- TEST SUCCESS ---");
        console.log(`Received quote: ${ethers.formatUnits(amountOut, 18)} DAI`);
    } catch (error) {
        console.error("--- TEST FAILED ---");
        console.error("Error getting V3 quote:", error);
    }
}

testQuote();
