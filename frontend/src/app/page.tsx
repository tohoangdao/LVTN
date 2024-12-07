/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Carousel } from "antd";
import Next from "@/assets/chevron-right.svg";
import Link from "next/link";
import DailyCard from "@/components/main/DailyCard";
import HomeStoreCard from "@/components/main/HomeStoreCard";
import { useEffect, useState } from "react";
import axios from "axios";
import apiConfig from "@/core/api-config";
import UserHeader from "@/components/layout/UserHeader";

export default function Home() {
  const [storeData, setStoreData] = useState([]);
  const [dailyDealData, setDailyDealData] = useState([]);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLogin(!!token); // Set to true if token exists, false otherwise
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/store/`,
        );
        setStoreData(res.data.data);

        const res2 = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/service/dailyDeal`,
        );
        setDailyDealData(res2.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, []);
  return (
    <div>
      {isLogin ? <UserHeader /> : <Header />}

      <Carousel autoplay arrows dots={false} draggable={true} speed={2000}>
        <div className="flex justify-center items-center h-auto w-full">
          <img
            src="/banner.jpg"
            alt="banner"
            className="w-full h-[500px]"
          ></img>
        </div>
        <div className="flex justify-center items-center h-auto w-full">
          <img
            src="/banner2.jpg"
            alt="banner"
            className="w-full h-[500px]"
            loading="lazy"
          ></img>
        </div>
        <div className="flex justify-center items-center h-auto w-full">
          <img
            src="/banner3.jpg"
            alt="banner"
            className="w-full h-[500px]"
            loading="lazy"
          ></img>
        </div>
      </Carousel>

      <div className="p-0 md:p-20 transition-all duration-300 ease-in-out">
        <div className="flex flex-row items-base gap-8">
          <p className="text-4xl">Stores</p>
          <Link
            href="/store"
            className="text-linkColor flex flex-row items-center hover:bg-[#edfcff] px-2"
          >
            See all
            <Next />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-10 py-7 max-md:flex max-md:overflow-x-auto max-md:space-x-4">
          {storeData
            .sort(() => Math.random() - 0.5) // Shuffle the array randomly
            .slice(0, 8) // Select the first 10 items
            .map((i: any) => (
              <div
                key={i._id}
                className="max-md:min-w-[75%] md:min-w-0" // Ensure full width for each card on smaller screens
              >
                <HomeStoreCard {...i} />
              </div>
            ))}
        </div>

        <div className="flex flex-row items-base gap-8">
          <p className="text-4xl">Daily Deal</p>
          <Link
            href="/deals"
            className="text-linkColor flex flex-row items-center hover:bg-[#edfcff] px-2"
          >
            See all
            <Next />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-10 py-7 max-md:flex max-md:overflow-x-auto max-md:space-x-4">
          {dailyDealData
            .sort(() => Math.random() - 0.5) // Shuffle the array randomly
            .slice(0, 4) 
            .map((i: any) => (
              <div
                key={i._id}
                className="max-md:min-w-[75%] md:min-w-0" // Ensure full width for each card on smaller screens
              >
                <DailyCard {...i} />
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
