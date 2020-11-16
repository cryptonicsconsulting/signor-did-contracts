# Signor DID Method Specification v0.1

This document specifies the DID method for Signor.

This specifications complies with the latest version of the generic [DID specification](https://w3c.github.io/did-core/) as specified by the _W3C Credentials Community Group_.

The functionality for this method is provided by the `DIDRegistry` smart contract found in this [Github source code repository](https://github.com/cryptonicsconsulting/signor-did-contracts). 


## DID Scheme

This method shall be identified with the name `sginor`. A Signor DID has the following format:

```javascript
did:signor:<network>:<20 byte hexadecimal string>
```

For example:

```javascript
did:signor:mainet:0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

The `<20 byte hexadecimal string>` corresponds to an Ethereum address in the current implementation, but maybe abstracted to different identfiers when implemented on different networks.  

The `<network>` string corresponds to human readable form of an distributed ledger capable of running Ethereum smart contracts, including the following:

| Identifier | Network               |
| ---------- | --------------------- |
| mainet     | Ethereum main network |
| ropsten    | Ropsten test network  |
| rinkeby    | Rinkeby test network  |
| Kovan      | Kovan test network    |

DIDs are registered in the DID Registry on-chain, and have a controller and a subject, expressed in the form of Ethereum addresses. The DID controller may or may not be the subject itself. Multiple controllers can be implemented through proxy smart contracts. 


## DID Structure On-chain

Every DID record on the ledger presents the following structure:

```javascript
struct DID {
        address controller;
        uint256 created;
        uint256 updated;
}
```
The subject is simply the DIDs Ehereum address and this is mapped to the above data structure:

```javascript
mapping(address => DID) public dids;
```

## CRUD Operations

The following section defines the operations supported to manage DIDs.

### Create

DID creation is done by submitting a transaction to the `DIDRegistry` contract invoking the following method:

* **createDID(address subject)**

This will generate the corresponding on-chain DID representation and assign the DID subject to be the subject Ethereum address argument. The controller is automatically assigned to be the Ethereum address of the transaction sender. This may or my to be the same as the subject's address.

### Read

A DID resolver **MUST** be able to take a `did:signor:<network>:<id>` string as an input and generate a JSON object providing all information necessary to authenticate and validate the given DID. The DID document is dynamically constructed from the data stored on the DID Register. A DID resolved via this method should look like the following:


```js
{
  '@context': 'https://w3id.org/did/v1',
  id: 'did:signor:mainet:0xA335e018d5d4bD9D772F25a053E91B58B8a160A8',
  publicKey: [{
   	id: 'did:signor:mainet:0xA335e018d5d4bD9D772F25a053E91B58B8a160A8#key-1',
   	type: 'secp256k1-koblitz',
   	controller: 'did:signor:mainet0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
   	ethereumAddress: '0xA335e018d5d4bD9D772F25a053E91B58B8a160A8'}],
}
```


### Update

Changes to an identity contract are made through executing transactions directly on the `DIDRegistry` contract, which is only be doable by the controller address:

* **setController(address id, address newController)**: A DID controller address can transfer control of the DID to a different address.

### Delete

The following method is provided by the ledger contract:

* **deleteDID(address id)**

Only the controller address is able to delete an existing DID. 

# Security Considerations

- DID documents are generated dynamically by off-chain resolvers that perform reads from the ledger. This means that these resolvers are essentially trusted code and care must be taken when obtaining such a resolver. For instance integrity verification of library downloads should be performed.
- Key recovery is out of scope of this method. Proper key management in user-level wallets or additional smart contracts should be implemented. 

# Privacy Considerations

This DID method only stores Ethereum addresses derived from public keys and modification timestamps on the ledger. Therefore, there are no privacy concern implicit to the method. However, care must be taken when using a single DID for several purposes if correlation is undesired. 
