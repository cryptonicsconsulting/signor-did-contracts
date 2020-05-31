const DIDRegistry = artifacts.require("DIDRegistry");
const ClaimsRegistry = artifacts.require("ClaimsRegistry");

let { PUB1 } = require('../config/constants')

//ganache-cli -d did

module.exports = async function(deployer) {
  await deployer.deploy(DIDRegistry);

  // let DIDContract = await DIDRegistry.at(DIDRegistry.address)
  // let response = await DIDContract.createDID(PUB1)

  // // let didId= response.logs[0].args.id

  // console.log(response.logs[0].args.id) 
 
  //0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc


  deployer.deploy(ClaimsRegistry);
};

