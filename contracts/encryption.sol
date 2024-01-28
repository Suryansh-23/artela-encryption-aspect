// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title Encryption
 * @dev On-Chain Encryption and Decryption of Data using AES
 */
contract Encryption {
    address private deployer;

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

    function encrypt(address aspectId, string memory /* message */, string memory /* key */) public returns (string memory encryptedMessage) {
        bytes memory contextKey = abi.encodePacked(aspectId, "ToContract");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        return success ? string(returnData) : "Error";
    }

    function decrypt(address aspectId, string memory /* message */, string memory /* key */) public returns (string memory decryptedMessage) {
        bytes memory contextKey = abi.encodePacked(aspectId, "ToContract");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        return success ? string(returnData) : "Error";
    }
}