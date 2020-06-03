const DIDRegistry = artifacts.require("DIDRegistry");
const ClaimsRegistry = artifacts.require("ClaimsRegistry");

let { PUB1 } = require('../config/constants')

//ganache-cli -d did

module.exports = async function(deployer) {
  await deployer.deploy(DIDRegistry);

  let DIDContract = await DIDRegistry.at(DIDRegistry.address)
  // await DIDContract.createDID(PUB1)
  // await DIDContract.addKey("0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc","0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606","0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39",0,"secp256k1-koblitz")
  // await DIDContract.addKey("0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc","0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606","0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39",1,"secp256k1-koblitz")
  
  

  // let response = await DIDContract.retrieveKey("0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc",0);
  
  // console.log(response[2].toNumber())
  
  // // let didId= response.logs[0].args.id

  //  console.log(response.logs[0].args.id) 
 
  //0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc


  deployer.deploy(ClaimsRegistry);
};

