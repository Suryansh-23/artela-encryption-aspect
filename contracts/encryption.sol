// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title Encryption
 * @dev On-Chain Encryption and Decryption of Data using ChaCha20
 */
contract Encryption {
    // address of the deployer
    address private deployer;

    // event for tracking encryption results externally
    event EncryptionResult(string result);

    constructor() {
        deployer = msg.sender;
    }

    function isOwner(address user) external view returns (bool result) {
        if (user == deployer) {
            return true;
        } else {
            return false;
        }
    }

    // encrypt function that returns value for on-chain consumption
    function encrypt(address aspectId, string memory /* message */, string memory /* key */) public returns (string memory encryptedMessage) {
        bytes memory contextKey = abi.encodePacked(aspectId, "ToContract");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        return success ? string(returnData) : "Error";
    }

    // encrypt function that emits values as events for off-chain consumption
    function encryptOffChain(address aspectId, string memory /* message */, string memory /* key */) public {
        bytes memory contextKey = abi.encodePacked(aspectId, "ToContract");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        emit EncryptionResult(success ? string(returnData) : "Error");
    }

    // decrypt function that returns value for on-chain consumption
    function decrypt(address aspectId, string memory /* message */, string memory /* key */) public returns (string memory decryptedMessage) {
        bytes memory contextKey = abi.encodePacked(aspectId, "ToContract");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        return success ? string(returnData) : "Error";
    }

    // decrypt function that emits values as events for off-chain consumption
    function decryptOffChain(address aspectId, string memory /* message */, string memory /* key */) public {
        bytes memory contextKey = abi.encodePacked(aspectId, "ToContract");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        emit EncryptionResult(success ? string(returnData) : "Error");
    }
}