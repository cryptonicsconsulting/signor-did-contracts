// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title ZkAuthRegistry
 * @dev A base ontract mapping DIDs to Schnorr ZK ceredentials 
 * Note, that write access permisision should be left to sub contracts.
 */
contract ZKAuthRegistry {

    address DIDRegistry;

    mapping(address => bytes) public credentials;

   
    constructor(address _DIDRegistry) {
        DIDRegistry = _DIDRegistry;
    
    }


    
   
}