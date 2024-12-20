"use client";

import UserIcon from "@/assets/user.svg";
import LogOutIcon from "@/assets/log-out.svg";
import DropDown from "../common/Dropdown";
import Menu from "../common/Menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

export default function AdminHeader() {
  const router = useRouter();
  const [token, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
      setAccessToken(token);
      }
      else setAccessToken("");
    }
  }, []);

  const handleLogout = () => {
    // Clear the access token
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  useEffect(() => {
    if (token === "") {
      router.push("/");
    }
    if (token) {
      const decodedToken: { user: { role: string } } = jwtDecode(token);
      if (decodedToken.user.role !== "Admin") {
        router.push("/");
      }
    }
  }, [token]);
  return (
    <header className="flex flex-row justify-between items-center px-20 py-3 text-textBlack border border-b-2 max-md:px-3 max-md:gap-5">
      <Image src={"/logo.png"} alt="logo" width={70} height={70}></Image>

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
