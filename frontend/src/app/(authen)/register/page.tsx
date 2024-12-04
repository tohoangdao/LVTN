/* eslint-disable */
"use client";
import Back from "@/assets/chevron-left.svg";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import apiConfig from "@/core/api-config";
import { message } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const router = useRouter();
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9\-\\+]{9,15}$/;
    return phoneRegex.test(phone);
  };
  const handleRegister = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      message.error("Please enter a valid phone number.");
      return;
    }
    try {
      await axios.post(
        `${apiConfig.origin}${apiConfig.backendAPI}/auth/register`,
        {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          password: password,
          gender: gender,
        },
      );
      message.success("Create account successfully!");
      router.push("/login");
    } catch (error:any) {
      console.log(error);
      if (error?.message == "Request failed with status code 400") {
        message.error(error?.response.data.message);
      } else {
        message.error("Failed to create account, please try again!");
      }
    }
  };
  return (
    <div className="">
      <div className="flex flex-row bg-white border border-b-2 border-[#c0c0c0] px-3 py-5 items-center">
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
            Create your account
          </h1>
          <Input
            label="First name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <div className="spacer my-2" />
          <Input
            label="Last name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className="spacer my-2" />
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
          <Select
            className=""
            placeholder="Select gender"
            label="Gender"
            options={[
              {
                label: "Male",
                value: "Male",
              },
              {
                label: "Female",
                value: "Female",
              },
            ]}
            value={gender}
            onChange={(value) => setGender(value as string)}
          />
          <div className="spacer my-2" />
          <div className="spacer my-3" />

          <Button
            type="primary"
            className="bg-mainColor"
            onClick={() => handleRegister()}
          >
            Create account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Register;
