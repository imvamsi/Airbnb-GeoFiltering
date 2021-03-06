import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
  createHouseMutation,
  createHouseMutationVariables,
} from "src/generated/createHouseMutation";
import {
  updateHouseMutation,
  updateHouseMutationVariables,
} from "src/generated/updateHouseMutation";
import { createSignatureMutation } from "src/generated/createSignatureMutation";
import router from "next/router";

const SIGNATURE_MUTATION = gql`
  mutation createSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_HOUSE_MUTATION = gql`
  mutation createHouseMutation($input: HouseInput!) {
    createHouse(input: $input) {
      id
    }
  }
`;

const UPDATE_HOUSE_MUTATION = gql`
  mutation updateHouseMutation($id: String!, $input: HouseInput!) {
    updateHouse(id: $id, input: $input) {
      id
      image
      address
      bedrooms
      latitude
      longitude
      publicId
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

interface House {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  image: string;
  publicId: string;
}
interface FormProps {
  house?: House;
}

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

export default function HouseForm({ house }: FormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, watch, errors, handleSubmit, setValue } = useForm<FormData>(
    {
      defaultValues: house
        ? {
            address: house.address,
            latitude: house.latitude,
            longitude: house.longitude,
            bedrooms: house?.bedrooms?.toString(),
          }
        : {},
    }
  );
  const address = watch("address");
  const [createSignature] = useMutation<createSignatureMutation>(
    SIGNATURE_MUTATION
  );

  const [createHouse] = useMutation<
    createHouseMutation,
    createHouseMutationVariables
  >(CREATE_HOUSE_MUTATION);

  const [updateHouse] = useMutation<
    updateHouseMutation,
    updateHouseMutationVariables
  >(UPDATE_HOUSE_MUTATION);

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

      const { data: houseData } = await createHouse({
        variables: {
          input: {
            address: data.address,
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            bedrooms: parseInt(data.bedrooms, 10),
          },
        },
      });

      if (houseData?.createHouse)
        router.push(`/houses/${houseData.createHouse.id}`);
    }
  }

  async function handleUpdate(currentData: House, newData: FormData) {
    let image = currentData.image;

    if (newData.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createImageSignature;
        const imageData = await uploadImage(
          newData.image[0],
          signature,
          timestamp
        );
        image = imageData.secure_url;
      }
    }

    const { data: houseData } = await updateHouse({
      variables: {
        id: currentData.id,
        input: {
          address: newData.address,
          image: image,
          coordinates: {
            latitude: newData.latitude,
            longitude: newData.longitude,
          },
          bedrooms: parseInt(newData.bedrooms, 10),
        },
      },
    });

    if (houseData?.updateHouse) {
      router.push(`/houses/${currentData.id}`);
    }
  }

  function onSubmit(data: FormData) {
    setSubmitting(true);
    if (!!house) {
      handleUpdate(house, data);
    } else {
      handleCreate(data);
    }
  }

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">
        {house
          ? `you are currently editing ${house.address}`
          : "Add a new house"}
      </h1>
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
          defaultValue={house ? house.address : ""}
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
                  if (house || fileList.length === 1) return true;
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
            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            ) : house ? (
              <Image
                className="mt-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={house.publicId}
                alt={house.address}
                secure
                dpr="auto"
                quality="auto"
                width={576}
                height={Math.floor((9 / 16) * 576)}
                crop="fill"
                gravity="auto"
              />
            ) : null}
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
            <Link href={house ? `/houses/${house.id}` : "/"}>
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
