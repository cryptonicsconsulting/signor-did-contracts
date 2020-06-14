let PUB1 = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'

//NOT IN GANACHE
let PUB2 = '0xB1Fe56C22612d38565c44C0eE6D2B22e31A3D388'

let DIDContractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'

let gasLimit = 1500000
let gasPrice = 30

let ECCurve = 'secp256k1-koblitz'

let KeyPurpose = {
    Authentication : 0,
    Signing : 1,
    Encryption : 2
}

module.exports = {
    gasLimit,
    gasPrice,
    ECCurve,
    KeyPurpose,
    DIDContractAddress,
    PUB1,
    PUB2,
}
