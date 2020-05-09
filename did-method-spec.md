# Signor DID Method

This document specifies the DID method for Signor.

This specifications complies with the latest version of the generic [DID specification](https://w3c.github.io/did-core/) as specified by the _W3C Credentials Community Group_.

The functionality for this method is provided by the `DIDRegistry` smart contract found in this [Github source code repository](https://github.com/cryptonicsconsulting/signor-did-contracts). 


## DID Scheme

This method shall be identified with the name `sginaor`. A Signor DID has the following format:

```
did:signor:<network>:<32 byte hexadecimal string>
```

For example:

```
did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4
```

The `<32 byte hexadecimal string>` corresponds to a `keccak256` hash of an Ethereum address concatenated with a nonce as generated in the [DIDRegistry smart contract](https://github.com/cryptonicsconsulting/signor-did-contracts/blob/master/contracts/DIDRegistry.sol).  

The `<network>` string corresponds to human readable form of an distributed ledger capable of running Ethereum smart contracts, including the following:

| Identifier | Network               |
| ---------- | --------------------- |
| mainet     | Ethereum main network |
| ropsten    | Ropsten test network  |
| rinkeby    | Rinkeby test network  |
| Kovan      | Kovan test network    |

DIDs are registered in the DID Registry on-chain, and have a controller and a subject, expressed in the form of Ethereum addresses. The DID controller may or may not be the subject itself. Multiple controllers can be implemented through proxy smart contracts. 

### ID-String Generation

Identifier strings are generated in the following line of the `DIDRegistry` contract:

```
bytes32 _hash = keccak256(abi.encodePacked(msg.sender, nonce));
```

Where `nonce` is a unique number on each call, so that the result is considered random and an address is able to create and control multiple DIDs.

## DID Structure On-chain

Every DID record on the ledger presents the following structure:

```
struct DID {
        address controller;
        address subject;
        uint256 created;
        uint256 updated;
}
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
  id: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
  publicKey: [{
   	id: 'did:signor:mainet:0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4#key-1',
   	type: 'secp256k1-koblitz',
   	controller: 'did:signor:mainet0x123fa34de487a908aaa44927430cdf01aebdaa0a67e3b03eac008356a7a920b4',
   	ethereumAddress: '0xA335e018d5d4bD9D772F25a053E91B58B8a160A8'}],
}
```

The following methods provided by the `DIDRegistry` contract can be used by a resolver to construct the DID document:

- **getController(bytes32 id)**: returns the Ethereum address of the DID controller
- **getSubject(bytes32 id)**: returns the Ethereum address of the DID controller

### Update

Changes to an identity contract are made through executing transactions directly on the `DIDRegistry` contract, which is only be doable by the controller address:

* **setController(bytes32 id, address newController)**: A DID controller address can transfer control of the DID to a different address.

### Delete

The following method is provided by the ledger contract:

* **deleteDID(bytes32 id)**

Only the controller address is able to delete an existing DID. 

