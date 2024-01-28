"use strict";

// import required libs
import { readFileSync } from "fs";
import Web3 from "web3";

async function deploy() {
    //  Replace with the node connection to Artela
    let node = "https://betanet-rpc1.artela.network/";

    // Replace with the path to your smart contract abi file
    let abiPath = "./build/contract/Storage.abi";

    // Replace with the path to your smart contract byte code file
    let byteCodePath = "./build/contract/Storage.bin";

    // Replace with your private key
    let privateKey =
        "0x653348a7b2e4c1d06ea0482fb5d7e63c33f5ef79361fc1515db2b72f3274d9a9";

    const web3 = new Web3(node);

    const deployParams = {
        data: null,
        arguments: null,
    };

    let byteTxt = readFileSync(byteCodePath, "utf-8").toString().trim();
    if (byteTxt.startsWith("0x")) {
        byteTxt = byteTxt.slice(2);
    }

    deployParams.data = byteTxt.trim();

    let abiTxt = readFileSync(abiPath, "utf-8").toString().trim();
    const contractAbi = JSON.parse(abiTxt);

    let account = web3.eth.accounts.privateKeyToAccount(privateKey.trim());
    web3.eth.accounts.wallet.add(account.privateKey);

    // instantiate an instance of demo contract
    let tokenContract = new web3.eth.Contract(contractAbi);

    // deploy contract
    let tokenDeploy = tokenContract.deploy(deployParams);
    let nonceVal = await web3.eth.getTransactionCount(account.address);

    let tokenTx = {
        from: account.address,
        data: tokenDeploy.encodeABI(),
        nonce: nonceVal,
        gasPrice: 1000,

        gas: 7000000,
    };

    let signedTokenTx = await web3.eth.accounts.signTransaction(
        tokenTx,
        account.privateKey
    );
    await web3.eth
        .sendSignedTransaction(signedTokenTx.rawTransaction)
        .on("receipt", (receipt) => {
            console.log(receipt);
            console.log("contract address: ", receipt.contractAddress);
        });
}

deploy().then();
