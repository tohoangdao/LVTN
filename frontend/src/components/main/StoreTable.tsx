/* eslint-disable @typescript-eslint/no-explicit-any */

import apiConfig from "@/core/api-config";
import { Table, Input, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Edit from "@/assets/pencil.svg";
import Delete from "@/assets/delete.svg";
import Image from "next/image";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import TimePicker from "../common/TimePicker/TimePicker";
import Badge from "../common/Badge";

// Define the type for a store item
interface StoreItem {
  _id: string; // Use _id as the unique key
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
  image: string;
}

function StoreTable() {
  const [data, setData] = useState<StoreItem[]>([]);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null); // Track the row being edited
  const [editableData, setEditableData] = useState<Partial<StoreItem>>({}); // Store the edited row data
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [editClose, setEditClose] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.origin}${apiConfig.backendAPI}/store/`,
      );
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      // Send delete request to the server
      await axios.delete(
        `${apiConfig.origin}${apiConfig.backendAPI}/store/${deleteKey}`,
      );
      // Update the data state to remove the deleted item
      setData(data.filter((item) => item._id !== deleteKey));
      message.success("Store deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete store.");
    }
  };
  const handleDelete = (record: StoreItem) => {
    setDeleteKey(record._id);
  };

  const isDeleting = (record: StoreItem) => record._id === deleteKey;
  const isEditing = (record: StoreItem) => record._id === editingKey;

  const handleEdit = (record: StoreItem) => {
    setEditingKey(record._id);
    setEditableData(record); // Pre-fill the form with the selected row data
    setEditOpen(record.openTime);
    setEditClose(record.closeTime);
    setEditImage(record.image);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setDeleteKey(null);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload logic (e.g., upload to server, update state)
      setEditImage(URL.createObjectURL(file));
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    try {
      editableData.openTime = editOpen ?? "";
      editableData.closeTime = editClose ?? "";
      editableData.image = editImage ?? "";
      const updatedData = data.map((item) =>
        item._id === editingKey ? { ...item, ...editableData } : item,
      );

      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/store/update/${editingKey}`,
        editableData,
      );
      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/store/update/${editingKey}`,
        {
          image: selectedImage,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
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
    key: keyof StoreItem,
  ) => {
    setEditableData({ ...editableData, [key]: e.target.value });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: StoreItem) =>
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
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string, record: StoreItem) =>
        isEditing(record) ? (
          <Input
            value={editableData.address}
            onChange={(e) => handleInputChange(e, "address")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Open Time",
      dataIndex: "openTime",
      key: "openTime",
      render: (text: string, record: StoreItem) =>
        isEditing(record) ? (
          // <Input value={editableData.openTime} onChange={(e) => handleInputChange(e, "openTime")} />
          <div className="w-3/4">
            <TimePicker
              timeInterval={60}
              value={editOpen}
              timeFormat="HH:mm"
              onChange={(e) => setEditOpen(e)}
            />
          </div>
        ) : (
          <Badge rounded color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBrand700 text-xl">{text}</p></Badge>
        ),
    },
    {
      title: "Close Time",
      dataIndex: "closeTime",
      key: "closeTime",
      render: (text: string, record: StoreItem) =>
        isEditing(record) ? (
          // <Input
          //   value={editableData.closeTime}
          //   onChange={(e) => handleInputChange(e, "closeTime")}
          // />
          <div className="w-3/4">
            <TimePicker
              timeInterval={60}
              value={editClose}
              timeFormat="HH:mm"
              onChange={(e) => setEditClose(e)}
            />
          </div>
        ) : (
          <Badge rounded color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBrand700 text-xl">{text}</p></Badge>
        ),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (text: number) =>
        <Badge color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBlueLight500 text-xl">{text}</p></Badge>
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string, record: StoreItem) =>
        isEditing(record) ? (
          <div>
            <label
              htmlFor={`upload-${record._id}`}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={editImage ?? ""}
                alt="store"
                width={200}
                height={100}
                loading="lazy"
              />
            </label>
            <input
              id={`upload-${record._id}`}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => handleImageUpload(event)}
            />
          </div>
        ) : (
          <Image src={image} alt="store" width={200} height={100} loading="lazy"/>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: StoreItem) =>
        isEditing(record) ? (
          <div className="flex gap-x-2">
            <Button className="bg-mainColor text-white" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : isDeleting(record) ? (
          <div className="flex gap-x-2">
            <Button className="bg-mainColor text-white" onClick={handleDeleteConfirm}>
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
    {
      title: "",
      width: 160,
      key: "detail",
      render: (_: any, record: StoreItem) => (
        <div className="flex flex-row gap-y-1 gap-x-6 justify-around">
          <Button
            className="bg-mainColor text-white"
            onClick={() => router.push(`/admin/store/${record._id}`)}
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        className="overflow-auto"
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}

export default StoreTable;
