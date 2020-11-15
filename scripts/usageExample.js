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

    //read controller and subject for the newly created did
    let controller = await lib.getController(did);
    let subject = await lib.getSubject(did); 

    console.log("Controller: " + controller);
    console.log("Subject: " + subject);


    await lib.deleteDID(did);
    controller = await lib.getController(did);
    subject = await lib.getSubject(did); 

    console.log("Controller: " + controller);
    console.log("Subject: " + subject);

  }
  
 




  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  
