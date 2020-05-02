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
        address subject;
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
        require(dids[id].controller == msg.sender, "transaction sender is not DID controller");
        _;
    }

    /**
     * @dev Register new DID.
     * @param _metadata — Arbitrary 32-byte data field. Can be later changed by the controler.
     * @param _subject - The DID subject
     */
    function createDID(address _subject, bytes32 _metadata)
        public
        returns (bytes32)
    {
        require(_subject != address(0), "subject address cannot be 0");
        bytes32 _id = keccak256(abi.encodePacked(msg.sender, nonce));

        dids[_id].controller = msg.sender;
        dids[_id].subject = _subject;
        dids[_id].created = now;
        dids[_id].updated = now;
        dids[_id].metadata = _metadata;
        nonce = nonce + 1;

        emit CreatedDID(_id, _metadata);
        return _id;
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
     * @dev Returns corresponding subject of a given DID
     * @param id — The identifier (DID) to be resolved to its subject address
     */
    function getSubject(bytes32 id)
        public
        view
        returns (address)
    {
        return dids[id].subject;
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