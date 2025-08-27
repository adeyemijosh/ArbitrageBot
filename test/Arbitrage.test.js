const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Arbitrage Contract", function () {
    let arbitrage, owner, addr1, tokenA, tokenB, uniswapRouter, sushiswapRouter;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deploy mock tokens
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        tokenA = await ERC20Mock.deploy("Token A", "TKA");
        tokenB = await ERC20Mock.deploy("Token B", "TKB");

        await tokenA.waitForDeployment();
        await tokenB.waitForDeployment();

        // Deploy mock routers
        const UniswapV3RouterMock = await ethers.getContractFactory("UniswapV3RouterMock");
        const UniswapV2RouterMock = await ethers.getContractFactory("UniswapV2RouterMock");

        uniswapRouter = await UniswapV3RouterMock.deploy();
        sushiswapRouter = await UniswapV2RouterMock.deploy();

        await uniswapRouter.waitForDeployment();
        await sushiswapRouter.waitForDeployment();

        // Give routers tokens to simulate liquidity
        await tokenA.transfer(await uniswapRouter.getAddress(), ethers.parseEther("100000"));
        await tokenB.transfer(await uniswapRouter.getAddress(), ethers.parseEther("100000"));
        await tokenA.transfer(await sushiswapRouter.getAddress(), ethers.parseEther("100000"));
        await tokenB.transfer(await sushiswapRouter.getAddress(), ethers.parseEther("100000"));

        // Deploy Arbitrage contract
        const Arbitrage = await ethers.getContractFactory("Arbitrage");
        arbitrage = await Arbitrage.deploy(
            await uniswapRouter.getAddress(),
            await sushiswapRouter.getAddress()
        );
        await arbitrage.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should deploy successfully", async function () {
            expect(await arbitrage.owner()).to.equal(owner.address);
            console.log("Arbitrage contract deployed at:", await arbitrage.getAddress());
        });
    });

    describe("Access Control", function () {
        it("Should only allow owner to execute arbitrage", async function () {
            await expect(
                arbitrage.connect(addr1).executeArbitrage(
                    await tokenA.getAddress(),
                    await tokenB.getAddress(),
                    ethers.parseEther("1"),
                    3000,
                    0
                )
            ).to.be.revertedWith("Not owner");
        });

        it("Should only allow owner to withdraw", async function () {
            await expect(
                arbitrage.connect(addr1).withdraw(await tokenA.getAddress())
            ).to.be.revertedWith("Not owner");
        });
    });

    describe("Arbitrage Execution", function () {
        it("Should execute profitable arbitrage", async function () {
            const amountIn = ethers.parseEther("1000");

            // Give the arbitrage contract the tokens it needs
            await tokenA.transfer(await arbitrage.getAddress(), amountIn);

            // Also give the contract approval to spend tokens (for the transfer to routers)
            await tokenA.connect(owner).approve(await arbitrage.getAddress(), amountIn * 2n);

            // Check initial balances
            console.log("   Initial state:");
            console.log("   Arbitrage contract TokenA balance:", ethers.formatEther(await tokenA.balanceOf(await arbitrage.getAddress())));
            console.log("   Owner TokenA balance:", ethers.formatEther(await tokenA.balanceOf(owner.address)));
            console.log("   Uniswap TokenB balance:", ethers.formatEther(await tokenB.balanceOf(await uniswapRouter.getAddress())));
            console.log("   Sushiswap TokenA balance:", ethers.formatEther(await tokenA.balanceOf(await sushiswapRouter.getAddress())));

            const initialOwnerBalance = await tokenA.balanceOf(owner.address);

            // Execute arbitrage (our mocks: 98% on Uniswap, then 105% on Sushiswap = profit)
            console.log(" Executing arbitrage...");

            try {
                await arbitrage.executeArbitrage(
                    await tokenA.getAddress(),
                    await tokenB.getAddress(),
                    amountIn,
                    3000, // 0.3% fee tier
                    0     // no minimum output for testing
                );

                const finalOwnerBalance = await tokenA.balanceOf(owner.address);

                // Check final balances
                console.log(" Final state:");
                console.log("   Owner TokenA balance:", ethers.formatEther(finalOwnerBalance));
                console.log("   Arbitrage contract TokenA balance:", ethers.formatEther(await tokenA.balanceOf(await arbitrage.getAddress())));

                expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);

                const profit = finalOwnerBalance - initialOwnerBalance;
                console.log(" Arbitrage executed successfully!");
                console.log("   Input amount:", ethers.formatEther(amountIn), "tokens");
                console.log("   Profit:", ethers.formatEther(profit), "tokens");
                console.log("   Profit %:", (profit * 10000n / amountIn).toString() / 100, "%");
            } catch (error) {
                console.log("   Arbitrage failed:", error.message);
                console.log("   State after failure:");
                console.log("   Arbitrage contract TokenA balance:", ethers.formatEther(await tokenA.balanceOf(await arbitrage.getAddress())));
                console.log("   Arbitrage contract TokenB balance:", ethers.formatEther(await tokenB.balanceOf(await arbitrage.getAddress())));
                throw error;
            }
        });

        it("Should fail if arbitrage is not profitable", async function () {

            const amountIn = ethers.parseEther("1000");
            await tokenA.transfer(await arbitrage.getAddress(), amountIn);

            // This should fail because our 2.9% profit won't meet a 1000000% minimum return
            await expect(
                arbitrage.executeArbitrage(
                    await tokenA.getAddress(),
                    await tokenB.getAddress(),
                    amountIn,
                    3000,
                    ethers.parseEther("10000000") // Impossible minimum output
                )
            ).to.be.reverted; // Will revert due to slippage protection or no profit
        });
    });

    describe("Withdraw Function", function () {
        it("Should allow owner to withdraw funds", async function () {
            const amount = ethers.parseEther("500");
            await tokenA.transfer(await arbitrage.getAddress(), amount);

            const initialBalance = await tokenA.balanceOf(owner.address);
            await arbitrage.withdraw(await tokenA.getAddress());
            const finalBalance = await tokenA.balanceOf(owner.address);

            expect(finalBalance - initialBalance).to.equal(amount);
        });
    });
});