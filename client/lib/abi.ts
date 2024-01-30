const abi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "result",
                type: "string",
            },
        ],
        name: "EncryptionResult",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "aspectId", type: "address" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "string", name: "", type: "string" },
        ],
        name: "decrypt",
        outputs: [
            {
                internalType: "string",
                name: "decryptedMessage",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "aspectId", type: "address" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "string", name: "", type: "string" },
        ],
        name: "decryptOffChain",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "aspectId", type: "address" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "string", name: "", type: "string" },
        ],
        name: "encrypt",
        outputs: [
            {
                internalType: "string",
                name: "encryptedMessage",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "aspectId", type: "address" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "string", name: "", type: "string" },
        ],
        name: "encryptOffChain",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "isOwner",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
] as const;
export default abi;
