/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import DatePicker from "@/components/common/Datepicker/DatePicker";
import TimePicker from "@/components/common/TimePicker/TimePicker";
import apiConfig from "@/core/api-config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";
import { convertDateToFormat, DEFAULT_DATE_FORMAT } from "@/utils/date-utils";

function Booking() {
  const [bookDate, setBookDate] = useState<Date | null>(null);
  const [timeStart, setTimeStart] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const params = useParams();
  const serviceId = params.id as string;
  const router = useRouter();
  const [token, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
      console.log(token);
      if (token === null) {
        message.info("Please login before booking your service");
        router.push("/login");
      }
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/service/${serviceId}`,
        );
        // console.log(res);
        setServiceData(res.data.data); 
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchData();
  }, [serviceId]);
  const handleBooking = async () => {
    try {
      if (token && bookDate) {
        const formatDate = convertDateToFormat(bookDate, DEFAULT_DATE_FORMAT);
        const bookingTime = `${timeStart} ${formatDate}`;
        const res = await axios.post(
          `${apiConfig.origin}${apiConfig.backendAPI}/appointment/create`,
          {
            userId: (jwtDecode(token) as any).user.userId,
            serviceId: serviceId,
            storeId: serviceData?.store?._id,
            bookingTime: bookingTime,
          },
          { headers: { 'authorization': `Bearer ${token}` } },
        );
        console.log(res);
        message.success("Booking service successfully");
        router.push("/");
      }
    } catch (error) {
      message.error("Please try again!");
      console.error("Error fetching service data:", error);
    }
  };

  return (
    <main className="">
      <div className="py-10 px-4 bg-bgSecondary min-h-screen max-sm:px-0">
        <div className="flex flex-col max-w-[650px] mx-auto bg-white p-16 rounded-md gap-6 max-sm:px-4">
          <h1 className="text-lg font-bold">1. Selected store</h1>
          {serviceData?.store?.name ? (
            <p className="text-xl">{serviceData.store.name}</p>
          ) : (
            <p>Loading store data...</p>
          )}

          <h1 className="text-lg font-bold">2. Selected service</h1>
          {serviceData?.name ? (
            <p className="text-xl">{serviceData.name}</p>
          ) : (
            <p>Loading service data...</p>
          )}

          <div>
            <h1 className="text-lg font-bold pb-5">3. Select day</h1>
            <div className="w-72">
              <DatePicker
                placeholder="Booking Date"
                value={bookDate}
                onChange={(date) => date && setBookDate(date)}
              />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold pb-5">4. Select time</h1>
            <div className="w-32">
              <TimePicker
                timeInterval={15}
                value={timeStart}
                timeFormat="HH:mm"
                onChange={setTimeStart}
              />
            </div>
          </div>

          <div className="flex flex-row justify-around max-sm:flex-col-reverse max-sm:items-center max-sm:gap-5">
            <Link href="/">
              <Button className="bg-white w-36 self-center text-black">
                Cancel
              </Button>
            </Link>
            <Button
              className="bg-mainColor w-36 self-center text-white"
              onClick={handleBooking}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Booking;
