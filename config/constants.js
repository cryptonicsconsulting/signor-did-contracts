
let DIDContractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'

let gasLimit = 1500000
let gasPrice = 60000000000

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
}
