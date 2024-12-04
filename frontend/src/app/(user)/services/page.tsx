/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Filter from "@/assets/filter.svg";
import Checkbox from "@/components/common/Checkbox";
import { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import SearchIconMD from "@/assets/search-md.svg";
import SearchIconLG from "@/assets/search-lg.svg";
import apiConfig from "@/core/api-config";
import axios from "axios";
import Service from "@/components/main/Service";

function ServicePage() {
  const [filteredData, setFilteredData] = useState<any[]>([]); // Holds the filtered data
  const [searchData, setSearchData] = useState<string>(""); // Search query
  const options = ["All", "Hair", "Nail", "Face", "Body"]; // Your checkbox options
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Track selected checkbox
  const [serviceData, setServiceData] = useState<any[]>([]); // Original service data

  // Fetch service data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/service/`,
        );
        setServiceData(res.data.data);
        setFilteredData(res.data.data); // Initialize filtered data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  // Trigger search on Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      filterServices();
    }
  };

  // Trigger search on search button click
  const handleSearch = () => {
    filterServices();
  };


  const handleCheckboxChange = (index: number) => {
    // Update the selected index
    if (selectedIndex === index) {
      setSelectedIndex(0); // Reset to "All" if the same checkbox is clicked again
    } else {
      setSelectedIndex(index);
    }
  
    filterServices(index === selectedIndex ? 0 : index); // Pass the correct index to apply filtering
  };
  
  const filterServices = (currentIndex?: number) => {
    const searchQuery = searchData.trim().toLowerCase();
    const selectedCategory = options[currentIndex ?? selectedIndex].toLowerCase();
  
    const filtered = serviceData.filter((service) => {
      const matchesName = service.name?.toLowerCase().includes(searchQuery); // Match by name
      const matchesType =
        selectedCategory === "all" || // Show all if "All" is selected
        service.serviceType?.toLowerCase() === selectedCategory; // Match by service type
  
      return matchesName && matchesType;
    });
  
    setFilteredData(filtered);
  };

  return (
    <main className="px-60 py-10 flex flex-col gap-4 max-md:px-0">
      <div className="flex gap-4 mb-xl w-full items-center max-sm:p-0 max-sm:flex-col max-sm:justify-center">
        <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
          <Input
            placeholder="Search"
            prefix={<SearchIconLG />}
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
            onKeyDown={handleKeyDown} // Trigger search on Enter
          />
        </div>
        <button
          className="bg-white h-11 flex items-center px-4 rounded-lg border border-solid border-borderPrimary text-white"
          onClick={handleSearch} // Trigger search on button click
        >
          <SearchIconMD />
        </button>
      </div>
      <div className="flex flex-row gap-12 max-lg:gap-4 max-sm:flex-wrap">
        <Filter className="size-6 max-lg:hidden" />
        {options.map((option, index) => (
          <label key={index} className="flex flex-row gap-3 max-lg:gap-2">
            <Checkbox
              type="round"
              checked={selectedIndex === index} // Highlight selected checkbox
              onChange={() => handleCheckboxChange(index)} // Trigger filter
            />
            {option}
          </label>
        ))}
      </div>
      {filteredData.map((i: any) => (
        <Service key={i._id} {...i} />
      ))}
    </main>
  );
}

export default ServicePage;