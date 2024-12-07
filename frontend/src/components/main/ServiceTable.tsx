/* eslint-disable @typescript-eslint/no-explicit-any */
import apiConfig from "@/core/api-config";
import { Input, message, Table, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Edit from "@/assets/pencil.svg";
import Delete from "@/assets/delete.svg";
import Image from "next/image";
import Button from "../common/Button";
import { useParams } from "next/navigation";
import TextArea from "antd/es/input/TextArea";
import Badge from "../common/Badge";

interface ServiceItem {
  _id: string; // Use _id as the unique key
  name: string;
  serviceType: string;
  description: string;
  price: number; //
  duration: number;
  image: string;
}

function ServiceTable() {
  const [data, setData] = useState<ServiceItem[]>([]);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null); // Track the row being edited
  const [editableData, setEditableData] = useState<Partial<ServiceItem>>({}); // Store the edited row data
  const [editServiceType, setEditServiceType] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
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

  const handleDeleteConfirm = async () => {
    try {
      // Send delete request to the server
      await axios.delete(
        `${apiConfig.origin}${apiConfig.backendAPI}/service/${deleteKey}`,
      );
      // Update the data state to remove the deleted item
      setData(data.filter((item) => item._id !== deleteKey));
      message.success("Service deleted successfully.");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete service.");
    }
  };
  const handleDelete = (record: ServiceItem) => {
    setDeleteKey(record._id);
  };

  const isDeleting = (record: ServiceItem) => record._id === deleteKey;
  const isEditing = (record: ServiceItem) => record._id === editingKey;

  const handleEdit = (record: ServiceItem) => {
    setEditingKey(record._id);
    setEditableData(record); // Pre-fill the form with the selected row data
    setEditServiceType(record.serviceType);
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
      editableData.image = editImage ?? "";
      editableData.serviceType = editServiceType ?? "";
      const updatedData = data.map((item) =>
        item._id === editingKey ? { ...item, ...editableData } : item,
      );

      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/service/update/${editingKey}`,
        editableData,
      );
      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/service/update/${editingKey}`,
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
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    key: keyof ServiceItem,
  ) => {
    setEditableData({ ...editableData, [key]: e.target.value });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ServiceItem) =>
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
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (text: string, record: ServiceItem) =>
        isEditing(record) ? (
          <Select
            value={editServiceType ?? ""}
            onChange={(value) => setEditServiceType(value as string)}
            style={{ width: 120 }}
            options={[
              {
                label: "Hair",
                value: "Hair",
              },
              {
                label: "Nail",
                value: "Nail",
              },
              {
                label: "Face",
                value: "Face",
              },
              {
                label: "Body",
                value: "Body",
              },
            ]}
          />
        ) : (
          text
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: string, record: ServiceItem) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={editableData.price}
            onChange={(e) => handleInputChange(e, "price")}
          />
        ) : (
          <Badge color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBlueLight500 text-xl">{text}</p></Badge>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 600,
      render: (text: string, record: ServiceItem) =>
        isEditing(record) ? (
          <TextArea
            value={editableData.description}
            autoSize={{ minRows: 3 }}
            onChange={(e) => handleInputChange(e, "description")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
      render: (text: string, record: ServiceItem) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={editableData.duration}
            onChange={(e) => handleInputChange(e, "duration")}
          />
        ) : (
          <Badge rounded color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBrand700 text-xl">{text}</p></Badge>
        ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string, record: ServiceItem) =>
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
      width:160,
      render: (_: any, record: ServiceItem) =>
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
    <Table dataSource={data} columns={columns} className="overflow-auto" pagination={{ pageSize: 5 }}/>
  );
}

export default ServiceTable;
