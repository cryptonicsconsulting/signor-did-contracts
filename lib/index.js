require('dotenv').config({ path: '../.env' })

var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
var eccrypto = require("eccrypto");

let { DIDAbi } = require('../config/abi')
let { ECCurve, KeyPurpose, PUB1 , PUB2 ,DIDContractAddress} = require('../config/constants')

let DIDContract = new web3.eth.Contract(DIDAbi,DIDContractAddress)

// privateKeyToPublicKey('6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1')

//list of possible keyformats
//PEM -> DID
//X,Y coordinates
//Buffer
//hex -> 64 bit string

// async function privateKeyToPublicKey(privateKey) {
//     // var privateKey = eccrypto.generatePrivate();
//     // console.log(privateKey)

//     //wants buffer
//     // Corresponding uncompressed (65-byte) public key.
//     var publicKey = eccrypto.getPublic(privateKey);
//     console.log(publicKey)
// }

// async function getPublicKeyFromTx(tx) {

// }




//@param privateKey - hex format 0xAAAAAAAAAAAAAAAA
//@param ethereumAddress - 
async function createDID(ethereumAddress, privateKey) {

    privateKey = privateKey.substring(2)
    privateKey = Buffer.from(privateKey, "hex")
    let publicKey = eccrypto.getPublic(privateKey);
    let x = publicKey.slice(1, 33);
    let y = publicKey.slice(33, 65);
    let publicKeyX = '0x' + x.toString('hex')
    let publicKeyY = '0x' + y.toString('hex')
    // console.log(publicKeyX)
    // console.log(publicKeyY)
    // // console.log(privateKey)
    // //console.log(pub)

    // const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    // // const account = web3.eth.accounts.privateKeyToAccount('0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');
    // web3.eth.accounts.wallet.add(account);

    let response = await DIDContract.methods.createDID(ethereumAddress).send({
        from: ethereumAddress,
        gas: 1500000
    })

    // console.log(response)

    // //https://ethereum.stackexchange.com/questions/11253/ethereumjs-how-to-get-public-key-from-private-key
    // //https://ethereum.stackexchange.com/questions/13778/get-public-key-of-any-ethereum-account
    // //https://web3js.readthedocs.io/en/v1.2.0/web3-eth-personal.html#signtransaction

    // //take transactionsignature and extract x and y values

    let id = response.events.CreatedDID.returnValues.id
    console.log(id)

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


createDID(PUB1, process.env.PK1)
// getDID('0x57d8ec4f6c9ee173128453563c505af4fd8e9158141b4f76f7de392229c3d0e0')

async function getDID(id) {
    // let response = await DIDContract.methods.nonce().call()
    let response = await DIDContract.methods.dids(id).call()
    console.log(response)

    // let did = {
    //     '@context': 'https://w3id.org/did/v1',
    //     id: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
    //     publicKey: [{
    //          id: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4#key-1',
    //          type: 'secp256k1-koblitz',
    //          controller: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
    //          ethereumAddress: '0xA335e018d5d4bD9D772F25a053E91B58B8a160A8'}],
    //   }
      
}



// {
//     "@context": "https://www.w3.org/ns/did/v1",
//     "id": "did:example:123456789abcdefghi",
//     "publicKey": [{
//       "id": "did:example:123456789abcdefghi#key-1",
//       "type": "RsaVerificationKey2018",
//       "controller": "did:example:123456789abcdefghi",
//       "publicKeyPem": "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n"
//     }, ...],
//     "authentication": [
  
//       "#key-1"
//     ]
//   }
  

// createDID()