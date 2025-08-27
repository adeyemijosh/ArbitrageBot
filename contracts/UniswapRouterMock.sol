// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20Mock {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// Mock Uniswap V3 Router
contract UniswapV3RouterMock {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(
        ExactInputSingleParams memory params
    ) external payable returns (uint256 amountOut) {
        // Simple mock: take input tokens and give output tokens
        IERC20Mock inputToken = IERC20Mock(params.tokenIn);
        IERC20Mock outputToken = IERC20Mock(params.tokenOut);

        // Transfer input tokens from caller to this router
        require(
            inputToken.transferFrom(msg.sender, address(this), params.amountIn),
            "Input transfer failed"
        );

        // Calculate output (98% rate - worse rate to simulate Uniswap being expensive)
        amountOut = (params.amountIn * 98) / 100;

        // Transfer output tokens to recipient
        require(
            outputToken.transfer(params.recipient, amountOut),
            "Output transfer failed"
        );

        return amountOut;
    }
}

// Mock Uniswap V2 Router (for Sushiswap) - FIXED VERSION
contract UniswapV2RouterMock {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        require(path.length == 2, "Path must have 2 tokens");

        IERC20Mock inputToken = IERC20Mock(path[0]);
        IERC20Mock outputToken = IERC20Mock(path[1]);

        // Transfer input tokens from caller to this router
        require(
            inputToken.transferFrom(msg.sender, address(this), amountIn),
            "Input transfer failed"
        );

        // Calculate output (105% rate - better rate to create arbitrage opportunity)
        uint amountOut = (amountIn * 105) / 100;

        // CHECK MINIMUM OUTPUT - This was missing!
        require(
            amountOut >= amountOutMin,
            "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT"
        );

        // Transfer output tokens to recipient
        require(outputToken.transfer(to, amountOut), "Output transfer failed");

        amounts = new uint[](2);
        amounts[0] = amountIn;
        amounts[1] = amountOut;

        return amounts;
    }
}
