/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Badge from "@/components/common/Badge";
import ServiceCard from "@/components/main/ServiceCard";
import apiConfig from "@/core/api-config";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function StorePage() {
  const params = useParams();
  const storeId = params.id as string;
  const [storeData, setStoreData] = useState<any>([]);
  const [serviceData, setserviceData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/store/${storeId}`,
        );
        setStoreData(res.data.data);

        const res2 = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/service/store/${storeId}`,
        );
        setserviceData(res2.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  return (
    <main className="px-60 py-10 max-lg:px-10 max-sm:px-0">
      <div className="flex flex-row gap-10 max-md:flex-col">
        <Image src={storeData.image} alt="store" width={300} height={200} />
        <div className="flex flex-col gap-3">
          <h2 className="text-5xl font-bold">{storeData?.name}</h2>
          <p className="text-2xl opacity-60">Address: {storeData.address}</p>
          <div className="flex flex-row items-center">
          <p className="text-2xl">Working Time: </p>
          <Badge rounded color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBrand700 text-2xl">{storeData.openTime} - {storeData.closeTime}</p></Badge>
        </div>
        </div>
      </div>
      <div>
        <p className="text-4xl font-semibold py-10">Services</p>
        <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          {serviceData.map((i: any) => (
            <ServiceCard key={i._id} {...i} />
          ))}
        </div>
      </div>
    </main>
  );
}
export default StorePage;
