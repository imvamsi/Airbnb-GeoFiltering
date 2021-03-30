import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
// import { useRouter } from "next/router";
import Link from "next/link";
// import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
// import {
//   CreateHouseMutation,
//   CreateHouseMutationVariables,
// } from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";
import { createSignatureMutation } from "src/generated/createSignatureMutation";

const SIGNATURE_MUTATION = gql`
  mutation createSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;
interface FormData {
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: string;
  image: FileList;
}

interface FormProps {}

interface UploadImageResponse {
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number
): Promise<UploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  return response.json();
}

export default function HouseForm({}: FormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, watch, errors, handleSubmit, setValue } = useForm<FormData>(
    { defaultValues: {} }
  );
  const address = watch("address");
  const [createSignature] = useMutation<createSignatureMutation>(
    SIGNATURE_MUTATION
  );

  useEffect(() => {
    register(
      { name: "address" },
      { required: "Please enter your address to begin with!" }
    );
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -90, max: 90 });
  }, [register]);

  async function handleCreate(data: FormData) {
    const { data: signatureData } = await createSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);
      console.log(imageData);
    }
  }

  function onSubmit(data: FormData) {
    setSubmitting(true);
    handleCreate(data);
  }

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">Add a new house</h1>
      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your address
        </label>
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue=""
        />
        {errors.address && <p>{errors.address.message}</p>}
      </div>

      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 block border-gray-600 cursor-pointer"
            >
              Click to add your image (16:9)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (fileList.length === 1) return true;
                  else return "Please Upload an Image";
                },
              })}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e?.target?.files?.[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            )}
            {errors.image && <p>{errors.image.message}</p>}
          </div>
          <div className="mt-4">
            <label htmlFor="bedrooms" className="block">
              Beds
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              className="p-2"
              ref={register({
                required: "please enter the no of bedrooms",
                max: { value: 10, message: "Wooah! Too large" },
                min: {
                  value: 1,
                  message: "Must have atleast one bedroom to list",
                },
              })}
            />
            {errors.bedrooms && <p>{errors.bedrooms.message}</p>}
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 over: bg-blue-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submitting}
            >
              Save
            </button>{" "}
            <Link href="/">
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
