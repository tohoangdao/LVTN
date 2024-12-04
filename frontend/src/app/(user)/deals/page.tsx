/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DailyDeal from "@/components/main/DailyDeal";
import apiConfig from "@/core/api-config";
import axios from "axios";
import { useEffect, useState } from "react";

function DailyPage() {
  const [serviceData, setserviceData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/service/dailyDeal`,
        );
        console.log(res);
        setserviceData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  return (
    <main className="px-60 py-10 flex flex-col gap-4 max-md:px-0">
      {serviceData.map((i: any) => (
        <DailyDeal key={i._id} {...i} />
      ))}
    </main>
  );
}
export default DailyPage;
