import Image from "next/image";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HomeStoreCard(data: any) {
  return (
    <div className="flex flex-col">
      <Link href={`/store/${data._id}`} className="hover:underline">
        <div className="relative h-48">
          <Image src={data.image} alt="store" layout="fill" objectFit="cover" />
        </div>

        <h2 className="text-xl font-bold">{data.name}</h2>
        <p className="opacity-60">{data.address}</p>
      </Link>
    </div>
  );
}

export default HomeStoreCard;
