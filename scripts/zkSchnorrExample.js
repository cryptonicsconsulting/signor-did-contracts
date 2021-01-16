const Zk = require('@nuid/zk');

async function main() {
  

    // user: create credential
    const secret = "a very secret string";
    let verifiable = Zk.verifiableFromSecret(secret);
    //we auto-verify our credential, could be done on behalf of user by a controller depneding on use case
    //Zk.isVerified(verifiable); 
    let credential = Zk.credentialFromVerifiable(verifiable);

    //store the credetial for DID on-chain
    let credentialStr = JSON.stringify(credential);
    //TODO: contract interaction


    //verifier: retrieve credential from for a DID
    //TODO: contract interaction
    let retrievedCredential = JSON.parse(credentialStr);

    

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

}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });