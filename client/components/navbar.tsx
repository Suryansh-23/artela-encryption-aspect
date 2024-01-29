// @ts-nocheck
"use client";
import clsx from "clsx";
import { Github } from "lucide-react";
import { Lexend } from "next/font/google";
import Link from "next/link";

const lexend = Lexend({ subsets: ["latin"] });

const Navbar = () => {
    return (
        <div className="fixed top-0 w-full z-30 text-gray-100">
            <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
                <Link
                    href="/"
                    className={clsx(
                        "flex items-center font-display text-3xl font-bold",
                        lexend.className
                    )}>
                    <h1>On-Chain Encryption Aspect</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <w3m-button />
                    <a
                        title="Github Repository"
                        href="https://github.com/Suryansh-23/artela-encryption-aspect"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Github />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
