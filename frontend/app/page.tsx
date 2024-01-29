"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useRef } from "react";

export default function Component() {
  const [isSwitched, setIsSwitched] = useState<boolean>(false);
  const [isSwitch, setIsSwitch] = useState<boolean>(false);

  const [message, setMessage] = useState<String>("");
  const [key, setKey] = useState<String>("");

  const formRef = useRef(null);

  const Encrypt = (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);

    const test = stringToHex(formData.get("message"))

    console.log(test);

    console.log("Message:", formData.get("message"));
    console.log("Key:", formData.get("key"));
  };

  const Decrypt = (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    let messageHex = hexToString(formData.get("key") as any);
    console.log(messageHex)

    console.log("Message:", formData.get("message"));
    console.log("Key:", formData.get("key"));
  }

  const checkHex = (str) => {
    const hex = /^[0-9A-Fa-f]+$/g;
    return hex.test(str);
  }

  const stringToHex = (str) => {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const hexValue = charCode.toString(16);

      // Pad with zeros to ensure two-digit representation
      hex += hexValue.padStart(2, "0");
    }
    return hex;
  };

  const hexToString = (hex) => {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const hexValue = hex.substr(i, 2);
      const decimalValue = parseInt(hexValue, 16);
      str += String.fromCharCode(decimalValue);
    }
    return str;
  };

  return (
    <main key="1" className="w-full p-6 ">
      <div className="w-full h-20  flex items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-white">
          The Encryption Aspect{" "}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6 items-center justify-center px-6">
        <Card className="w-1/4 h-[30rem] flex items-center  justify-center mx-auto  border border-white">
          <CardContent className="space-y-[3rem]">
            <form
              className="flex flex-col space-y-4"
              ref={formRef}
              
            >
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name4">
                  {isSwitched ? "Enter The CipherText" : "Enter the Message"}
                </Label>
                <div className="flex flex-row gap-4">
                  <Input id="message" name="message" placeholder="message" />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="airplane-mode"
                      checked={isSwitch}
                      onCheckedChange={() => setIsSwitch(!isSwitch)}
                    />
                    <label htmlFor="airplane-mode" id="switch-label">
                      {isSwitch ? "hex" : "string"}
                    </label>
                  </div>
                </div>

                <div className="flex flex-row gap-2">
                  <Input id="key" name="key" placeholder="key" />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="airplane-mode"
                      checked={isSwitched}
                      onCheckedChange={() => setIsSwitched(!isSwitched)}
                    />
                    <label htmlFor="airplane-mode" id="switch-label">
                      {isSwitched ? "hex" : "string"}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                <Button
                  className="font-bold rounded-xl"
                  type="submit"
                  onClick={Encrypt}
                >
                  Encrypt
                </Button>

                <Button
                  className=" font-bold  rounded-xl"
                  type="submit"
                  onClick={Decrypt}
                >
                  Decrypt
                </Button>
                </div>

               
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
