// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import HouseList from "src/components/houseList";
import { useLocalState } from "src/utils/useLocalState";
import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";
import { useLastData } from "../src/utils/useLastData";

const HOUSES_QUERY = gql`
  query HousesQuery($bounds: BoundsInput!) {
    houses(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      bedrooms
    }
  }
`;
type BoundsArray = [[number, number], [number, number]];

function parseBounds(boundsString: string) {
  // if (boundsString !== undefined) {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
  // }
}
export default function Home() {
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0, 0], [0,0]]"
  );

  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  console.log(
    "🚀 ~ file: index.tsx ~ line 48 ~ Home ~ debouncedDataBounds",
    debouncedDataBounds
  );
  const { data, error } = useQuery<HousesQuery, HousesQueryVariables>(
    HOUSES_QUERY,
    {
      variables: {
        bounds: debouncedDataBounds && parseBounds(debouncedDataBounds),
      },
    }
  );
  const lastData = useLastData(data);
  if (error) return <Layout main={<div>Error loading houses</div>} />;

  console.log(data, "bounds data");
  console.log(lastData, "house in the bounds");

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px", overflowY: "scroll" }}
          >
            HouseList
          </div>
          <div className="w-1/2">
            <Map setDataBounds={setDataBounds} />
          </div>
        </div>
      }
    />
  );
}
