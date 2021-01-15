const { Contract } = require("ethers");
const contract = require('../artifacts/contracts/Notary.sol/Notary.json');

let notary;
let account;



//expects the smart contract address and a valid ethers signer
async function init(address, signer) {
    const abi = contract.abi;
    notary = new ethers.Contract(address,abi,signer);
    account = signer;
}


async function setRecord(data) {

    let hash = ethers.utils.hashMessage(data);
    let sig = await account.signMessage(ethers.utils.arrayify(hash));

    return notary.setRecord(hash, sig); 
}


async function getRecord(data) {
    let hash = ethers.utils.hashMessage(data);
    return notary.getRecord(hash);

}

async function getRecordAndSigner(data) {
    let hash = ethers.utils.hashMessage(data);
    return notary.getRecordAndSigner(hash);

}

module.exports = {
    init,
    setRecord,
    getRecord,
    getRecordAndSigner,
}