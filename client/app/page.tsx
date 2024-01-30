/* eslint-disable @next/next/no-async-client-component */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import abi from "@/lib/abi";
import { artelaTestnet } from "@/lib/artela";
import { cn } from "@/lib/utils";
import { useWeb3ModalTheme } from "@web3modal/wagmi/react";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { z } from "zod";

const aspectId = "0x2b49e72D1aBC5B0923C0337973E4AE2aAb554E18";
const contractAddress = "0x819822f9CcD6eD606cF465710C576E7E2e9EDd4B";

// Define the schema for the hex message
const hexMessageSchema = z.object({
    message: z.string().regex(/[a-fA-F0-9]+/),
    msgSwitch: z.boolean(),
});

// Define the schema for the string message
const keySchema = z.object({
    key: z.string().length(44),
    keySwitch: z.boolean(),
});

// Define the schema for the hex message
const hexKeySchema = z.object({
    key: z
        .string()
        .regex(/[a-fA-F0-9]+/)
        .length(88),
    keySwitch: z.boolean(),
});

const hexToString = (hex: string): string => {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
    }
    return str;
};


const stringToHex = (str: string): string => {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16);
    }
    return hex;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Component() {
    const { setThemeMode } = useWeb3ModalTheme();
    setThemeMode("dark");

    const [keySwitch, setKeySwitch] = useState<boolean>(false);
    const [msgSwitch, setMsgSwitch] = useState<boolean>(false);

    const [message, setMessage] = useState<string>(
        "48656c6c6f2c20576f726c6421"
    );
    const [key, setKey] = useState<string>(
        "e2796a262d7726eaab439be0ce55209d92b9c3b49dc5337e0320bd8ee43f86aa79206238b9c815543eda8cb7"
    );
    const [formError, setFormError] = useState<String>("");
    const [btnChoice, setBtnChoice] = useState<string>("");
    const [result, setResult] = useState<{
        hex: string;
        string: string;
        loading: boolean;
    }>({ hex: "", string: "", loading: false });
    const { toast } = useToast();

    const { address } = useAccount();
    const walletClient = useWalletClient({ chainId: artelaTestnet.id });
    const publicClient = usePublicClient({ chainId: artelaTestnet.id });

    const submit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setResult({ hex: "", string: "", loading: true });
        const formData = new FormData(e.target as HTMLFormElement);
        let msg = formData.get("message") as string;
        if (msgSwitch) {
            msg = msg.startsWith("0x") ? msg.slice(2) : msg;
        } else {
            msg = stringToHex(msg);
        }

        let key = formData.get("key") as string;
        if (keySwitch) {
            key = key.startsWith("0x") ? key.slice(2) : key;
        } else {
            key = stringToHex(key);
        }

        const result = { hex: "", string: "", loading: false };
        try {
            const hash = await walletClient?.data?.writeContract({
                account: address,
                address: contractAddress,
                abi: abi,
                functionName: `${btnChoice}OffChain`,
                args: [aspectId, msg, key],
            });

            if (!hash) {
                toast({
                    title: "Uh oh! Something went wrong",
                    description: `There was an error while ${btnChoice}ing the message. Probably something wrong happened with the transaction. Please try again.`,
                    variant: "destructive",
                });
                return;
            }

            // await delay(4000);
            console.log(`${btnChoice}ion txn hash: `, hash);

            const txnRec = await publicClient?.getTransactionReceipt({
                hash: hash,
            });

            const topic = decodeEventLog({
                abi,
                data: txnRec?.logs[0].data,
                topics: txnRec?.logs[0].topics,
            });

            if (topic.args) {
                result.hex = topic.args?.result || "";
                result.string = hexToString(topic.args?.result || "");
            } else {
                throw new Error(
                    "The transaction failed, an error might have occured in the smart contract. Please try again later."
                );
            }
        } catch (err) {
            toast({
                title: "Uh oh! Something went wrong",
                description: `There was an error while ${btnChoice}ing the message: ${
                    (err as Error).message
                }`,
                variant: "destructive",
                duration: 3000,
            });
        }

        setResult(result);
    };

    function validateHexMessage(message: string) {
        const result = hexMessageSchema.safeParse({
            message: message.startsWith("0x") ? message.slice(2) : message,
            msgSwitch: true,
        });
        if (!result.success) {
            // Handle validation error
            setFormError("Message should be a valid hex string");
        }
    }

    function validateHexKey(key: string) {
        const result = hexKeySchema.safeParse({
            key: key.startsWith("0x") ? key.slice(2) : key,
            keySwitch: true,
        });

        if (!result.success) {
            // Handle validation error
            setFormError(
                "Key should be a valid hex string of length 88 characters or bytes"
            );
        }
    }

    // Function to validate the key when the switch is off (string)
    function validateStringKey(key: string) {
        const result = keySchema.safeParse({
            key: key,
            keySwitch: false,
        });

        if (!result.success) {
            // Handle validation error
            setFormError(
                "Key should be a valid string of length 88 characters or 44 bytes"
            );
        }
    }

    useEffect(() => {
        setFormError("");
        if (keySwitch) {
            validateHexKey(key);
        } else {
            validateStringKey(key);
        }

        if (msgSwitch) {
            validateHexMessage(message);
        } else if (message === "") {
            setFormError("Message cannot be empty");
        }
    }, [keySwitch, msgSwitch, message, key]);

    return (
        <main className="flex flex-col items-center justify-center space-y-8">
            <Card className="flex flex-col items-center w-fit card justify-center mx-auto box space-y-10 p-10">
                <CardTitle className="text-3xl font-bold text-white">
                    Aspect Demo
                </CardTitle>
            </Card>
            <div className="flex flex-row space-x-8">
                <Card className="flex flex-col items-center w-[26rem] card justify-center mx-auto box space-y-10 pt-10">
                    <CardContent className="space-y-[3rem]">
                        <form
                            className="flex flex-col space-y-4"
                            onSubmit={submit}>
                            <div className="flex flex-row gap-2">
                                <Input
                                    required
                                    name="message"
                                    value={message}
                                    placeholder={
                                        msgSwitch ? "0x... message" : "message"
                                    }
                                    className="rounded-xl w-64"
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                    }}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="msg-switch"
                                        checked={msgSwitch}
                                        onCheckedChange={() => {
                                            setMsgSwitch(!msgSwitch);
                                        }}
                                    />
                                    <label
                                        className="w-10"
                                        htmlFor="msg-switch">
                                        {msgSwitch ? "hex" : "string"}
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-row gap-2">
                                <Input
                                    required
                                    name="key"
                                    placeholder={
                                        keySwitch ? "0x... key" : "key"
                                    }
                                    className="rounded-xl w-64"
                                    value={key}
                                    onChange={(e) => {
                                        setKey(e.target.value);
                                    }}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="key-switch"
                                        checked={keySwitch}
                                        onCheckedChange={() => {
                                            setKeySwitch(!keySwitch);
                                        }}
                                    />
                                    <label
                                        className="w-10"
                                        htmlFor="key-switch">
                                        {keySwitch ? "hex" : "string"}
                                    </label>
                                </div>
                            </div>

                            <label
                                htmlFor="error"
                                className={cn(
                                    "text-red-500 text-wrap",
                                    formError === "" ? "hidden" : "",
                                    "transition-opacity duration-500"
                                )}>
                                {formError}
                            </label>


                            <div className="flex flex-row justify-center items-center space-x-4 pt-6">
                                <Button
                                    className="font-bold rounded-xl w-full"
                                    type="submit"
                                    disabled={formError !== "" || !address}
                                    onClick={() => setBtnChoice("encrypt")}>
                                    Encrypt
                                </Button>

                                <Button
                                    className="font-bold rounded-xl w-full"
                                    type="submit"
                                    disabled={formError !== "" || !address}
                                    onClick={() => setBtnChoice("decrypt")}>
                                    Decrypt
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Card className="flex flex-col w-[28rem] items-center card mx-auto box space-y-10 p-10">
                    <CardTitle className="text-2xl font-bold text-white">
                        Result
                    </CardTitle>
                    <CardContent className="flex flex-col space-y-4 font-mono items-center justify-center">
                        <div className="flex flex-row gap-x-4 items-center">
                            <label htmlFor="hexResult" className="w-14">
                                Hex
                            </label>
                            <Input
                                name="hexResult"
                                placeholder="0x..."
                                className="rounded-xl w-64"
                                value={result.hex}
                                readOnly
                            />

                            <Button
                                className="rounded-xl"
                                size="icon"
                                onClick={() => {
                                    navigator.clipboard.writeText(result.hex);
                                    toast({
                                        title: "Copied to clipboard",
                                        description:
                                            "The decrypted message (hex) has been copied to your clipboard",
                                        variant: "default",
                                        duration: 3000,
                                    });
                                }}>
                                <Copy size={16} />
                            </Button>
                        </div>
                        <div className="flex flex-row gap-x-4 items-center">
                            <label htmlFor="stringResult" className="w-14">
                                String
                            </label>
                            <Input
                                name="stringResult"
                                placeholder="something here 😉"
                                className="rounded-xl w-64"
                                value={result.string}
                                readOnly
                            />
                            <Button
                                className="rounded-xl"
                                size="icon"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        result.string
                                    );
                                    toast({
                                        title: "Copied to clipboard",
                                        description:
                                            "The decrypted message (string) has been copied to your clipboard",
                                        variant: "default",
                                        duration: 3000,
                                    });
                                }}>
                                <Copy size={16} />
                            </Button>
                        </div>
                        {result.loading && <div>Loading...</div>}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}