var KeyEncoder = require('key-encoder').default
keyEncoder = new KeyEncoder('secp256k1')

function createPemFromPublicKey() {

    let rawPublicKey = '0430ff11c297c2cc55d47526513033a5cb6ce385067fcae1d34b03a409d4e7766ff28ae19f4f7d65c3eed1b4ad7b40546276628a3ee39b349b5bf79592235fdd05'
    var pemPublicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem')
    console.log(pemPublicKey)
}


createPemFromPublicKey()