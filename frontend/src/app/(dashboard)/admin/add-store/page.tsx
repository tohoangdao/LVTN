"use client";
import Input from "@/components/common/Input";
import SaveIcon from "@/assets/save.svg";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import PlusIcon from "@/assets/plus.svg";
import TimePicker from "@/components/common/TimePicker/TimePicker";
import axios from "axios";
import apiConfig from "@/core/api-config";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Back from "@/assets/arrow-left.svg";

function AddStore() {
  const [storeName, setStoreName] = useState<string>("");
  const [storeAddress, setStoreAddress] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [timeStart, setTimeStart] = useState<string | null>(null);
  const [timeEnd, setTimeEnd] = useState<string | null>(null);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const createStore = async () => {
    try {
      await axios.post(
        `${apiConfig.origin}${apiConfig.backendAPI}/store/create/`,
        {
          name: storeName,
          address: storeAddress,
          image: selectedImage,
          openTime: timeStart,
          closeTime: timeEnd,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      message.success("Create store successfully!");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      message.error("Failed to create store.");
    }
  };

  const goBack = () => {
    router.push("/admin");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full justify-between">
        <Button
          className="w-fit text-nowrap  mx-20 max-md:mx-0"
          onClick={goBack}
        >
          <Back />
          Go back
        </Button>
        <Button
          type="primary"
          className="w-fit text-nowrap  mx-20 max-md:mx-0"
          onClick={createStore}
        >
          <SaveIcon />
          Save
        </Button>
      </div>
      <div className="bg-white p-4 mx-20 my-10 rounded-lg shadow-lg max-md:mx-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-sm:gap-0 max-sm:space-y-5">
          <div className="col-span-2 rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Add new store
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="pb-1.5 text-2xl font-medium">Store name</p>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="pb-1.5 text-2xl font-medium">Store address</p>
              <Input
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-center items-center">
              <div className="w-full">
                <p className="block mb-2 text-2xl font-medium">Store image</p>
                <div className={`rounded-xl`}>
                  <label className="bg-secondary border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition duration-200 hover:border-brand w-80 max-sm:w-auto">
                    <div>
                      <div className="border border-gray-300 rounded-md shadow-sm p-1 w-fit mx-auto transform scale-125">
                        {<PlusIcon />}
                      </div>
                      <p className="font-semibold text-bgBrandSolidHover mt-6 text-center text-xl">
                        Choose an image to upload
                      </p>

                      <input type="file" hidden onChange={handleImageChange} />
                    </div>
                    {previewImage && (
                      <div className="mt-4">
                        <Image
                          src={previewImage}
                          alt="Selected image preview"
                          width={200}
                          height={200}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Working Time
            </h2>

            <div className="grid grid-cols-2 items-center mb-2 text-nowrap">
              <p className="text-2xl font-medium">Open hour</p>
              <p className="text-2xl font-medium">Close hour</p>
            </div>

            <div className="grid grid-cols-2 items-center mb-2 text-nowrap gap-3">
              <div className="w-3/4 max-sm:w-full">
                <TimePicker
                  timeInterval={60}
                  value={timeStart}
                  timeFormat="HH:mm"
                  onChange={setTimeStart}
                />
              </div>
              <div className="w-3/4 max-sm:w-full">
                <TimePicker
                  timeInterval={60}
                  value={timeEnd}
                  timeFormat="HH:mm"
                  onChange={setTimeEnd}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStore;
