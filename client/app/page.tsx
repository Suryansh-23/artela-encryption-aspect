"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import abi from "@/lib/abi";
import { z } from "zod";

const aspectId = "0x150A22c581a2B4BeDfEfEEC25C43519e593EF2E0";

const messageSchema = z.object({
  message: z.string().max(44),
  msgSwitch: z.boolean(),
});

// Define the schema for the hex message
const hexMessageSchema = z.object({
  message: z.string().regex(/^0x[a-fA-F0-9]{1,88}$/),
  msgSwitch: z.boolean(),
});

export default function Component() {
  const [keySwitch, setKeySwitch] = useState<boolean>(false);
  const [msgSwitch, setMsgSwitch] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [formError, setFormError] = useState<String>(
    "Key should be of length 44 characters or bytes"
  );
  const { data: hash, writeContract } = useWriteContract();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const msg = formData.get("message") as string;
    const key = formData.get("key") as string;
    console.log(msg, key);
    writeContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi,
      functionName: "encrypt",
      args: [aspectId, msg, key],
    });
  };
  function validateHexMessage(message: string) {
    const result = hexMessageSchema.safeParse({
      message: message,
      msgSwitch: true,
    });
    if (!result.success) {
      // Handle validation error
      setFormError(result.error.issues[0].message);
    } else {
      // Remove error message if validation is successful
      setFormError("");
      // Remove '0x' from the beginning of the hex code
      if (message.startsWith("0x")) {
        setMessage(message.replace("0x", ""));
      }
    }
  }

  // Function to validate the message when the switch is off (string)
  function validateStringMessage(message: string) {
    const result = messageSchema.safeParse({
      message: message,
      msgSwitch: false,
    });
    if (!result.success) {
      // Handle validation error
      setFormError(result.error.issues[0].message);
    } else {
      // Remove error message if validation is successful
      setFormError("");
    }
  }

  function validateHexKey(key: string) {
    const result = hexMessageSchema.safeParse({
      message: key,
      msgSwitch: true,
    });
    if (!result.success) {
      // Handle validation error
      setFormError(result.error.issues[0].message);
    } else {
      // Remove error message if validation is successful
      setFormError("");
      // Remove '0x' from the beginning of the hex code
      if (key.startsWith("0x")) {
        setKey(key.replace("0x", ""));
      }
    }
  }

  // Function to validate the key when the switch is off (string)
  function validateStringKey(key: string) {
    const result = messageSchema.safeParse({ message: key, msgSwitch: false });
    if (!result.success) {
      // Handle validation error
      setFormError(result.error.issues[0].message);
    } else {
      // Remove error message if validation is successful
      setFormError("");
    }
  }

  const checkHex = (str: string): boolean => {
    if (str.startsWith("0x")) str = str.slice(2);
    if (str.length === 0) return true;

    // console.log(str);

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
        <Card className="flex flex-col items-center w-[26rem] card justify-center mx-auto box space-y-10 pt-10">
          <CardContent className="space-y-[3rem]">
            <form className="flex flex-col space-y-4" onSubmit={submit}>
              {/* <Label htmlFor="name4" className="mx-2">
                                Enter the Message
                            </Label> */}
              <div className="flex flex-row gap-2">
                <Input
                  required
                  name="message"
                  value={message}
                  placeholder={msgSwitch ? "0x... message" : "message"}
                  className="rounded-xl w-64"
                  onChange={(e) => {
                    const newMsg = e.target.value;
                    setMessage(newMsg);
                    if (msgSwitch) {
                      validateHexMessage(newMsg);
                    } else {
                      validateStringMessage(newMsg);
                    }
                    // validateMessage({ message: newMsg, msgSwitch: msgSwitch });
                  }}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="msg-switch"
                    checked={msgSwitch}
                    onCheckedChange={() => {
                      setMsgSwitch(!msgSwitch);
                      if (msgSwitch) {
                        validateHexMessage(message);
                      } else {
                        validateStringMessage(message);
                      }
                    }}
                  />
                  <label className="w-10" htmlFor="msg-switch">
                    {msgSwitch ? "hex" : "string"}
                  </label>
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <Input
                  required
                  name="key"
                  placeholder={keySwitch ? "0x... key" : "key"}
                  className="rounded-xl w-64"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    setKey(newKey);
                    if (keySwitch) {
                      validateHexKey(newKey);
                    } else {
                      validateStringKey(newKey);
                    }
                    // validateMessage({ message: newKey, msgSwitch: keySwitch });
                  }}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="key-switch"
                    checked={keySwitch}
                    onCheckedChange={() => {
                      setKeySwitch(!keySwitch);
                      if (keySwitch) {
                        validateHexKey(key);
                      } else {
                        validateStringKey(key);
                      }
                    }}
                  />
                  <label className="w-10" htmlFor="key-switch">
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
                )}
              >
                {formError}
              </label>

              <div className="flex flex-row justify-center items-center space-x-4 pt-6">
                <Button
                  className="font-bold rounded-xl w-full"
                  type="submit"
                  disabled={formError !== ""}
                >
                  Encrypt
                </Button>

                <Button
                  className="font-bold rounded-xl w-full"
                  type="submit"
                  disabled={formError !== ""}
                >
                  Decrypt
                </Button>
              </div>
            </form>
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
