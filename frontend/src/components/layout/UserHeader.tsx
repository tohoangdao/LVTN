"use client";

import UserIcon from "@/assets/user.svg";
import Calendar from "@/assets/calendar.svg";
import LogOutIcon from "@/assets/log-out.svg";
import Link from "next/link";
import DropDown from "../common/Dropdown";
import Menu from "../common/Menu";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

export default function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    // Clear the access token
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (pathname === "/") {
      // Just reload the page
      window.location.reload();
    } else {
      // Redirect to the homepage and then reload
      router.push("/");
    }
  };
  const [token, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken: { user: { role: string } } = jwtDecode(token);
      if (decodedToken.user.role === "Admin") {
        router.push("/admin");
      }
    }
  }, [token]);
  return (
    <header className="flex flex-row justify-between items-center px-20 py-3 text-textBlack border border-b-2 max-md:px-0 max-md:flex-col max-md:gap-5">
      <Image src={"/logo.png"} alt="logo" width={70} height={70}></Image>

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

      <div className="flex flex-row items-center">
        <DropDown
          trigger="click"
          position={{
            x: "right-start",
          }}
          contentClassName="rounded-md top-[calc(100%_+_4px)]"
          contentActiveClassName="shadow-[0_12px_16px_#10182814]"
          content={
            <Menu
              width={209}
              menus={[
                {
                  label: "Profile",
                  onClick: () => router.push("/profile"),
                  icon: <UserIcon />,
                },
                {
                  label: "Appointments",
                  onClick: () => router.push("/appointment"),
                  icon: <Calendar />,
                },
                {
                  label: "Logout",
                  icon: <LogOutIcon />,
                  onClick: handleLogout,
                },
              ]}
            />
          }
        >
          <div className="flex items-center justify-center text-black text-xl font-medium w-8 aspect-square rounded-full bg-mainColor cursor-pointer">
            <UserIcon />
          </div>
        </DropDown>
      </div>
    </header>
  );
}
