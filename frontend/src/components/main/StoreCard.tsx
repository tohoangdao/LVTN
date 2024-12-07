import Image from "next/image";
import Button from "../common/Button";
import Link from "next/link";
import Badge from "../common/Badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StoreCard(data: any) {
  return (
    <div className="flex flex-row gap-10 bg-bgCard max-sm:flex-col">
      <Image src={data.image} alt="store" width={400} height={400} loading="lazy"/>
      <div className="flex flex-col gap-3">
        <h2 className="text-4xl font-bold">{data.name}</h2>
        <p className="text-xl opacity-60">Address: {data.address}</p>
        <div className="flex flex-row items-center">
          <p className="text-xl">Working Time: </p>
          <Badge rounded color="#f9f5ff" borderColor="#e9d7fe"><p className="text-utilityBrand700 text-xl">{data.openTime} - {data.closeTime}</p></Badge>
        </div>
        <Button type="primary" className="bg-mainColor w-32">
          <Link href={`/store/${data._id}`}>Detail</Link>
        </Button>
      </div>
    </div>
  );
}

export default StoreCard;
