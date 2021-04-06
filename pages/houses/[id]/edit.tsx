import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import HouseForm from "src/components/houseForm";
import { useAuth } from "src/auth/useAuth";
// import {
// import EditHouse from './edit';
//EditHouseQuery,
//   EditHouseQueryVariables,
// } from "src/generated/EditHouseQuery";

const EDIT_HOUSE_QUERY = gql`
  query EditHouseQuery($id: String!) {
    house(id: $id) {
      id
      userId
      address
      image
      latitude
      longitude
      publicId
    }
  }
`;

export default function EditHouse() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <Layout main={<EditHouseData id={id as string} />} />;
}
function EditHouseData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery(EDIT_HOUSE_QUERY, { variables: { id } });

  if (!user) return <Layout main={<div>Please Login!</div>} />;
  if (loading) return <Layout main={<div>Loading...</div>} />;
  if (data && !data.house)
    return <Layout main={<div>Unable to load the house</div>} />;
  if (user.uid !== data?.house?.userId)
    return <Layout main={<div>Permission denied!</div>} />;
  return <div> I have the permission</div>;
}
