require('dotenv').config({ path: '../.env' })

var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
var eccrypto = require("eccrypto");

let { DIDAbi } = require('../config/abi')
let { ECCurve, KeyPurpose, PUB1 , PUB2 ,DIDContractAddress} = require('../config/constants')

let DIDContract = new web3.eth.Contract(DIDAbi,DIDContractAddress)

var KeyEncoder = require('key-encoder').default
keyEncoder = new KeyEncoder('secp256k1')

//@param x - 0xXXXXXXXXXXX
//@param y - 0xYYYYYYYYYYY
//@return pemPublicKey - PEM Formatted public key
function createPemFromPublicKey(x,y) {
    let rawPublicKey = '04' + x.substring(2) + y.substring(2)
    var pemPublicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem')
    return pemPublicKey
}

// createPemFromPublicKey('0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606','0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39')

//list of possible keyformats
//PEM -> DID
//X,Y coordinates
//Buffer
//hex -> 64 bit string

//@param privateKey - hex format 0xAAAAAAAAAAAAAAAA
//@param ethereumAddress - 
async function createDID(ethereumAddress, privateKey) {
    let hexPrivateKey = privateKey
    privateKey = privateKey.substring(2)
    privateKey = Buffer.from(privateKey, "hex")
    let publicKey = eccrypto.getPublic(privateKey);
    let x = publicKey.slice(1, 33);
    let y = publicKey.slice(33, 65);
    let publicKeyX = '0x' + x.toString('hex')
    let publicKeyY = '0x' + y.toString('hex')

    const account = web3.eth.accounts.privateKeyToAccount(hexPrivateKey);
    web3.eth.accounts.wallet.add(account);

    let response = await DIDContract.methods.createDID(ethereumAddress).send({
        from: ethereumAddress,
        gas: 1500000
    })

    // //https://ethereum.stackexchange.com/questions/11253/ethereumjs-how-to-get-public-key-from-private-key
    // //https://ethereum.stackexchange.com/questions/13778/get-public-key-of-any-ethereum-account
    // //https://web3js.readthedocs.io/en/v1.2.0/web3-eth-personal.html#signtransaction

    // //take transactionsignature and extract x and y values

    let id = response.events.CreatedDID.returnValues.id

    await addKey(ethereumAddress, id,publicKeyX,publicKeyY,KeyPurpose.Authentication,ECCurve)
    return id
}

async function addKey(ethereumAddress,id,x,y,purpose,curve) {
    let response = await DIDContract.methods.addKey(id,x,y,purpose,curve).send({
        from: ethereumAddress,
        gas: 1500000
    })
    // console.log(response)
}


// createDID(PUB1, process.env.PK1)
// getDID('0x57d8ec4f6c9ee173128453563c505af4fd8e9158141b4f76f7de392229c3d0e0')

async function getKeys(id) {
    let keys = await DIDContract.methods.getKeys(id).call()
    
    //parse keys and recreate JSON key object from arrays

    return []
}

// getDID('did:signor:<network>:<id>')
//@param DID - did:signor:<network>:<id>
async function getDIDDocument(did) {

    let didArray = did.split(":")
    let id = didArray[3]

    console.log(id)

    let subject = await DIDContract.methods.getSubject(id).call() 

    let key0 = {
        id: did + 'key-0',
        type: ECCurve,
        controller: did,
        ethereumAddress: subject
    }
    
    let authentication = []

    // let keys = getKeys();

    for(let i = 0; i < keys.length ; i++) {
        let pem = createPemFromPublicKey(keys[i].x, keys[i].y)
        let key = 
            {
                id: id + "keys-" + i,
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
    createPemFromPublicKey,
    createDID,
    addKey,
    getKeys,
    getDIDDocument
}