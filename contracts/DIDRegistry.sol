pragma solidity ^0.5.16;


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
        bytes32 metadata;
    }

    mapping(bytes32 => DID) public dids;
    uint256 public nonce = 0;

    event CreatedDID(bytes32 id, bytes32 metadata);
    event DeletedDID(bytes32 id);
    event SetMetadata(bytes32 id, bytes32 metadata);
    event SetController(bytes32 id, address newController);

    modifier onlyController(bytes32 id) {
        require(dids[id].controller == msg.sender, "sender has no control of this DID");
        _;
    }

    /**
     * @dev Register new DID.
     * @param _metadata — Arbitrary 32-byte data field. Can be later changed by their owner.
     */
    function createDID(bytes32 _metadata)
        public
        returns (bytes32)
    {
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, nonce));

        dids[_hash].controller = msg.sender;
        dids[_hash].created = now;
        dids[_hash].updated = now;
        dids[_hash].metadata = _metadata;
        nonce = nonce + 1;

        emit CreatedDID(_hash, _metadata);
        return _hash;
    }

    /**
     * @dev Update DID metadata. Only callable by DID controller.
     * @param id — The identifier (DID) to be updated
     * @param _metadata — Arbitrary 32-byte value to be assigned as metadata.
     */
    function setMetadata(bytes32 id, bytes32 _metadata)
        public
        onlyController(id)
    {
        dids[id].metadata = _metadata;
        dids[id].updated = now;
        emit SetMetadata(id, _metadata);
    }

    /**
     * @dev Remove DID. Only callable by DID controller.
     * @param id — The identifier (DID) to be deleted
     */
    function deleteDID(bytes32 id)
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
    function getController(bytes32 id)
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
    function setController(bytes32 id, address newController)
        public
        onlyController(id)
    {
        dids[id].controller = newController;
        dids[id].updated = now;
        emit SetController(id, newController);
    }
}