"use client";
import TabsGroup from "@/components/common/TabsGroup";
import CustomerTable from "@/components/main/CustomerTable";
import StoreTable from "@/components/main/StoreTable";
import { useState } from "react";
import PlusIcon from "@/assets/plus.svg";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

enum TabValue {
  CUSTOMERS = "CUSTOMERS",
  STORES = "STORES",
}

function Admin() {
  const [tabValue, setTabValue] = useState<TabValue>(TabValue.STORES);
  const router = useRouter();
  
  return (
    <div>
      <div className="pl-20 max-md:pl-0">
        <TabsGroup
          options={[
            { key: TabValue.STORES, label: "Stores" },
            {
              key: TabValue.CUSTOMERS,
              label: "Customers",
            },
          ]}
          current={tabValue}
          onChange={setTabValue}
          className="ml-xl"
        />
      </div>
      <div className="py-4 flex-1">
        {tabValue === TabValue.STORES && (
          <div className="flex flex-col gap-5">
            <Button
              type="primary"
              className="w-fit text-nowrap self-end"
              onClick={() => router.push("/admin/add-store")}
            >
              <PlusIcon />
              Add store
            </Button>
            <StoreTable />
          </div>
        )}
        {tabValue === TabValue.CUSTOMERS && <CustomerTable />}
      </div>
    </div>
  );
}

export default Admin;
