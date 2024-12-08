/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import StoreCard from "@/components/main/StoreCard";
import { useEffect, useState } from "react";
import apiConfig from "@/core/api-config";
import axios from "axios";
import Input from "@/components/common/Input";
import SearchIconMD from "@/assets/search-md.svg";
import SearchIconLG from "@/assets/search-lg.svg";

function StorePage() {
  const [storeData, setStoreData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/store/`,
        );
        console.log(res);
        setStoreData(res.data.data);
        setFilteredData(res.data.data); // Initialize filtered data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  const handleSearch = () => {
    if (!searchData.trim()) {
      setFilteredData(storeData); // Reset to all stores if search is empty
      return;
    }
    const searchQuery = searchData.toLowerCase();
    const filtered = storeData.filter((store) =>
      store.name?.toLowerCase().includes(searchQuery) ||
      store.address?.toLowerCase().includes(searchQuery) // Search by both name and address
    );
    setFilteredData(filtered);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="px-60 py-10 flex flex-col gap-4 max-md:px-0 max-lg:px-10">
      <div className="flex gap-4 mb-xl w-full items-center max-sm:p-0 max-sm:flex-col max-sm:justify-center">
        <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
          <Input
            placeholder="Search"
            prefix={<SearchIconLG />}
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
            onKeyDown={handleKeyDown} // Call handleSearch when Enter is pressed
          />
        </div>
        <button
          className="bg-white h-11 flex items-center px-4 rounded-lg border border-solid border-borderPrimary text-white"
          onClick={handleSearch}
        >
          <SearchIconMD />
        </button>
      </div>

      {filteredData.map((i: any) => (
        <StoreCard key={i._id} {...i} />
      ))}
    </main>
  );
}

export default StorePage;

