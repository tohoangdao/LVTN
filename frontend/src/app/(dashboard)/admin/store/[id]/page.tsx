/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Button from "@/components/common/Button";
import TabsGroup from "@/components/common/TabsGroup";
import AppointmentTable from "@/components/main/AppointmentTable";
import ServiceTable from "@/components/main/ServiceTable";
import { useEffect, useState } from "react";
import PlusIcon from "@/assets/plus.svg";
import StaffTable from "@/components/main/StaffTable";
import { useParams, useRouter } from "next/navigation";
import DailyDealTable from "@/components/main/DailyDealTable";
import Back from "@/assets/arrow-left.svg";
import apiConfig from "@/core/api-config";
import axios from "axios";

enum TabValue {
  SERVICES = "SERVICES",
  DAILYDEAL = "DAILYDEAL",
  STAFFS = "STAFFS",
  APPOINTMENTS = "APPOINTMENTS",
}

function Admin() {
  const [tabValue, setTabValue] = useState<TabValue>(TabValue.SERVICES);
  const params = useParams();
  const storeId = params.id as string;
  const router = useRouter();
  const goBack = () => {
    router.push("/admin");
  };

  const [storeData, setStoreData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.origin}${apiConfig.backendAPI}/store/${storeId}`,
        );
        setStoreData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); // Call the async function
  }, []);
  return (
    <div>
      <div className="pb-4 flex flex-row items-center">
        <Button
          className="w-fit text-nowrap ml-24 mr-6 max-md:mx-4"
          onClick={goBack}
        >
          <Back />
          Go back
        </Button>
        <p className="text-2xl">{storeData.name}</p>
      </div>
      <div className="pl-20 max-md:pl-0 overflow-auto">
        <TabsGroup
          options={[
            {
              key: TabValue.SERVICES,
              label: "Services",
            },
            {
              key: TabValue.DAILYDEAL,
              label: "Daily deals",
            },
            { key: TabValue.STAFFS, label: "Staffs" },
            { key: TabValue.APPOINTMENTS, label: "Appointments" },
            // { key: TabValue.CALLS, label: "Calls" },
          ]}
          current={tabValue}
          onChange={setTabValue}
          className="ml-xl"
        />
      </div>
      <div className="py-4 flex-1">
        {tabValue === TabValue.SERVICES && (
          <div className="flex flex-col gap-5">
            <Button
              type="primary"
              className="w-fit text-nowrap self-end"
              onClick={() => router.push(`/admin/store/${storeId}/add-service`)}
            >
              <PlusIcon />
              Add service
            </Button>
            <ServiceTable />
          </div>
        )}

        {tabValue === TabValue.DAILYDEAL && (
          <div className="flex flex-col gap-5">
            <DailyDealTable />
          </div>
        )}

        {tabValue === TabValue.STAFFS && (
          <div className="flex flex-col gap-5">
            <Button
              type="primary"
              className="w-fit text-nowrap self-end"
              onClick={() => router.push(`/admin/store/${storeId}/add-staff`)}
            >
              <PlusIcon />
              Add staff
            </Button>
            <StaffTable />
          </div>
        )}

        {tabValue === TabValue.APPOINTMENTS && <AppointmentTable />}

        {/* {tabValue === TabValue.CALLS && <>{renderCallHistories()}</>} */}
      </div>
    </div>
  );
}

export default Admin;
