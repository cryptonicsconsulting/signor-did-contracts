const Zk = require('@nuid/zk');
const { Contract } = require("ethers");
const hre = require("hardhat");
const lib = require("../lib/did");

async function main() {

    //deploy a DIDRegistry for this example
    const DIDRegistry = await hre.ethers.getContractFactory("DIDRegistry");
    const didReg  = await DIDRegistry.deploy();
    await didReg.deployed();
    //deploy a ZkAuthRegistry for this example
    const ZkAuthRegistry = await hre.ethers.getContractFactory("ZkAuthRegistry");
    const zkReg  = await ZkAuthRegistry.deploy(didReg.address);
    await zkReg.deployed();
    const signers = await hre.ethers.getSigners();
    //init the library
    await lib.init(didReg.address,signers[0]);
    //create a DID
    let did = await lib.createDID(signers[0].address);



    // user: create credential
    const secret = "a very secret string";
    let verifiable = Zk.verifiableFromSecret(secret);
    //we auto-verify our credential, could be done on behalf of user by a controller depneding on use case
    //Zk.isVerified(verifiable); 
    let credential = Zk.credentialFromVerifiable(verifiable);
   

    //store the credetial for DID on-chain
    let credentialStr = JSON.stringify(credential);
    await zkReg.setCredential(signers[0].address, credentialStr);


    //verifier: retrieve credential from for a DID
    let retrievedCredentialStr = await zkReg.getCredential(signers[1].address);
    if (retrievedCredentialStr!="") {
      let retrievedCredential = JSON.parse(retrievedCredentialStr);

      // verifier: create challenge in response to authentication request
      let challenge = Zk.defaultChallengeFromCredential(retrievedCredential); 
      let challengeStr = JSON.stringify(challenge);

      // user: create proof for challenge
      let receivedChallenge = JSON.parse(challengeStr);
      let proof = Zk.proofFromSecretAndChallenge(secret, receivedChallenge);
      let proofStr = JSON.stringify(proof);

      //verifier: verify proof to authenticate
      let receivedProof = JSON.parse(proofStr);
      let verifiable2 = Zk.verifiableFromProofAndChallenge(receivedProof, receivedChallenge)
      Zk.isVerified(verifiable2) ? console.log("authenticated") : console.log("not authenticated");

    } else {
      console.log("No credentials found");
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });