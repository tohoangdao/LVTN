import { useRouter } from "next/navigation";
import Button from "../common/Button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ServiceCard(data: any) {
  const router = useRouter();
  const handleBooking = () => {
    router.push(`/book/${data._id}`);
  };
  return (
    <div className="border border-borderSecondary shadow-lg w-auto h-auto rounded-lg flex flex-col py-10 px-16 bg-bgCard gap-8">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold text-[#f44336]">{data.name}</p>
        {data.dailyDeal ? (
          <p>
            <span className="line-through opacity-50">{data.price}$</span> -
            {">"} <span className="text-utilityBlueLight500">{(data.price * (100 - data.discount)) / 100}$</span>
          </p>
        ) : (
          <p className="text-utilityBlueLight500">${data.price}</p>
        )}
      </div>
      <p className="text-xl font-semibold">About {data.duration} minutes</p>
      <p className="text-[#444444]">{data.description}</p>

      <Button type="primary" className="bg-mainColor w-28 h-12 self-end" onClick={handleBooking}>
        Book Now
      </Button>
    </div>
  );
}

export default ServiceCard;
