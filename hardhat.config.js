require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    // polygon: {
    //   url: "",
    //   accounts: ['0']
    // },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/kNVb7YQLqxcDwlRlfK21Yr9DSS-cQdK9",
      accounts: ['dca3cbbfe6bd944937aa30fd930284d1455b4e50236b2b46f81dbdd5c5e5de81']
    },
    // rinkeby: {
    //   url: "",
    //   accounts: ['']
    // }
  },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  }
}
