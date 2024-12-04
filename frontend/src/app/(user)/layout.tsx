"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UserHeader from "@/components/layout/UserHeader";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLogin(!!token); // Set to true if token exists, false otherwise
  }, []); // Run once when the component mounts

  return (
    <div className="flex flex-col overflow-x-hidden text-textPrimary min-h-screen">
      {isLogin ? <UserHeader /> : <Header />}
      <div className="bg-bgTertiary p-4 flex-1">{children}</div>
      <Footer />
    </div>
  );
}