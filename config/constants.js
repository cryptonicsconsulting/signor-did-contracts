let PUB1 = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
let PUB2 = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
let PUB3 = '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'

let DIDContractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'

let ECCurve = 'secp256k1-koblitz'

let KeyPurpose = {
    Authentication : 0,
    Signing : 1,
    Encryption : 2
}

module.exports = {
    ECCurve,
    KeyPurpose,
    DIDContractAddress,
    PUB1,
    PUB2,
    PUB3
}
