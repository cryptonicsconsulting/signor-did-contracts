var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
var eccrypto = require("eccrypto");

let {DIDAbi} = require('../config/abi')
let {PUB1,PUB2,DIDContractAddress} = require('../config/constants')

let DIDContract = new web3.eth.Contract(DIDAbi,DIDContractAddress)

// privateKeyToPublicKey('6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1')

//list of possible keyformats
//PEM -> DID
//X,Y coordinates
//Buffer
//hex -> 64 bit string


async function privateKeyToPublicKey(privateKey) {
    // var privateKey = eccrypto.generatePrivate();
    // console.log(privateKey)

    //wants buffer
    // Corresponding uncompressed (65-byte) public key.
    var publicKey = eccrypto.getPublic(privateKey);
    console.log(publicKey)
}

async function createDID(publicKey, privateKey) {
    // const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    let response = await DIDContract.methods.createDID(publicKey).send({
        from: publicKey,
        gas: 1500000
    })

    //https://ethereum.stackexchange.com/questions/11253/ethereumjs-how-to-get-public-key-from-private-key
    //https://ethereum.stackexchange.com/questions/13778/get-public-key-of-any-ethereum-account
    //https://web3js.readthedocs.io/en/v1.2.0/web3-eth-personal.html#signtransaction

    //take transactionsignature and extract x and y values

    let id = response.events.CreatedDID.returnValues.id
    return id
}


async function addKey() {

}

async function getDID(id) {
    let response = await DIDContract.dids;



    let did = {
        '@context': 'https://w3id.org/did/v1',
        id: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
        publicKey: [{
             id: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4#key-1',
             type: 'secp256k1-koblitz',
             controller: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
             ethereumAddress: '0xA335e018d5d4bD9D772F25a053E91B58B8a160A8'}],
      }
      
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