require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {
            forking: {
                url: process.env.MAINNET_RPC_URL,
                blockNumber: 15000000
            },
            // Gas settings for local development
            gasPrice: 20000000000, // 20 Gwei
            initialBaseFeePerGas: 0
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            gasPrice: 20000000000,
            initialBaseFeePerGas: 0
        }
    }
};