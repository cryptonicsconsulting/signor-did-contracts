var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

let {DIDAbi} = require('../config/abi')
let {PUB1,PUB2,DIDContractAddress} = require('../config/constants')

let DIDContract = new web3.eth.Contract(DIDAbi,DIDContractAddress)

async function createDID() {
    let response = await DIDContract.methods.createDID(PUB2).send({
        from:'0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
        gas: 1500000
    })

    let id = response.events.CreatedDID.returnValues.id
    return id
}

async function getDID(id) {
    let response = await DIDContract.dids;
}

createDID()