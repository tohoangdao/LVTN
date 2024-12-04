/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiConfig from "@/core/api-config";
import { Table, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Edit from "@/assets/pencil.svg";
import { useParams } from "next/navigation";
import Badge from "../common/Badge";
import Button from "../common/Button";

interface AppointmentItem {
  _id: string; // Use _id as the unique key
  status:string;
}

function AppointmentTable() {
  const [data, setData] = useState<AppointmentItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<Partial<AppointmentItem>>({});
  const params = useParams();
  const storeId = params.id as string;
  console.log(storeId);
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.origin}${apiConfig.backendAPI}/appointment/${storeId}`,
      );
      console.log(storeId);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(); // Call the async function
  }, []);

  const isEditing = (record: any) => record._id === editingKey;
  const handleEdit = (record: any) => {
    setEditingKey(record._id);
    setEditStatus(record.status);
  };
  const handleCancel = () => {
    setEditingKey(null);
  };

  const handleSave = async () => {
    try {
      editableData.status= editStatus ?? "";
      const updatedData = data.map((item) =>
        item._id === editingKey ? { ...item, ...editableData } : item,
      );

      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/appointment/update/${editingKey}`,
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
  const columns = [
    {
      title: "Customer Name",
      key: "customerName",
      render: (_: any, record: any) =>
        `${record.user.firstName} ${record.user.lastName}`,
    },
    {
      title: "Customer Phone",
      dataIndex: ["user", "phoneNumber"], // Access nested fields with dataIndex as an array
      key: "phoneNumber",
    },
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "serviceName",
    },
    {
      title: "Booking Time",
      dataIndex: "bookingTime",
      key: "bookingTime",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width:150,
      render: (text: string, record:any) =>
        isEditing(record) ? (
          <Select
            value={editStatus ?? ""}
            onChange={(value) => setEditStatus(value as string)}
            style={{ width: 150 }}
            options={[
              {
                label: "Cancelled",
                value: "cancelled",
              },
              {
                label: "Completed",
                value: "completed",
              },
            ]}
          />
        ) : (
          <div>
            {text === "booking" ? (
              <Badge rounded type="brand" color="#3538cd" borderColor="#c7d7fe">
                <p className="py-1 text-lg">Booking</p>
              </Badge>
            ) : text === "cancelled" ? (
              <Badge rounded type="danger">
                <p className="py-1 text-lg">Cancelled</p>
              </Badge>
            ) : (
              <Badge rounded type="success">
                <p className="py-1 text-lg">Completed</p>
              </Badge>
            )}
          </div>
        ),
    },
    {
      title: "Action",
      width: 160,
      dataIndex: "action",
      render: (_: any, record: any) =>
        isEditing(record) ? (
          <div className="flex gap-x-2">
            <Button className="bg-mainColor text-white" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <div className="flex gap-x-2">
            {record.status === "booking" ? (
              <button
                onClick={() => handleEdit(record)}
                className="flex gap-x-1 hover:text-blue-600"
              >
                <Edit className="translate-y-[1px]" />
                Edit
              </button>
            ) : (
              <span className="text-gray-400 cursor-not-allowed flex gap-x-1">
                <Edit className="translate-y-[1px]" />
                Edit
              </span>
            )}
          </div>
        ),
    }
  ];
  return (
    <Table dataSource={data} columns={columns} className="overflow-auto" pagination={{ pageSize: 10 }}/>
  );
}

export default AppointmentTable;
