// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Arbitrage {
    ISwapRouter public immutable uniswapRouter;
    IUniswapV2Router02 public immutable sushiswapRouter;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _uniswapRouter, address _sushiswapRouter) {
        owner = msg.sender;
        uniswapRouter = ISwapRouter(_uniswapRouter);
        sushiswapRouter = IUniswapV2Router02(_sushiswapRouter);
    }

    function executeArbitrage(
        address token0,
        address token1,
        uint256 amountIn,
        uint24 fee,
        uint256 amountOutMinimum
    ) external onlyOwner {
        // 1. Perform a swap on Uniswap V3
        TransferHelper.safeApprove(token0, address(uniswapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: token0,
                tokenOut: token1,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        uint256 amountOutFromUniswap = uniswapRouter.exactInputSingle(params);

        // 2. Perform a swap on Sushiswap (V2)
        TransferHelper.safeApprove(
            token1,
            address(sushiswapRouter),
            amountOutFromUniswap
        );

        address[] memory path = new address[](2);
        path[0] = token1;
        path[1] = token0;

        uint[] memory amounts = sushiswapRouter.swapExactTokensForTokens(
            amountOutFromUniswap,
            amountOutMinimum,
            path,
            address(this),
            block.timestamp
        );
        uint256 amountOutFromSushiswap = amounts[1];

        // 3. Check for profit and send it to the owner
        require(amountOutFromSushiswap > amountIn, "No profit");
        TransferHelper.safeTransfer(
            token0,
            owner,
            amountOutFromSushiswap - amountIn
        );
    }

    // Helper function to withdraw funds
    function withdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        TransferHelper.safeTransfer(token, owner, balance);
    }

    receive() external payable {}
}
