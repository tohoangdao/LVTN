import Image from "next/image";
import Button from "../common/Button";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StoreCard(data: any) {
  return (
    <div className="flex flex-row gap-10 bg-bgCard max-sm:flex-col">
      <Image src={data.image} alt="store" width={400} height={400} loading="lazy"/>
      <div className="flex flex-col gap-3">
        <h2 className="text-4xl font-bold">{data.name}</h2>
        <p className="text-xl">Address: {data.address}</p>
        <p className="text-xl">Working Time: {data.openTime} - {data.closeTime}</p>
        <Button type="primary" className="bg-mainColor w-32">
          <Link href={`/store/${data._id}`}>Detail</Link>
        </Button>
      </div>
    </div>
  );
}

export default StoreCard;
