let ethereumJsUtil = require('ethereumjs-util')
var Web3 = require('web3');

let web3, account

// // Wait for loading completion to avoid race conditions with web3 injection timing.
window.addEventListener("load", async () => {
    document.getElementById("generatePublicKey").onclick = generatePublicKey;

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

async function getContract() {
    let contract = new web3.eth.Contract(DIDAbi,DIDContractAddress)
    return contract
}

async function generatePublicKey() {
    // console.log(web3)
    // console.log(account)

    //  let signature = web3.personal.sign(web3.fromUtf8("dinosaur"), account);
    let signature = await web3.eth.personal.sign('Test', account);
    //let signature = await web3.eth.sign("test",account);
    // console.log("DONE SINGING")
    console.log(signature)
}