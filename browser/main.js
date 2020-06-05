let ethereumJsUtil = require('ethereumjs-util')
var Web3 = require('web3');
let {
    createPemFromPublicKey,
    createDID,
    addKey,
    getKeys,
    getDIDDocument,
    getKeyLength,
    convertToKeyPurpose
} = require('../lib/index')

let web3, account

// // Wait for loading completion to avoid race conditions with web3 injection timing.
window.addEventListener("load", async () => {
    // document.getElementById("generatePublicKey").onclick = generatePublicKey;
    document.getElementById("createDID").onclick = browserCreateDID;
    document.getElementById("getDIDDocument").onclick = showDidDocument;

    // Modern dapp browsers...
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            web3.eth.getAccounts((err,accs) => 
                {
                    account = accs[0]
                })
        } catch (error) {
            alert(error)
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
    // Use Mist/MetaMask's provider.
        web3 = window.web3;
        web3.eth.getAccounts((err,accs) => 
        {
            account = accs[0]
        })
    }
})


//https://ethereum.stackexchange.com/questions/12033/sign-message-with-metamask-and-verify-with-ethereumjs-utils
async function generatePublicKey() {
    let msg = 'test'
    let signature = await web3.eth.personal.sign(web3.utils.fromUtf8(msg), account);
    var r = signature.slice(0, 66)
    var s = '0x' + signature.slice(66, 130)
    var v = '0x' + signature.slice(130, 132)
    v = parseInt(v)
    const msgBuffer = ethereumJsUtil.toBuffer(web3.utils.fromUtf8(msg));
    const msgHash = ethereumJsUtil.hashPersonalMessage(msgBuffer);
     
    r = ethereumJsUtil.toBuffer(r)
    s = ethereumJsUtil.toBuffer(s)
    
    let publicKey = ethereumJsUtil.ecrecover(
        msgHash,
        v,
        r,
        s
      );
      

    publicKey = ethereumJsUtil.bufferToHex(publicKey)
    // console.log(ethereumJsUtil.bufferToHex(publicKey))
    // const addressBuffer = ethereumJsUtil.publicToAddress(publicKey);
    // const address = ethereumJsUtil.bufferToHex(addressBuffer);
    return publicKey
}

async function browserCreateDID() {
    let publicKey = await generatePublicKey()
    console.log('public key' + publicKey)
    let id = await createDID(account,null,true,publicKey)
    document.getElementById("did").value = "did:signor:mainnet:"+id;
}


async function showDidDocument() {
    let didDocument = await getDIDDocument(document.getElementById("did").value)
    document.getElementById("didDocument").value = JSON.stringify(didDocument);   
}