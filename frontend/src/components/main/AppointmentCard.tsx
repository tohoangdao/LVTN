/* eslint-disable @typescript-eslint/no-explicit-any */
import apiConfig from "@/core/api-config";
import { message } from "antd";
import axios from "axios";
import Badge from "../common/Badge";
import Button from "../common/Button";

function AppointmentCard(data: any) {
  const handleCancel = async () => {
    try {
      await axios.put(
        `${apiConfig.origin}${apiConfig.backendAPI}/appointment/update/${data._id}`,
        {
          status: "cancelled",
        },
      );
      message.success("Appointment cancelled successfully");
    } catch (error) {
      message.error("Failed to cancel appointment");
    }
    window.location.reload(); // Refresh the page to reflect the updated status.
  };
  return (
    <div className="border flex flex-row items-center justify-between px-8 shadow-lg">
      <div className="flex flex-col gap-2 py-8 pr-6 border-r">
        <p>{data.bookingTime}</p>
        <p className="text-utilityBlueLight500">${data.price}</p>
      </div>
      <div className="flex flex-col gap-2 py-8">
        <p className="font-bold text-2xl">{data.store.name}</p>
        <p>Address: {data.store.address}</p>
        <p>Service: {data.service.name}</p>
      </div>

      <div className="">
        {data.status === "booking" ? (
          <div className="flex flex-col gap-4">
            <Badge rounded type="brand" color="#3538cd" borderColor="#c7d7fe">
              <p className="py-1 text-lg">Booking</p>
            </Badge>
            <Button
              className="w-32 bg-mainColor text-white"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        ) : data.status === "cancelled" ? (
          <Badge rounded type="danger">
            <p className="py-1 text-lg">Cancelled</p>
          </Badge>
        ) : (
          <Badge rounded type="success">
            <p className="py-1 text-lg">Completed</p>
          </Badge>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;
