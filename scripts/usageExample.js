const { Contract } = require("ethers");
const hre = require("hardhat");

const lib = require("../lib/didLib");

async function main() {
  
    const DID = await hre.ethers.getContractFactory("DIDRegistry");
    const didContract = await DID.deploy();
  
    await didContract.deployed();
    const signers = await hre.ethers.getSigners();

    console.log("DIDRegistry deployed to:", didContract.address);



    //init the library
    lib.init(didContract.address,signers[0]);

    //create a did
    let did = lib.createDID(signers[1].address);

    //read controller for the newly created did
    let controller = await lib.getController(did);
    

    console.log("Controller: " + controller);
    console.log("Subject: " + signers[0].address);


    await lib.deleteDID(did);
    controller = await lib.getController(did);
  

    console.log("Controller: " + controller);
    

  }
  
 




  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  
