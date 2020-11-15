const { Contract } = require("ethers");
const contract = require('../artifacts/contracts/DIDRegistry.sol/DIDRegistry.json');

let didReg;

//expects teh smart contract address and a valid ethers signer
function init(address, signer) {
    const abi = contract.abi;
    didReg = new ethers.Contract(address,abi,signer);
  
}

async function createDID(subject) {
    let tx = await didReg.createDID(subject);
    let receipt = await tx.wait(); 
    let did = receipt.events[0].args[0];
    return did;
}

async function deleteDID(did) {
    return didReg.deleteDID(did);
}

async function getController(did) {
    return didReg.getController(did);
}

async function getSubject(did) {
    return didReg.getSubject(did);
}

async function addKey(from, did, x, y, purpose, curve) {

}


async function getDIDDocument(did) {

}

async function getKeys(id) {

}

async function getKeyLength(id) {

}


module.exports = {
    init,
    createDID,
    deleteDID, 
    addKey,
    getKeys,
    getDIDDocument,
    getController,
    getSubject,
    getKeyLength
}