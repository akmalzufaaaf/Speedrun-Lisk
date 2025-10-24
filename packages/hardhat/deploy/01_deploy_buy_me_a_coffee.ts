import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Deploys the "PriceFeed" contract
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployPriceFeed: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("PriceFeed", {
    from: deployer,
    // PriceFeed contract doesn't take any constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the transaction
    autoMine: true,
  });
};

export default deployPriceFeed;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags PriceFeed
deployPriceFeed.tags = ["PriceFeed"];
