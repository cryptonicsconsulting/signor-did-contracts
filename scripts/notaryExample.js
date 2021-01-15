const { Contract } = require("ethers");
const hre = require("hardhat");

const lib = require("../lib/notary");



async function main() {
  
    const NOTARY = await hre.ethers.getContractFactory("Notary");
    const notary  = await NOTARY.deploy();
  
    await notary.deployed();
    const signers = await hre.ethers.getSigners();

    console.log("Notary deployed to:", notary.address);

    console.log("The signing account is: " + signers[0].address);

    //init the library
    await lib.init(notary.address,signers[0]);
   
    //have some data in buffer
    const data = Buffer.from('Some test data');
     
    //notarize the data
    let tx = await lib.setRecord(data);

    //wait for transaction to be mined
    await tx.wait();

    //verify record
    let res = await lib.getRecordAndSigner(data);
    console.log("Notary date: " + new Date(res[0] * 1000));
    console.log("Recovered signing address: " + res[1]);

  }
  



  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  
