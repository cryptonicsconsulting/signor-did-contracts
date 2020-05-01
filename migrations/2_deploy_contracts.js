const PublicElection = artifacts.require("PublicElection");

module.exports = function(deployer) {
  deployer.deploy(PublicElection,0 ,1, []);
 
};
