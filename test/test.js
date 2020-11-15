const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");

describe("DID", function() {
  let did;

  beforeEach(async () => {
    const DID = await ethers.getContractFactory("DIDRegistry");
    did = await DID.deploy();
  });
  
  
  it("Should add a new DID", async function() {
    

  });

});