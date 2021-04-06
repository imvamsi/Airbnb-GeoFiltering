import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
//import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

interface HouseNav {
  house: {
    id: string;
    userId: string;
  };
}

export default function HouseNav({ house }: HouseNav) {
  const { user } = useAuth();
  const isEdit = !!user && user.uid === house.userId;
  return (
    <>
      <Link href="/">
        <a> Go to Homepage</a>
      </Link>
      {isEdit && (
        <>
          {" | "}
          <Link href={`/houses/${house.id}/edit`}>
            <a>Edit house</a>
          </Link>
        </>
      )}
    </>
  );
}
