require('dotenv').config({ path: '../.env' })
let eccrypto = require("eccrypto");
let _ = require('underscore')
let { DIDAbi } = require('../config/abi')
let { ECCurve, KeyPurpose, PUB1 , PUB2 ,DIDContractAddress} = require('../config/constants')
var KeyEncoder = require('key-encoder').default
keyEncoder = new KeyEncoder('secp256k1')

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

    let response = await DIDContract.methods.createDID(subjectAddress).send({
        from: controllerAddress,
        gas: 1500000
    })

    let id = response.events.CreatedDID.returnValues.id

    return id
}

//@param ethereumAddress
//@param id - did id
//@param x - x coordinate of public key
//@param y - y coordinate of public key
//@param purpose - int - KeyPurpose
//@param curve - string - eccurve
async function addKey(ethereumAddress,id,x,y,purpose,curve) {
    await DIDContract.methods.addKey(id,x,y,purpose,curve).send({
        from: ethereumAddress,
        gas: 1500000
    })
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
            x:key[0],
            y:key[1],
            keyPurpose:convertToKeyPurpose(key[2]),
            curve:key[3]
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

    let key0 = {
        id: did + '#key-0',
        type: ECCurve,
        controller: did,
        ethereumAddress: subject
    }
    
    let authentication = []
    let keys = await getKeys(id);

    for(let i = 0; i < keys.length ; i++) {
        let pem = createPemFromPublicKey(keys[i].x, keys[i].y)
        let keyIndex=i+1
        let key = 
            {
                id: id + "#keys-" + keyIndex,
                "type": keys[i].curve,
                "controller": id,
                "publicKeyPem": pem
            }
        authentication.push(key)
    }

    let didDocument = {
        '@context': 'https://w3id.org/did/v1',
        id,
        publicKey: [
            key0
        ],
        authentication
      }
    
    return didDocument
}

module.exports = {
    init,
    createPemFromPublicKey,
    createDID,
    addKey,
    getKeys,
    getDIDDocument,
    getKeyLength,
    convertToKeyPurpose
}