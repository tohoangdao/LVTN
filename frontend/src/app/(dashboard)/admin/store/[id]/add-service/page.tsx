"use client";
import Input from "@/components/common/Input";
import SaveIcon from "@/assets/save.svg";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import PlusIcon from "@/assets/plus.svg";
import apiConfig from "@/core/api-config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { message } from "antd";
import Select from "@/components/common/Select";
import Back from "@/assets/arrow-left.svg";

function AddService() {
  const [serviceName, setserviceName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const createService = async () => {
    try {
      await axios.post(
        `${apiConfig.origin}${apiConfig.backendAPI}/service/create/${storeId}`,
        {
          name: serviceName,
          price: price,
          description: description,
          duration: duration,
          serviceType: serviceType,
          image: selectedImage,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      message.success("Create service successfully!");
      router.push(`/admin/store/${storeId}`);
    } catch (error) {
      console.error(error);
      message.error("Failed to create service.");
    }
  };

  const goBack = () => {
    router.push(`/admin/store/${storeId}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full justify-between">
        <Button
          className="w-fit text-nowrap  mx-20 max-md:mx-0"
          onClick={goBack}
        ><Back />
          Go back
        </Button>
        <Button
          type="primary"
          className="w-fit text-nowrap  mx-20 max-md:mx-0"
          onClick={createService}
        >
          <SaveIcon />
          Save
        </Button>
      </div>

      <div className="bg-white p-4 mx-20 my-10 rounded-lg shadow-lg max-md:mx-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-sm:gap-0 max-sm:space-y-5">
          <div className="col-span-2 rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Add new service
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="pb-1.5 text-2xl font-medium">Service name</p>
                <Input
                  value={serviceName}
                  onChange={(e) => setserviceName(e.target.value)}
                />
              </div>
              <div>
                <p className="pb-1.5 text-2xl font-medium">Service Type</p>
                <Select
                  options={[
                    {
                      label: "Hair",
                      value: "Hair",
                    },
                    {
                      label: "Nail",
                      value: "Nail",
                    },
                    {
                      label: "Face",
                      value: "Face",
                    },
                    {
                      label: "Body",
                      value: "Body",
                    },
                  ]}
                  value={serviceType}
                  onChange={(value) => setServiceType(value as string)}
                />
              </div>
              <div>
                <p className="pb-1.5 text-2xl font-medium">
                  Price <span className="text-utilityBlue600">($)</span>
                </p>
                <div className="w-1/2">
                  <Input
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <p className="pb-1.5 text-2xl font-medium">
                  Service duration (min)
                </p>
                <div className="w-1/2">
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center items-center">
              <div className="w-full">
                <p className="block mb-2 text-2xl font-medium">Service image</p>
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
              Description
            </h2>

            <Input
              rows={12}
              componentType="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-2 items-center mb-2 text-nowrap gap-3"></div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AddService;
