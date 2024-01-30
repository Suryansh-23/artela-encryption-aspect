import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { config } from "@/config";
import { Web3Modal } from "@/context";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get("cookie"));

    return (
        <html lang="en" className="bg-black">
            <body
                className={cn(
                    "w-full h-screen flex flex-row items-center justify-center",
                    inter.className
                )}>
                <Web3Modal initialState={initialState}>
                    <Navbar />
                    <Toaster />
                    {children}
                </Web3Modal>
                <div
                    className={cn(
                        "fixed bottom-0 text-center font-medium p-6 text-slate-100",
                        inter.className
                    )}>
                    <p>
                        Made with 💖 in 🇮🇳 by{" "}
                        <Link
                            className="underline underline-offset-2"
                            href="https://github.com/Suryansh-23/"
                            target="_blank"
                            rel="noopener noreferrer">
                            Suryansh
                        </Link>{" "}
                        &{" "}
                        <Link
                            className="underline underline-offset-2"
                            href="https://github.com/Ansh1902396/"
                            target="_blank"
                            rel="noopener noreferrer">
                            Rudransh
                        </Link>
                    </p>
                </div>
            </body>
        </html>
    );
}
