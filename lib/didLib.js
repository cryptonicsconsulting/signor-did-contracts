const { Contract } = require("ethers");
const contract = require('../artifacts/contracts/DIDRegistry.sol/DIDRegistry.json');

let didReg;

let KeyPurpose = {
    Authentication : 0,
    Signing : 1,
    Encryption : 2
}


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



async function addKey(did, key, purpose) {

    //ethers expects an array instead of a node Buffer
    let arr = Array.prototype.slice.call(key);
    return didReg.addKey(did, arr, purpose);
}


async function getDIDDocument(did) {
    let didArray = did.split(":")
    let id = didArray[3]

    let subject = id
    let controller = await getController(id) 

    let key0 = {
        id: did + '#key-0',
        type: 'secp256k1-koblitz',
        controller: controller,
        ethereumAddress: subject
    }
    
    let authentication = [];
    let pubKeys = []; 
    let keys = await getKeys(id);


    for(let i = 0; i < keys.length ; i++) {
        let pem = '0x'+ keys[i][0].toString('hex');
        let keyIndex=i+1
        let key = 
            {
                id: did + "#keys-" + keyIndex,
                "type": 'secp256k1-koblitz',
                "controller": controller,
                "publicKeyPem": pem
            };
        if (keys[i][1] == KeyPurpose.Authentication) authentication.push(key);
        else pubKeys.push(key);
    }

    let didDocument = {
        '@context': 'https://w3id.org/did/v1',
        did,
        publicKey: [
            key0
        ].concat(pubKeys),
        authentication
      }
    
    return didDocument
}


async function getKey(did, index) {
    let recKey = await didReg.getKey(did, index);
    let key = Buffer.from(recKey[0]);
    let purpose = recKey[1].toNumber();

    return [key, purpose];
}

async function getKeys(did) {
    let noKeys = await getKeysLength(did);

    let keys = [];

    for (i=0; i < noKeys; i++) {
        keys.push(await getKey(did, i)); 
    }

    return keys;
}

async function getKeysLength(did) {
    return didReg.getKeysLength(did);
}


module.exports = {
    init,
    createDID,
    deleteDID, 
    addKey,
    getKeys,
    getDIDDocument,
    getController,
    getKeysLength,
    KeyPurpose
}