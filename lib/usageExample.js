(async () => {

let eccrypto = require("eccrypto");

let Web3 = require('web3');
resolver = require('./resolver.js');
let { ECCurve, KeyPurpose, DIDContractAddress} = require('../config/constants');

web3 = new Web3('http://localhost:8545');

resolver.init(web3, 1591661810665);


let accounts = await web3.eth.personal.getAccounts();


let tx = await resolver.createDID(accounts[0], accounts[0]);
//console.log(tx);
let did = tx.events.CreatedDID.returnValues.id;




var privateKey = eccrypto.generatePrivate();
var key1 = eccrypto.getPublic(privateKey);
var privateKey2 = eccrypto.generatePrivate();
var key2 = eccrypto.getPublic(privateKey2);
pub1 = convertBufferPublicKeyToXY(key1);
pub2  = convertBufferPublicKeyToXY(key2);

await resolver.addKey(accounts[0], did, pub1.x, pub1.y, KeyPurpose.Signing, ECCurve);
await resolver.addKey(accounts[0], did, pub2.x, pub2.y, KeyPurpose.Encryption, ECCurve);

let didString ="did:signor:mainnet:" + did;

doc = await resolver.getDIDDocument(didString);
console.log(doc);

})();



  

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