const DIDRegistry = artifacts.require("DIDRegistry");
const ClaimsRegistry = artifacts.require("ClaimsRegistry");

module.exports = function(deployer) {
  deployer.deploy(DIDRegistry);
  deployer.deploy(ClaimsRegistry);
};
