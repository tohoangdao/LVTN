/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import apiConfig from "@/core/api-config";
import axios from "axios";
import AppointmentCard from "@/components/main/AppointmentCard";

function Appointment() {
  const [token, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const decodedToken: { user: { userId: string } } = jwtDecode(token);
          if (decodedToken) {
            const userId = decodedToken.user.userId;
            const res = await axios.get(
              `${apiConfig.origin}${apiConfig.backendAPI}/appointment/user/${userId}`,
            );
            setData(res.data.data);
            console.log(res);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [token]);
  return (
    <div className="py-10 px-4 min-h-screen">
      <div className="flex flex-col mx-auto bg-white m-4 w-[1000px] h-auto rounded-md px-24 py-12 gap-10 border-spacing-x-2">
        <h1 className="text-4xl">Your Appointment</h1>
        <div className="flex flex-col gap-4 max-h-screen overflow-auto">
          {data.map((i: any) => (
            <AppointmentCard key={i._id} {...i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointment;
