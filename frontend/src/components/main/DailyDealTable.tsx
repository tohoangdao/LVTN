/* eslint-disable @typescript-eslint/no-explicit-any */
import apiConfig from "@/core/api-config";
import { Input, message, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Edit from "@/assets/pencil.svg";
import Button from "../common/Button";
import { useParams } from "next/navigation";
import Toggle from "../common/Toggle";
import Badge from "../common/Badge";

interface ServiceItem {
  _id: string; // Use _id as the unique key
  discount: number;
  dailyDeal: boolean;
}

function DailyDealTable() {
  const [data, setData] = useState<ServiceItem[]>([]);

  const [editingKey, setEditingKey] = useState<string | null>(null); // Track the row being edited
  const [editableData, setEditableData] = useState<Partial<ServiceItem>>({}); // Store the edited row data
  const [editDaily, setEditDaily] = useState<boolean>(false);

  const params = useParams();
  const storeId = params.id as string;
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.origin}${apiConfig.backendAPI}/service/store/${storeId}/`,
      );
      console.log(res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(); // Call the async function
  }, []);

  const isEditing = (record: ServiceItem) => record._id === editingKey;

  const handleEdit = (record: ServiceItem) => {
    setEditingKey(record._id);
    setEditableData(record); // Pre-fill the form with the selected row data
    setEditDaily(record.dailyDeal);
  };

  const handleCancel = () => {
    setEditingKey(null);
  };

  const handleSave = async () => {
    try {
      editableData.dailyDeal = editDaily;
      const updatedData = data.map((item) =>
        item._id === editingKey ? { ...item, ...editableData } : item,
      );

      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/service/update/${editingKey}`,
        editableData,
      );

      setData(updatedData);
      setEditingKey(null);
      message.success("Data updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update data.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof ServiceItem,
  ) => {
    setEditableData({ ...editableData, [key]: e.target.value });
  };
  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Daily Deal",
      dataIndex: "dailyDeal",
      key: "dailyDeal",
      render: (text: boolean, record: ServiceItem) =>
        isEditing(record) ? (
          <Toggle active={editDaily} onChange={setEditDaily}/>
        ) : (
          <Toggle active={text} />
        ),
    },
    {
      title: "Discount percentage",
      dataIndex: "discount",
      key: "discount",
      width:200,
      render: (text: string, record: ServiceItem) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={editableData.discount}
            onChange={(e) => handleInputChange(e, "discount")}
          />
        ) : (
          <Badge color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBlueLight500 text-xl">{text}</p></Badge>
        ),
    },

    {
      title: "Action",
      key: "action",
      width:200,
      render: (_: any, record: ServiceItem) =>
        isEditing(record) ? (
          <div className="flex gap-x-2">
            <Button className="bg-mainColor text-white" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <div className="flex gap-x-2">
            <button
              onClick={() => handleEdit(record)}
              className="flex gap-x-1 hover:text-blue-600"
            >
              <Edit className="translate-y-[1px]" />
              Edit
            </button>
          </div>
        ),
    },
  ];
  return (
    <Table dataSource={data} columns={columns} className="overflow-auto" pagination={{ pageSize: 10 }}/>
  );
}

export default DailyDealTable;
