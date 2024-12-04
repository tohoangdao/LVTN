/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Back from "@/assets/chevron-left.svg";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import apiConfig from "@/core/api-config";
import { message } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9\-\\+]{9,15}$/;
    return phoneRegex.test(phone);
  };
  const handleLogin = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      message.error("Please enter a valid phone number.");
      return;
    }
    try {
      const res = await axios.post(
        `${apiConfig.origin}${apiConfig.backendAPI}/auth/login`,
        {
          phoneNumber: phoneNumber,
          password: password,
        },
      );
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      message.success("Login successful");
      const decodedToken: { user: { role: string } } = jwtDecode(
        res.data.data.accessToken,
      );
      console.log("Decoded Token:", decodedToken);
      if (decodedToken) {
        const role = decodedToken.user.role;
        console.log("User Role:", role);
        if (role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        message.error("Failed to decode token");
      }
    } catch (error:any) {
      console.log(error);
      message.error(error?.response.data.message);
    }
  };
  return (
    <div className="">
      <div className="flex flex-row bg-white border border-b-2 border-[#c0c0c0] px-3 py-5 items-center justify-between">
        <Link href="/" className="flex flex-row">
          <div className="text-mainColor">
            <Back />
          </div>
          <p className="text-[#808080]">Home</p>
        </Link>
      </div>
      <div className="py-10 px-4 bg-bgSecondary min-h-screen">
        <div className="flex flex-col max-w-[480px] mx-auto bg-white p-16 rounded-md">
        <Image src={"/logo.png"} alt="logo" width={200} height={200} className="self-center"></Image>
          <h1 className="font-semibold text-textPrimary text-2xl text-center my-8">
            Login to your account
          </h1>
          <Input
            label="Phone number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="spacer my-2" />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="spacer my-2" />
          <div className="spacer my-3" />

          <Button
            type="primary"
            className="bg-mainColor"
            onClick={() => handleLogin()}
          >
            Sign in
          </Button>

          <div className="flex justify-center pt-5">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="text-linkColor font-semibold pl-2"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
