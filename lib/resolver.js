let eccrypto = require("eccrypto");
let _ = require('underscore')
let { DIDAbi } = require('../config/abi')
let { ECCurve, KeyPurpose, gasPrice, gasLimit ,DIDContractAddress} = require('../config/constants')
var KeyEncoder = require('key-encoder').default
keyEncoder = new KeyEncoder('secp256k1')
var Tx = require('ethereumjs-tx').Transaction;

let web3;

let DIDContract;


function init (provider) {
    web3 = provider;
    DIDContract = new web3.eth.Contract(DIDAbi,DIDContractAddress)
}

//@param x - 0xXXXXXXXXXXX
//@param y - 0xYYYYYYYYYYY
//@return pemPublicKey - PEM Formatted public key
function createPemFromPublicKey(x,y) {
    let rawPublicKey = '04' + x.substring(2) + y.substring(2)
    var pemPublicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem')
    return pemPublicKey
}





//@param Buffer - publicKey
//@return x: hex publicKey coordinate x
//@return y: hex publicKey coordinate y
function convertBufferPublicKeyToXY(publicKey) {
    let x = publicKey.slice(1, 33);
    let y = publicKey.slice(33, 65);
    let publicKeyX = '0x' + x.toString('hex')
    let publicKeyY = '0x' + y.toString('hex')

    return {
        x:publicKeyX,
        y:publicKeyY
    }
}

//@param hex privateKey
//@return Buffer publicKey
function privateKeyToPublicKey(privateKey) {
    // let hexPrivateKey = privateKey
    privateKey = privateKey.substring(2)
    privateKey = Buffer.from(privateKey, "hex")
    let publicKey = eccrypto.getPublic(privateKey);
    return publicKey
}

//@param ethereumAddress - 
async function createDID(controllerAddress, subjectAddress) {

    
    return DIDContract.methods.createDID(subjectAddress).send({
        from: controllerAddress,
        gas: gasLimit
    });
    //console.log(tx.events.CreatedDID.returnValues.id);

   
}

//@param toAddress address - what contract is being called
//@param data hexString - encoded function call for a method
//@param publicKey address - sender of transaction
//@param privateKey hexString - privateKey to be used to sign the transaction. Must correspond to publicKey 
async function createSignedTx(toAddress, data, publicKey, privateKey) {
    var pkey = Buffer.from(privateKey.substring(2), 'hex');
    let nonce = await web3.eth.getTransactionCount(publicKey)
    var rawTx = {
        from: publicKey,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: toAddress,
        value: '0x00',
        data: data
    }
    var tx = new Tx(rawTx);

    tx.sign(pkey);
    var serializedTx = tx.serialize();
    return '0x' + serializedTx.toString('hex')
}

async function createDIDRaw(controllerAddress, subjectAddress, controllerPrivateKey) {
    let calldata = createCallData('createDID',[subjectAddress])
    let signedTx = await createSignedTx(DIDContractAddress, calldata, controllerAddress, controllerPrivateKey)
    return signedTx    
}


//@param functionName
//@param params - array
function createCallData(functionName, params) {
    var abi = _.filter(DIDAbi, function (selectedAbi) { return selectedAbi.name == functionName });
    let callData = web3.eth.abi.encodeFunctionCall(abi[0], params);
    return callData
}


//@param ethereumAddress
//@param id - did id
//@param x - x coordinate of public key
//@param y - y coordinate of public key
//@param purpose - int - KeyPurpose
//@param curve - string - eccurve
async function addKey(ethereumAddress,id,x,y,purpose,curve) {
    await DIDContract.methods.addKey(id,x,y,purpose, web3.utils.toHex(curve)).send({
        from: ethereumAddress,
        gas: gasLimit
    })
}

async function addKeyRaw(controllerAddress, controllerPrivateKey,id,x,y,purpose,curve) {
    let calldata = createCallData('addKey',[id,x,y,purpose,web3.utils.toHex(curve)])
    let signedTx = await createSignedTx(DIDContractAddress, calldata, controllerAddress, controllerPrivateKey)
    return signedTx
}

async function addKeys(ethereumAddress,id,x,y,purpose,curve) {
    
    let curveBytes = []; 

    for (i = 0; i < curve.length; i++) {
        curveBytes.push(web3.utils.toHex(curve[i]));
    }  

    await DIDContract.methods.addKeys(id, x, y, purpose, curveBytes).send({
        from: ethereumAddress,
        gas: gasLimit
    })
}

async function addKeysRaw(controllerAddress, controllerPrivateKey,id,x,y,purpose,curve) {

    let curveBytes = []; 

    for (i = 0; i < curve.length; i++) {
        curveBytes.push(web3.utils.toHex(curve[i]));
    }  

    let calldata = createCallData('addKey',[id,x,y,purpose,curveBytes])
    let signedTx = await createSignedTx(DIDContractAddress, calldata, controllerAddress, controllerPrivateKey)
    return signedTx
}

//@param id - did id
//@return - int - length of keys
async function getKeyLength(id) {
    let response = await DIDContract.methods.getKeysLength(id).call() 
    return response
}

//@param id - did id
//@return - array - json object containing x,y,purpose, and curve
async function getKeys(id) {
    let keyLength = await getKeyLength(id)
    let keys = []

   
    for(let i = 0; i < keyLength; i++) {
        let key = await DIDContract.methods.retrieveKey(id,i).call()
        let keyJson = {
            x: key[0],
            y: key[1],
            keyPurpose: key[2],
            curve: web3.utils.hexToUtf8(key[3])
        }
        keys.push(keyJson)
    }
    return keys
}

//Helper function, gets key purpose by int
//@param int
//@param KeyPurpose enum 
function convertToKeyPurpose(int) {
    return (_.invert(KeyPurpose))[int]
}


//@param DID - did:signor:<network>:<id>
//@return DIDDocument Json Object
async function getDIDDocument(did) {
    let didArray = did.split(":")
    let id = didArray[3]

    let subject = await DIDContract.methods.getSubject(id).call() 
    let controller = await DIDContract.methods.getController(id).call() 

    let key0 = {
        id: did + '#key-0',
        type: ECCurve,
        controller: controller,
        ethereumAddress: subject
    }
    
    let authentication = [];
    let pubKeys = []; 
    let keys = await getKeys(id);

    for(let i = 0; i < keys.length ; i++) {
        let pem = createPemFromPublicKey(keys[i].x, keys[i].y)
        let keyIndex=i+1
        let key = 
            {
                id: did + "#keys-" + keyIndex,
                "type": keys[i].curve,
                "controller": controller,
                "publicKeyPem": pem
            };
        if (keys[i].keyPurpose == KeyPurpose.Authentication) authentication.push(key);
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

module.exports = {
    init,
    createPemFromPublicKey,
    createDID,
    addKey,
    addKeys,
    getKeys,
    getDIDDocument,
    getKeyLength,
    createDIDRaw,
    convertToKeyPurpose,
    addKeyRaw,
    addKeysRaw
}