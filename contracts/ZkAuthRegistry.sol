// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./DIDRegistry.sol";

/**
 * @title ZkAuthRegistry
 * @dev A base ontract mapping DIDs to Schnorr ZK ceredentials 
 * Note, that write access permisision should be left to sub contracts.
 */
contract ZkAuthRegistry {

    DIDRegistry didRegistry;

    mapping(address => string) public credentials;


    constructor(address _didRegistry) {
        didRegistry = DIDRegistry(_didRegistry);
    
    }

    function setCredential(address _did, string calldata _credential) public {
        require(didRegistry.getController(_did) == msg.sender, "ZkAuthRegistry: not authorized");
        credentials[_did] = _credential;

    }
    
    function getCredential(address _did) public view returns(string memory) {
        
        return(credentials[_did]);

    }
}