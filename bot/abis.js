const IUniswapV3PoolABI = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
    "function liquidity() external view returns (uint128)",
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
];

const IUniswapV3FactoryABI = [
    "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
];

const ERC20ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
];

const ArbitrageABI = [
    "function executeArbitrage(address token0, address token1, uint256 amountIn, uint24 fee, uint256 amountOutMinimum) external",
];

module.exports = {
    IUniswapV3PoolABI,
    IUniswapV3FactoryABI,
    ERC20ABI,
    ArbitrageABI,
};
