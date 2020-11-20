const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");
let eccrypto = require("eccrypto");


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
   
    expect(controller).to.equal(accounts[0].address);
   
  });



  it("Should be possible to delete a did", async function() {
    let tx = await didReg.createDID(accounts[0].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    let controller = await didReg.getController(did); 
    expect(controller).to.equal(accounts[0].address);
    
    await didReg.deleteDID(did);

    controller = await didReg.getController(did);
    expect(controller).to.equal('0x0000000000000000000000000000000000000000');
    
  });

  it("Should only be possible for the did controller to delete a did", async function() {
    let tx = await didReg.createDID(accounts[1].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    const didReg2 = didReg.connect(accounts[2]);
    await expect(didReg2.deleteDID(did)).to.be.reverted;

  });


  it("Should only be possible for the did controller to add a key", async function() {
    let tx = await didReg.createDID(accounts[1].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    
    expect(await didReg.getKeysLength(did)).to.equal(0);

    let privateKey = eccrypto.generatePrivate();
    let pubKey = eccrypto.getPublic(privateKey);
    
    let arr = Array.prototype.slice.call(pubKey);
    await didReg.addKey(did, arr, 0);

    expect(await didReg.getKeysLength(did)).to.equal(1);
  });


  it("Should only be possible for the did controller to remove a key", async function() {
    let tx = await didReg.createDID(accounts[1].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    
 
    let privateKey = eccrypto.generatePrivate();
    let pubKey = eccrypto.getPublic(privateKey);

    let privateKey2 = eccrypto.generatePrivate();
    let pubKey2 = eccrypto.getPublic(privateKey2);
    
    let arr = Array.prototype.slice.call(pubKey);
    await didReg.addKey(did, arr, 0);

    let arr2 = Array.prototype.slice.call(pubKey2);
    await didReg.addKey(did, arr2, 1);

    await didReg.removeKey(did, 0);

    expect(await didReg.getKeysLength(did)).to.equal(1);

  });

  it("Should retrieve a key", async function() {
    let tx = await didReg.createDID(accounts[1].address);
    let receipt = await tx.wait(1); 
       
    let did = receipt.events[0].args[0];
    
 
    let privateKey = eccrypto.generatePrivate();
    let pubKey = eccrypto.getPublic(privateKey);

    let privateKey2 = eccrypto.generatePrivate();
    let pubKey2 = eccrypto.getPublic(privateKey2);
    
    let arr = Array.prototype.slice.call(pubKey);
    await didReg.addKey(did, arr, 0);

    let arr2 = Array.prototype.slice.call(pubKey2);
    await didReg.addKey(did, arr2, 1);

    let recKey = await didReg.getKey(did, 0);
    let recKey2 = await didReg.getKey(did, 1);

    expect(Buffer.from(recKey[0]).toString()).to.equal(pubKey.toString());
    expect(Buffer.from(recKey2[0]).toString()).to.equal(pubKey2.toString());

    expect(recKey[1]).to.equal(0);
    expect(recKey2[1]).to.equal(1);


  });

});