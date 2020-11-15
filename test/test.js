const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");

describe("DID", function() {
  let didReg;
  let accounts;


  beforeEach(async () => {
    const DID = await ethers.getContractFactory("DIDRegistry");
    didReg = await DID.deploy();
    accounts = await ethers.getSigners();
  });
  
  
  it("Should assign caller as controlelr for a new DID", async function() {
    let tx = await didReg.createDID(accounts[1].address);
    let receipt = await tx.wait(1); 

    let did = receipt.events[0].args[0];
    
    let controller = await didReg.getController(did);
    let subject = await didReg.getSubject(did); 
    expect(controller).to.equal(accounts[0].address);
    expect(subject).to.equal(accounts[1].address);
  });

  it("Should be possible to control own did", async function() {
    let tx = await didReg.createDID(accounts[0].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    
    let controller = await didReg.getController(did);
    let subject = await didReg.getSubject(did); 
    expect(controller).to.equal(accounts[0].address);
    expect(subject).to.equal(accounts[0].address);
  });


  it("Should be possible to delete a did", async function() {
    let tx = await didReg.createDID(accounts[0].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    let subject = await didReg.getSubject(did); 
    expect(subject).to.equal(accounts[0].address);
    
    await didReg.deleteDID(did);

    subject = await didReg.getSubject(did);
    expect(subject).to.equal('0x0000000000000000000000000000000000000000');
    
  });

  it("Should only be possible for the did controller to delete a did", async function() {
    let tx = await didReg.createDID(accounts[1].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    const didReg2 = didReg.connect(accounts[2]);
    await expect(didReg2.deleteDID(did)).to.be.reverted;

  });


});