/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Button from "../common/Button";
import { useRouter } from "next/navigation";

function DailyDeal(data: any) {
  const router = useRouter();
  const handleBooking = () => {
    router.push(`/book/${data._id}`);
  };
  return (
    <div className="flex flex-row gap-10 bg-bgCard max-sm:flex-col">
      <div className="relative h-48 size-52 max-sm:w-full">
        <Image
          src={data.image}
          alt="store"
          layout="fill"
          objectFit="cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
          {data.discount}% OFF
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold">{data.store.name}</h2>
        <p className="opacity-60">Address: {data.store.address}</p>
        <div className="flex flex-row gap-5">
          <span className="text-[#f44336]">{data.name}</span>
        </div>
        <div className="flex flex-row gap-5">
          <p>
            <span className="line-through opacity-50">{data.price}$</span> -
            {">"} <span className="text-utilityBlueLight500">{(data.price * (100 - data.discount)) / 100}$</span>
          </p>
        </div>

        <Button
          type="primary"
          className="bg-mainColor w-32"
          onClick={handleBooking}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

export default DailyDeal;
