const Spacebears = artifacts.require("SpaceBear");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Spacebears, accounts[0]);
}
