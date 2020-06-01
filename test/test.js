require('dotenv').config({ path: './.env'});

const chai = require("chai");
const { expect } = chai;

let {createPemFromPublicKey,
    createDID,
    addKey,
    getKeys,
    getDIDDocument} = require('../lib/index')

let { ECCurve, KeyPurpose, PUB1 , PUB2 ,DIDContractAddress} = require('../config/constants')

//1. ganache-cli -d DID
//2. truffle deploy --network development

describe("DID Registery", () => {

    it('Create DID', async () => {
        let id = await createDID(PUB1, process.env.PK1);
        expect(id).to.equals('0x88987af7d35eabcad95915b93bfd3d2bc3308f06b7197478b0dfca268f0497dc');
    })

    it('Convert X Y coordinates to PEM', async () => {
        let x = '0xe68acfc0253a10620dff706b0a1b1f1f5833ea3beb3bde2250d5f271f3563606'
        let y = '0x672ebc45e0b7ea2e816ecb70ca03137b1c9476eec63d4632e990020b7b6fba39'
        let generatedPem = createPemFromPublicKey(x,y)

        let PEM = '-----BEGIN PUBLIC KEY-----\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE5orPwCU6EGIN/3BrChsfH1gz6jvrO94i\nUNXycfNWNgZnLrxF4LfqLoFuy3DKAxN7HJR27sY9RjLpkAILe2+6OQ==\n-----END PUBLIC KEY-----'
        expect(generatedPem).to.equals(PEM);  
    })

})