// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import HouseList from "src/components/houseList";
// import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";

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
type Bounds = [[number, number], [number, number]];

function parseBounds(bounds: string) {
  const boundsResult = JSON.parse(bounds) as Bounds;
  return {
    sw: {
      latitude: boundsResult[0][1],
      longitude: boundsResult[0][0],
    },
    ne: {
      latitude: boundsResult[1][1],
      longitude: boundsResult[1][0],
    },
  };
}
export default function Home() {
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0, 0], [0,0]]"
  );

  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const { data, error } = useQuery(HOUSES_QUERY, {
    variables: {
      bounds: parseBounds(debouncedDataBounds),
    },
  });

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
