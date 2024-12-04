/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import apiConfig from "@/core/api-config";
import axios from "axios";
import { message } from "antd";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
};

function Profile() {
  // const token = localStorage.getItem("accessToken");
  const [token, setAccessToken] = useState<string | null>(null);
  const [data, setData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    address: "",
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const decodedToken: { user: { userId: string } } = jwtDecode(token);
          if (decodedToken) {
            const userId = decodedToken.user.userId;
            const res = await axios.get(
              `${apiConfig.origin}${apiConfig.backendAPI}/user/profile/${userId}`,
            );
            setData(res.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [token]);

  const saveProfile = async () => {
    try {
      if (token) {
        const decodedToken: { user: { userId: string } } = jwtDecode(token);
        if (decodedToken) {
          const userId = decodedToken.user.userId;
          await axios.put(
            `${apiConfig.origin}${apiConfig.backendAPI}/user/profile/${userId}`,
            data,
            { headers: { 'authorization': `Bearer ${token}` } },
          );
          message.success("Profile updated successfully!");
        }
      }
    } catch (error) {
      message.error("Failed to update!");
      console.error("Error saving profile data:", error);
    }
  };

  const handleChange = (key: keyof UserProfile, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="py-10 px-4 bg-bgSecondary min-h-screen max-lg:px-0">
      <div className="flex flex-col mx-auto bg-white m-4 w-[1000px] h-auto rounded-md px-24 py-12 gap-10 max-lg:w-auto max-lg:px-4">
        <h1 className="text-4xl">Profile</h1>
        <div className="grid grid-cols-2 gap-8 max-md:flex max-md:flex-col">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={data.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
          <Select
            label="Gender"
            placeholder="Select Gender"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            value={data.gender}
            onChange={(value) => handleChange("gender", value as string)}
          />
          <div className="col-span-2">
            <Input
              label="Address"
              placeholder="Enter your address"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>

        <Button
          className="justify-self-end self-end w-40 bg-buttonSave text-white"
          onClick={saveProfile}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default Profile;
