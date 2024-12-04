"use client";
import Input from "@/components/common/Input";
import SaveIcon from "@/assets/save.svg";
import React, { useState } from "react";
import Button from "@/components/common/Button";
import apiConfig from "@/core/api-config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Select from "@/components/common/Select";
import { message } from "antd";
import Back from "@/assets/arrow-left.svg";

function Addstaff() {
  const [staffName, setstaffName] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [salary, setsalary] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");
  const [experience, setExperience] = useState<number>(0);
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;

  const createStaff = async () => {
    try {
      await axios.post(
        `${apiConfig.origin}${apiConfig.backendAPI}/staff/create/${storeId}`,
        {
          name: staffName,
          level: level,
          salary: salary,
          phone: phone,
          experience: experience,
        },
      );
      message.success("Add new staff successfully!");
      router.push(`/admin/store/${storeId}`);
    } catch (error) {
      console.error(error);
      message.error("Failed to add new staff.");
    }
  };

  const goBack = () => {
    router.push(`/admin/store/${storeId}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full justify-between">
        <Button
          className="w-fit text-nowrap  mx-20 max-md:mx-0"
          onClick={goBack}
        ><Back />
          Go back
        </Button>
        <Button
          type="primary"
          className="w-fit text-nowrap  mx-20 max-md:mx-0"
          onClick={createStaff}
        >
          <SaveIcon />
          Save
        </Button>
      </div>
      <div className="bg-white p-4 mx-96 my-10 rounded-lg shadow-lg max-lg:mx-0 max-sm:mx-0">
        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Add new staff
          </h2>

          <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-evenly max-md:flex-col">
              <div className="w-1/3 max-md:w-full">
                <p className="pb-1.5 text-2xl font-medium">Staff name</p>
                <Input
                  value={staffName}
                  onChange={(e) => setstaffName(e.target.value)}
                />
              </div>
              <div className="w-1/3 max-md:w-full">
                <p className="pb-1.5 text-2xl font-medium">Phone number</p>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-row gap-8 justify-around max-md:flex-col">
              <div>
                <p className="pb-1.5 text-2xl font-medium">
                  Salary <span className="text-utilityBlue600">($)</span>
                </p>
                <Input
                  value={salary}
                  onChange={(e) => setsalary(Number(e.target.value))}
                />
              </div>
              <div>
                <p className="pb-1.5 text-2xl font-medium">Level</p>
                <Select
                  options={[
                    {
                      label: "Junior",
                      value: "Junior",
                    },
                    {
                      label: "Middle",
                      value: "Middle",
                    },
                    {
                      label: "Senior",
                      value: "Senior",
                    },
                  ]}
                  value={level}
                  onChange={(value) => setLevel(value as string)}
                />
              </div>
              <div>
                <p className="pb-1.5 text-2xl font-medium">Experience(year)</p>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addstaff;
