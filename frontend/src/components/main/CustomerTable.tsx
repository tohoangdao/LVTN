import apiConfig from "@/core/api-config";
import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Badge from "../common/Badge";

function CustomerTable() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.origin}${apiConfig.backendAPI}/user/`,
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
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Spend",
      dataIndex: "totalSpend",
      key: "totalSpend",
      render: (text: number) =>
        <Badge color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBlueLight500 text-xl">{text}</p></Badge>
    },
    
  ];
  return (
    <Table dataSource={data} columns={columns} className="overflow-auto" pagination={{ pageSize: 10 }}/>
  );
}

export default CustomerTable;
