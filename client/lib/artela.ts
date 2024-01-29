import { defineChain } from "viem";

export const artelaTestnet = defineChain({
    id: 1,
    chainId: 11822,
    name: "Artela Testnet",
    network: "artela-testnet",
    nativeCurrency: {
        name: "Artela",
        symbol: "ART",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [
                "https://betanet-rpc1.artela.network",
                "https://betanet-rpc2.artela.network",
            ],
        },
        public: {
            http: [
                "https://betanet-rpc1.artela.network",
                "https://betanet-rpc2.artela.network",
            ],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://betanet-scan.artela.network/",
        },
    },
});
