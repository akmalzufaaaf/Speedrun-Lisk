const Spacebears = artifacts.require("SpacebearDebug");
 
module.exports = function(deployer, network, account) {
    deployer.deploy(Spacebears, account[0]);
}