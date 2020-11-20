const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");

const DATA = "This is a test message";

describe("Notary", function() {
  let notary;
  let accounts;

  beforeEach(async () => {
    const Notary = await ethers.getContractFactory("Notary");
    notary = await Notary.deploy();
    accounts = await ethers.getSigners();
  });
  
  
  it("should store and recover a record", async function() {
    
    let hash = ethers.utils.id(DATA);
    let tx = await notary.setRecord(hash, []);
    await tx.wait();

    let res = await notary.getRecord(hash);
   
    expect(res[0]).to.not.equal(0);   
  });


  it("should recover timestamp 0 on non-exisiting record", async function() {
    
    let hash = ethers.utils.id(DATA);
    let tx = await notary.setRecord(hash, []);
    await tx.wait();

    let res = await notary.getRecord(ethers.utils.id('wrong data'));
   
    expect(res[0]).to.equal(0);   
  });

  it("should recover signatures", async function() {
    
    let hash = ethers.utils.id(DATA);
 
    let signature = await accounts[0].signMessage(ethers.utils.arrayify(hash));

    
    
    let tx = await notary.setRecord(hash, signature);
    await tx.wait();

    let res = await notary.getRecordAndSigner(hash);
   
    expect(res[0]).to.not.equal(0);   
    expect(res[1]).to.equal(accounts[0].address);   

  });
  
});