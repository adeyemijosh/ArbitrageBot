require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        stagenet: {
            type: "http",
            chainType: "l1",
            url: process.env.STAGENET_RPC_URL || "https://rpc.contract.dev/01b56ca07173fe8a417bbfdadde936f7",                                               
            accounts: [
                process.env.PRIVATE_KEY || "0xfd8128d4833fb26236c3e82489b94babeb9323382a52ac1383b8ea5c38cf1833"
            ]
        },
        hardhat: {
            // Local development network
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    }
};
