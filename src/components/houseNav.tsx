import { useMutation, gql } from "@apollo/client";
import router, { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

const DELETE_HOUSE_MUTATION = gql`
  mutation DeleteHouse($id: String!) {
    deleteHouse(id: $id)
  }
`;
interface HouseNav {
  house: {
    id: string;
    userId: string;
  };
}

export default function HouseNav({ house }: HouseNav) {
  const { user } = useAuth();
  const isEdit = !!user && user.uid === house.userId;

  const [deleteHouse, { loading }] = useMutation<
    DeleteHouse,
    DeleteHouseVariables
  >(DELETE_HOUSE_MUTATION);

  async function handleHouseDelete() {
    if (confirm("Are you sure, you want to delete the house?")) {
      await deleteHouse({ variables: { id: house.id } });
      router.push("/");
    }
  }

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
          {" | "}
          <button type="button" disabled={loading} onClick={handleHouseDelete}>
            Delete House
          </button>
        </>
      )}
    </>
  );
}
