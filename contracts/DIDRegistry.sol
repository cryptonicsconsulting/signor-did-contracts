// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
 * @title DIDRegistry
 * @dev DID Registry for the Signor DID method.
 * A DID is controlled by their creator address by default, but control can be assigned to any
 * different adddress by their current controller.
 */
contract DIDRegistry {

    struct DID {
        address controller;
        uint256 created;
        uint256 updated;
        Secp256k1Key[] keys;
    }

    enum KeyPurpose { Authentication, Signing, Encryption }

    //public key
    struct Secp256k1Key {
        byte[65] pubKey;
        KeyPurpose purpose;
    }


    mapping(address => DID) public dids;

   
    uint constant MAX_KEYS = 32; 

    event CreatedDID(address id);
    event DeletedDID(address id);
    event SetController(address id, address newController);

    modifier onlyController(address id) {
        require(dids[id].controller == msg.sender, "transaction sender is not DID controller");
        _;
    }

    /**
     * @dev Register new DID.
     * @param _subject - The DID subject
     */
    function createDID(address _subject) public {
        require(_subject != address(0), "subject address cannot be 0");
        

        dids[_subject].controller = msg.sender;
        dids[_subject].created = block.timestamp;
        dids[_subject].updated = block.timestamp;
      

        emit CreatedDID(_subject);
    
    }


    /**
     * @dev Remove DID. Only callable by DID controller.
     * @param id — The identifier (DID) to be deleted
     */
    function deleteDID(address id)
        public
        onlyController(id)
    {
        delete dids[id];
        emit DeletedDID(id);
    }

    /**
     * @dev Returns corresponding controller for given DID
     * @param id — The identifier (DID) to be resolved to its controller address
     */
    function getController(address id)
        public
        view
        returns (address)
    {
        return dids[id].controller;
    }


    /**
     * @dev Change controller address. Only callable by current DID controller.
     * @param id — The identifier (DID) to be updated
     * @param newController — New controller addresss
     */
    function setController(address id, address newController)
        public
        onlyController(id)
    {
        dids[id].controller = newController;
        dids[id].updated = block.timestamp;
        emit SetController(id, newController);
    }


    function addKey(address id, byte[65] memory key, KeyPurpose _purpose)
        public
        onlyController(id)
    {
        require(dids[id].keys.length < MAX_KEYS, "DID key limit has been reached");
        dids[id].keys.push(Secp256k1Key(key, _purpose));

    }


    function removeKey (address id, uint index)
        public
        onlyController(id)
    {
        
        if (dids[id].keys.length > 1) {
            dids[id].keys[index] = dids[id].keys[dids[id].keys.length-1];
        }
        dids[id].keys.pop();

    }

    function getKeysLength(address id) public view returns(uint8) {
        return uint8(dids[id].keys.length);
    }

    function getKey(address id, uint index) public view returns (byte[65] memory , uint) {
        uint purpose = uint(dids[id].keys[index].purpose);
        return (dids[id].keys[index].pubKey, purpose);
    }
   
}