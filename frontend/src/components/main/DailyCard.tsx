import Image from "next/image";
import Button from "../common/Button";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DailyCard(data: any) {
  const router = useRouter();
  const handleBooking = () => {
    router.push(`/book/${data._id}`);
  };
  return (
    <div className="flex flex-col">
      <div className="relative h-48">
        <Image src={data.image} alt="service" layout="fill" objectFit="cover" />
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
          {data.discount}% OFF
        </div>
      </div>
      <h2 className="text-xl font-bold">{data.store.name}</h2>
      <p className="text-lg font-bold text-[#f44336]">{data.name}</p>
      <p>
        <span className=" line-through opacity-50">{data.price}$</span> -{">"}{" "}
        <span className="text-utilityBlueLight400">{(data.price * (100 - data.discount)) / 100}$</span>
      </p>
      <Button className="bg-mainColor text-white" onClick={handleBooking}>
        Book Now
      </Button>
    </div>
  );
}

export default DailyCard;
