        // var web3 = new Web3('http://localhost:8545');
        // let callData = createCallData(web3,'createDID',['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'])
        // console.log(callData)

let callData = '0x62f413cf00000000000000000000000090f8bf6a479f320ead074411a4b0e7944ea8c9c1'

// // let contractAddress = ''

window.onload = async function (e) {
    if(ethereum.selectedAddress == null) {
        ethereum.send('eth_requestAccounts')
    }


    var publicKey = document.getElementById("generatePublicKey")
    publicKey.onclick = function (e) {
        
      // let data = {
      //   a:'abc'
      // }

      // data = JSON.stringify(data)

      // ethereum.sendAsync(
      //   {
      //     method: "eth_sign",
      //     params: [ethereum.selectedAddress, data],
      //     from: ethereum.selectedAddress
      //   },
      //   function (err, result) {
      //     // if (err || result.error) {
      //     //   return console.error(result);
      //     // }
  
      //     console.log(result)
      //     // const signature = parseSignature(result.result.substring(2));
      //   }
      // )
    }



    var sendTx = document.getElementById("sendTransaction");
    sendTx.onclick = function (e) {
        console.log(ethereum.selectedAddress)

        const transactionParameters = {
            // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
            // gas: '0x2710', // customizable by user during MetaMask confirmation.
            to: '0xCfEB869F69431e42cdB54A4F4f105C19C080A601', // Required except during contract publications.
            from: web3.eth.accounts[0], // must match user's active address.
            value: '0x00', // Only required to send ether to the recipient from the initiating external account.
            data: callData, // Optional, but used for defining smart contract creation and interaction.
          };
          
          ethereum.sendAsync(
            {
              method: 'eth_sendTransaction',
              params: [transactionParameters],
              from: ethereum.selectedAddress,
            },
            function (err, result) {
                console.log(result)
                if (err || result.error) {
                  return console.error(result);
                }
            }
          );
    }

}

// function createCallData(web3, functionName, params) {
//     try {
//         let abi = getAbi(functionName)
//         let callData = web3.eth.abi.encodeFunctionCall(abi, params);
//         return callData
//     }
//     catch (e) {
//         return e;
//     }
// }

// function getAbi(functionName) {
//     for(abi of DIDAbi) {
//         if(abi.name == functionName) {
//             return abi
//         }
//     }

//     return null
// }