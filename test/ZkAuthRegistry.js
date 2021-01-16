const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");
const zkLib = require('@nuid/zk');

describe("ZkAuthRegistry", function() {
    let didReg;
    let accounts;
    let zkAuth;
    let did1;
    let did2;
  
    beforeEach(async () => {
        //deploy DID Registry  
        const DID = await ethers.getContractFactory("DIDRegistry");
        didReg = await DID.deploy();
        
        //deploy ZkAuthRegistry 
        const ZK = await ethers.getContractFactory("ZkAuthRegistry");
        zkAuth = await ZK.deploy(didReg.address);
        
        //get Accounts
        accounts = await ethers.getSigners();

        //add a dids
        let tx = await didReg.createDID(accounts[0].address);
        let receipt = await tx.wait(); 
        did1 = receipt.events[0].args[0];
        let tx2 = await didReg.createDID(accounts[1].address);
        let receipt2 = await tx2.wait(); 
        did12 = receipt2.events[0].args[0];


    });
  
  
    it("should register and recover a credential", async function() {
        const secret = "a very secret string";
        let verifiable = zkLib.verifiableFromSecret(secret);
        let credential = zkLib.credentialFromVerifiable(verifiable);
    
        let credentialStr = JSON.stringify(credential);
        let tx = await zkAuth.setCredential(did1, credentialStr);
        await tx.wait();
        
        let res = await zkAuth.getCredential(did1);
        expect(res).to.equal(credentialStr);   
    });


    it("only did controler can register credential", async function() {
        const secret = "a very secret string";
        let verifiable = zkLib.verifiableFromSecret(secret);
        let credential = zkLib.credentialFromVerifiable(verifiable);
    
        let credentialStr = JSON.stringify(credential);
        await expect(zkAuth.setCredential(did2, credentialStr)).to.be.reverted;
         
       
    });

    it("should return empty credential string for DID wihout credential", async function() {
        
        let res = await zkAuth.getCredential(accounts[2].address);
        expect(res).to.equal("");  
         
       
    });

});