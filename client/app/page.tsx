"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Component() {
    const [keySwitch, setKeySwitch] = useState<boolean>(false);
    const [msgSwitch, setMsgSwitch] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("");
    const [key, setKey] = useState<string>("");
    const [formError, setFormError] = useState<String>("");

    const checkHex = (str: string): boolean => {
        if (str.startsWith("0x")) str = str.slice(2);
        if (str.length === 0) return true;

        console.log(str);

        const hex = /^[0-9A-Fa-f]+$/g;
        return hex.test(str);
    };

    const stringToHex = (str: string): string => {
        let hex = "";
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const hexValue = charCode.toString(16);

            // Pad with zeros to ensure two-digit representation
            hex += hexValue.padStart(2, "0");
        }
        return hex;
    };

    const hexToString = (hex: string): string => {
        let str = "";
        for (let i = 0; i < hex.length; i += 2) {
            const hexValue = hex.slice(i, i + 2);
            const decimalValue = parseInt(hexValue, 16);
            str += String.fromCharCode(decimalValue);
        }
        return str;
    };

    return (
        <main className="flex flex-col items-center justify-center space-y-8">
            <Card className="flex flex-col items-center w-fit card justify-center mx-auto box space-y-10 p-10">
                <CardTitle className="text-3xl font-bold text-white">
                    Aspect Demo
                </CardTitle>
            </Card>
            <div className="flex flex-row space-x-8">
                <Card className="flex flex-col items-center w-fit card justify-center mx-auto box space-y-10 pt-10">
                    <CardContent className="space-y-[3rem]">
                        <div className="flex flex-col space-y-4">
                            {/* <Label htmlFor="name4" className="mx-2">
                                Enter the Message
                            </Label> */}
                            <div className="flex flex-row gap-2">
                                <Input
                                    name="message"
                                    value={message}
                                    placeholder={
                                        msgSwitch ? "0x... message" : "message"
                                    }
                                    className="rounded-xl w-64"
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        if (msgSwitch) {
                                            console.log(
                                                e.target.value,
                                                checkHex(e.target.value)
                                            );
                                            if (!checkHex(e.target.value)) {
                                                setFormError(
                                                    "Message should be in hex format"
                                                );
                                            } else {
                                                setFormError("");
                                            }
                                        }
                                    }}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="msg-switch"
                                        checked={msgSwitch}
                                        onCheckedChange={() => {
                                            setMsgSwitch(!msgSwitch);
                                            if (
                                                !msgSwitch &&
                                                !checkHex(message)
                                            ) {
                                                setFormError(
                                                    "Message should be in hex format"
                                                );
                                            } else {
                                                setFormError("");
                                            }
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
                                    name="key"
                                    placeholder={
                                        keySwitch ? "0x... key" : "key"
                                    }
                                    className="rounded-xl w-64"
                                    value={key}
                                    onChange={(e) => {
                                        setKey(e.target.value);
                                        if (keySwitch) {
                                            console.log(
                                                e.target.value,
                                                checkHex(e.target.value)
                                            );
                                            if (!checkHex(e.target.value)) {
                                                setFormError(
                                                    "Key should be in hex format"
                                                );
                                            } else {
                                                setFormError("");
                                            }
                                        }
                                    }}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="key-switch"
                                        checked={keySwitch}
                                        onCheckedChange={() => {
                                            setKeySwitch(!keySwitch);
                                            if (!keySwitch && !checkHex(key)) {
                                                setFormError(
                                                    "Key should be in hex format"
                                                );
                                            } else {
                                                setFormError("");
                                            }
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
                                    "text-red-500",
                                    formError === "" ? "hidden" : "",
                                    "transition-opacity duration-500"
                                )}>
                                {formError}
                            </label>

                            <div className="flex flex-row justify-center items-center space-x-4 pt-6">
                                <Button
                                    className="font-bold rounded-xl w-full"
                                    type="submit"
                                    disabled={formError !== ""}>
                                    Encrypt
                                </Button>

                                <Button
                                    className="font-bold rounded-xl w-full"
                                    type="submit"
                                    disabled={formError !== ""}>
                                    Decrypt
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex flex-col w-96 items-center card mx-auto box space-y-10 p-10">
                    <CardTitle className="text-2xl font-bold text-white">
                        Result
                    </CardTitle>
                </Card>
            </div>
        </main>
    );
}
