import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
// import { useMutation, gql } from "@apollo/client";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { Image } from "cloudinary-react";
// import { SearchBox } from "./searchBox";
// import {
//   CreateHouseMutation,
//   CreateHouseMutationVariables,
// } from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";
// import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

interface FormData {
    address: string,
    latitude: number,
    longitude: number,
    bedrooms: string
}

interface FormProps {}

export default function HouseForm({}: FormProps) {

    const [submitting, setSubmitting] = useState(false)
    const {register, watch, errors, handleSubmit} = useForm<FormData>({defaultValues: {}})

    useEffect(() => {
        register({name: 'address'}, {required: 'Please enter your address to begin with!'})
        register({name: 'latitude'}, {required: true, min: -90, max: 90})
        register({name: 'longitude'}, {required: true, min: -90, max: 90})
    }, [register])

    async function handleCreate(data: FormData) {

    }

    function onSubmit(data: FormData) {
        setSubmitting(true)
        handleCreate(data)
    }
    
    return (
        <form className='mx-auto max-w-xl py-4' onSubmit={handleSubmit(onSubmit)}>
            <h1 className='text-xl'>
                Add a new house
            </h1>
            <div className='mt-4'>
                <label htmlFor='search' className='block'>
                    Search for your address
                </label>
                {errors.address && <p>{errors.address.message}</p>}
            </div>
        </form>
    )
}
