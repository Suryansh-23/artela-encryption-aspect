import { artelaTestnet } from "@/lib/artela";
import { use } from "react";
import { createPublicClient, createWalletClient } from "viem";
import { createConfig, http } from "wagmi";

export const viewConfig = createConfig({
    chains: [artelaTestnet],
    transports: {
        [artelaTestnet.id]: http("https://betanet-rpc1.artela.network/"),
    },
});

export const publicClient = createPublicClient({
    chain: artelaTestnet,
    transport: http("https://betanet-rpc1.artela.network/"),
});
// declare module "wagmi" {
//     interface Register {
//         wagmiConfig: typeof wagmiConfig;
//     }
// }
