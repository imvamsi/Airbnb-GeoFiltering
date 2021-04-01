import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
// import HouseNav from "src/components/houseNav";
// import SingleMap from "src/components/singleMap";
import {
  ShowHouseQuery,
  ShowHouseQueryVariables,
} from "src/generated/ShowHouseQuery";

const SHOW_HOUSE_QUERY = gql`
  query ShowHouseQuery($id: String!) {
    house(id: $id) {
      id
      userId
      address
      publicId
      bedrooms
      latitude
      longitude
    }
  }
`;

export default function ShowHouse() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <HouseData id={id as string} />;
}

function HouseData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowHouseQuery, ShowHouseQueryVariables>(
    SHOW_HOUSE_QUERY,
    { variables: { id } }
  );

  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data.house) return <Layout main={<div>The house doesn't exist</div>} />;

  const { house } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <h1 className="text-3xl my-3">{house?.address}</h1>
          </div>
          <div className="sm:w-full md:w-1/2 p-4">SingleMap</div>
        </div>
      }
    />
  );
}
