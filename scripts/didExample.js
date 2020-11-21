const { Contract } = require("ethers");
const hre = require("hardhat");

const lib = require("../lib/didLib");
let eccrypto = require("eccrypto");


async function main() {
  
    const DID = await hre.ethers.getContractFactory("DIDRegistry");
    const didContract = await DID.deploy();
  
    await didContract.deployed();
    const signers = await hre.ethers.getSigners();

    console.log("DIDRegistry deployed to:", didContract.address);



    //init the library
    await lib.init(didContract.address,signers[0]);

    //create a did
    let did = await lib.createDID(signers[1].address);

    //read controller for the newly created did
    let controller = await lib.getController(did);
    
    
   
    //generate some keys
    let privateKey = eccrypto.generatePrivate();
    let pubKey = eccrypto.getPublic(privateKey);
   
    let privateKey2 = eccrypto.generatePrivate();
    let pubKey2 = eccrypto.getPublic(privateKey2);
   
   
    //add keys
    await lib.addKey(did, pubKey, lib.KeyPurpose.Authentication);
    await lib.addKey(did, pubKey2, lib.KeyPurpose.Encryption);

    console.log(await lib.getDIDDocument('did:signor:mainet:' + did));

  }
  



  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  
