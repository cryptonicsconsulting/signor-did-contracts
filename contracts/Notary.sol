// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "@openzeppelin/contracts/cryptography/ECDSA.sol";


contract Notary {
  struct Record{
    uint256 timestamp;
    bytes signature;
  }

  mapping (bytes32 => Record) records;
  
  function getRecord(bytes32 _hash) public view returns(uint256 timestamp, bytes memory sig) {
    timestamp = records[_hash].timestamp;
    sig = records[_hash].signature;
  }

  
  function writeRecord(bytes32 _hash, bytes memory sig) public {
    require(records[_hash].timestamp == 0,"This document has already been recorded");
    require(sig.length == 0 || sig.length == 65, "Signature must be emptry or 65 bytes"); 
    records[_hash].signature = sig;
    records[_hash].timestamp = block.timestamp;
  }


  function getRecordAndSigner(bytes32 _hash) public view returns(uint256 timestamp, address signer) {
    timestamp = records[_hash].timestamp;
    bytes memory sig = records[_hash].signature;

    if (timestamp != 0) {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(_hash);
        signer = ECDSA.recover(prefixedHash, sig);
    }

  }  


}