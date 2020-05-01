const DIDRegistry = artifacts.require("DIDRegistry");

module.exports = function(deployer) {
  deployer.deploy(DIDRegistry);
};
