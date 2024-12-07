/* eslint-disable @typescript-eslint/no-explicit-any */
import apiConfig from "@/core/api-config";
import { Input, message, Select, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Edit from "@/assets/pencil.svg";
import Delete from "@/assets/delete.svg";
import Button from "../common/Button";
import { useParams } from "next/navigation";
import Badge from "../common/Badge";

interface StaffItem {
  _id: string; // Use _id as the unique key
  name: string;
  phone: string;
  experience: number;
  salary: number;
  level: string;
}

function StaffTable() {
  const [data, setData] = useState<StaffItem[]>([]);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null); // Track the row being edited
  const [editableData, setEditableData] = useState<Partial<StaffItem>>({}); // Store the edited row data
  const [level, setlevel] = useState<string | null>(null);
  const params = useParams();
  const storeId = params.id as string;
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.origin}${apiConfig.backendAPI}/staff/${storeId}`,
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
  const handleDeleteConfirm = async () => {
    try {
      // Send delete request to the server
      await axios.delete(
        `${apiConfig.origin}${apiConfig.backendAPI}/staff/${deleteKey}`,
      );
      // Update the data state to remove the deleted item
      setData(data.filter((item) => item._id !== deleteKey));
      message.success("Staff deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete staff.");
    }
  };
  const handleDelete = (record: StaffItem) => {
    setDeleteKey(record._id);
  };

  const isDeleting = (record: StaffItem) => record._id === deleteKey;
  const isEditing = (record: StaffItem) => record._id === editingKey;

  const handleEdit = (record: StaffItem) => {
    setEditingKey(record._id);
    setEditableData(record); // Pre-fill the form with the selected row data
    setlevel(record.level);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setDeleteKey(null);
  };

  const handleSave = async () => {
    try {
      editableData.level = level ?? "";
      const updatedData = data.map((item) =>
        item._id === editingKey ? { ...item, ...editableData } : item,
      );

      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/staff/update/${editingKey}`,
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
    key: keyof StaffItem,
  ) => {
    setEditableData({ ...editableData, [key]: e.target.value });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: StaffItem) =>
        isEditing(record) ? (
          <Input
            value={editableData.name}
            onChange={(e) => handleInputChange(e, "name")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (text: string, record: StaffItem) =>
        isEditing(record) ? (
          <Input
            value={editableData.phone}
            onChange={(e) => handleInputChange(e, "phone")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width:150,
      render: (text: string, record: StaffItem) =>
        isEditing(record) ? (
          <Select
            value={level ?? ""}
            onChange={(value) => setlevel(value as string)}
            style={{ width: 120 }}
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
          />
        ) : (
          <div>
            {text === "Junior" ? (
              <Badge rounded type="brand" color="#3538cd" borderColor="#c7d7fe">
                <p className="py-1 text-lg">Junior</p>
              </Badge>
            ) : text === "Middle" ? (
              <Badge rounded type="golden">
                <p className="py-1 text-lg">Middle</p>
              </Badge>
            ) : (
              <Badge rounded type="success">
                <p className="py-1 text-lg">Senior</p>
              </Badge>
            )}
          </div>
        ),
    },
    {
      title: "Experience (Year)",
      dataIndex: "experience",
      key: "experience",
      render: (text: string, record: StaffItem) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={editableData.experience}
            onChange={(e) => handleInputChange(e, "experience")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (text: string, record: StaffItem) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={editableData.salary}
            onChange={(e) => handleInputChange(e, "salary")}
          />
        ) : (
          <Badge color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBlueLight500 text-xl">{text}</p></Badge>
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: StaffItem) =>
        isEditing(record) ? (
          <div className="flex gap-x-2">
            <Button className="bg-mainColor text-white" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : isDeleting(record) ? (
          <div className="flex gap-x-2">
            <Button
              className="bg-mainColor text-white"
              onClick={handleDeleteConfirm}
            >
              Confirm
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
            <button
              className="flex gap-x-1 hover:text-red-600"
              onClick={() => handleDelete(record)}
            >
              <Delete className="translate-y-[1px]" />
              Delete
            </button>
          </div>
        ),
    },
  ];
  return (
    <Table dataSource={data} columns={columns} className="overflow-auto" pagination={{ pageSize: 10 }}/>
  );
}

export default StaffTable;
