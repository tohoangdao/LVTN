import Facebook from "@/assets/Facebook.svg";
import Insta from "@/assets/Instagram.svg";
import Linkedln from "@/assets/Linkedln.svg";
import Twitter from "@/assets/Twitter.svg";
import Address from "@/assets/address.svg";
import Phone from "@/assets/phone.svg";
import Mail from "@/assets/email.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-4 px-12 h-auto bg-textBlack text-white flex flex-row justify-around max-md:flex-col">
      <div className="">
        <p className="text-xl pb-3">Contact information</p>
        <ul>
          <li className="flex flex-row">
            <Mail />
            tohoangdao@gmail.com
          </li>
          <li className="flex flex-row">
            <Phone />
            09123456789
          </li>
          <li className="flex flex-row">
            <Address />
            268 Ly Thuong Kiet
          </li>
        </ul>
      </div>

      <div>
        <p className="text-2xl">Connect with us</p>
        <div className="flex flex-row py-4 gap-10 justify-center">
          <Link
            href="https://www.facebook.com/"
            className="border rounded-full p-2"
          >
            <Facebook />
          </Link>
          <Link
            href="https://www.instagram.com/"
            className="border rounded-full p-2"
          >
            <Insta />
          </Link>
          <Link
            href="https://www.linkedin.com/"
            className="border rounded-full p-2"
          >
            <Linkedln />
          </Link>
          <Link
            href="https://www.twitter.com/"
            className="border rounded-full p-2"
          >
            <Twitter />
          </Link>
        </div>
      </div>
    </footer>
  );
}
