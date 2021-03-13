// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "@openzeppelin/contracts/cryptography/ECDSA.sol";


contract Notary {
  struct Record{
    uint256 timestamp;
    bytes signature;
    string ZkAuthorshipClaim;
  }

  mapping (bytes32 => Record) records;
  
  function getRecord(bytes32 _hash) public view returns(uint256 timestamp, bytes memory sig, string memory claim) {
    timestamp = records[_hash].timestamp;
    sig = records[_hash].signature;
    claim = records[_hash].ZkAuthorshipClaim;
  }

  
  function setRecord(bytes32 _hash, bytes memory sig, string memory claim) public {
    require(records[_hash].timestamp == 0,"This document has already been recorded");
    require(sig.length == 0 || sig.length == 65, "Signature must be emptry or 65 bytes"); 
    records[_hash].signature = sig;
    records[_hash].ZkAuthorshipClaim = claim;
    records[_hash].timestamp = block.timestamp;
    records[_hash].ZkAuthorshipClaim = claim;
  }




}