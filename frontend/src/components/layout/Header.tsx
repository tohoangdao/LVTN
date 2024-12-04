"use client";

import Link from "next/link";
import Button from "../common/Button";
import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center px-20 py-3 text-textBlack border border-b-2 max-md:px-0 max-md:flex-col max-md:gap-5">
      <Image src={"/logo.png"} alt="logo" width={70} height={70}></Image>
      <div>
        <nav>
          <ul className="flex flex-row space-x-10 max-md:space-x-5">
            <li>
              <Link
                href="/"
                className="hover:text-mainColor active:text-black font-bold"
              >
                Home
              </Link>
            </li>
            <li>
              <Link href="/store" className="hover:text-mainColor font-bold">
                Stores
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-mainColor font-bold">
                Services
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:text-mainColor font-bold">
                Daily Deals
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <Link href="/login">
          <Button type="primary" className="bg-mainColor w-24">
            Login
          </Button>
        </Link>
      </div>
    </header>
  );
}
