require('dotenv').config({ path: './.env'});
let Web3 = require('web3');

let PUB1 = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'

//NOT IN GANACHE
let PUB2 = '0xB1Fe56C22612d38565c44C0eE6D2B22e31A3D388'


const chai = require("chai");
const { expect } = chai;

let {init,
    createDIDRaw,
    createAddKeyRaw,
    createPemFromPublicKey,
    createDID,
    addKey,
    getKeys,
    getDIDDocument,
    getKeyLength,convertToKeyPurpose} = require('../lib/resolver.js')

let { ECCurve, KeyPurpose ,DIDContractAddress} = require('../config/constants')

web3 = new Web3('http://localhost:8545');
let chainId = 1591661810665

init(web3,chainId);

//1. ganache-cli -d DID
//2. npm test
//1591661810665

describe("DID Registry", () => {

    it('Create DID', async () => {
        let signedTx = await createDIDRaw(PUB1,PUB1,process.env.PK1,chainId)
        await web3.eth.sendSignedTransaction(signedTx).on('receipt', (out) => {
                let id = out.logs[0].data
                expect(id).to.equals('0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc');
            }
        );
    })

    it('Add Key and check key length', async () => {
        let x = '0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606'
        let y = '0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39'
        let id = '0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc'

        let signedTx = await createAddKeyRaw(PUB1,process.env.PK1,id,x,y,KeyPurpose.Authentication,ECCurve)
        await web3.eth.sendSignedTransaction(signedTx).on('receipt', async (out) => {
                let length = await getKeyLength('0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc')
                expect(parseInt(length)).to.equals(1)
            }
        );
    })

    // it('Get key length for a did', async ()=> {
    //     let length = await getKeyLength('0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc')
    //     expect(parseInt(length)).to.equals(1)
    // })

    it('Convert X Y coordinates to PEM', async () => {
        let x = '0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606'
        let y = '0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39'
        let generatedPem = createPemFromPublicKey(x,y)

        let PEM = '-----BEGIN PUBLIC KEY-----\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE5orPwCU6EGIN/3BrChsfH1gz6jvrO94i\nUNXycfNWNgZnLrxF4LfqLoFuy3DKAxN7HJR27sY9RjLpkAILe2+6OQ==\n-----END PUBLIC KEY-----'
        expect(generatedPem).to.equals(PEM);  
    })

    it('Convert from integer to KeyPurpose', () => {
        let auth = convertToKeyPurpose(0)
        expect(auth).to.equals('Authentication');  
        let sign = convertToKeyPurpose(1)
        expect(sign).to.equals('Signing');  
        let enc = convertToKeyPurpose(2)
        expect(enc).to.equals('Encryption');  
    })

    it('Get keys', async () => {
        let keys = [{
            x:"0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606",
            y:"0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39",
            keyPurpose:"Authentication",
            curve:"secp256k1-koblitz"
        }]
        keys = JSON.stringify(keys)
        let response = await getKeys("0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc")
        response = JSON.stringify(response)
        expect(keys).to.equals(response);  
    })

    it('Get did document', async() => {
        let did ="did:signor:mainnet:0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc"
        let correctResponse = '{"@context":"https://w3id.org/did/v1","id":"0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc","publicKey":[{"id":"did:signor:mainnet:0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc#key-0","type":"secp256k1-koblitz","controller":"did:signor:mainnet:0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc","ethereumAddress":"0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"}],"authentication":[{"id":"0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc#keys-1","type":"secp256k1-koblitz","controller":"0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc","publicKeyPem":"-----BEGIN PUBLIC KEY-----\\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE5orPwCU6EGIN/3BrChsfH1gz6jvrO94i\\nUNXycfNWNgZnLrxF4LfqLoFuy3DKAxN7HJR27sY9RjLpkAILe2+6OQ==\\n-----END PUBLIC KEY-----"}]}'
        let response = await getDIDDocument(did)
        response = JSON.stringify(response)
        expect(correctResponse).to.equals(response);
    })

})