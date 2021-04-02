import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface HouseProps {
  id: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  house: HouseProps;
}

interface ViewPort {
  latitude: number;
  longitude: number;
  zoom: number;
}

export default function SingleMap({ house }: MapProps) {
  console.log(house);
  const [viewport, setViewport] = useState<ViewPort>({
    latitude: house.latitude,
    longitude: house.longitude,
    zoom: 13,
  });

  return (
    <div className="text-black">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        scrollZoom={false}
        minZoom={8}
        mapStyle="mapbox://styles/imvamsi/ckm3y1161c2p717op6vfwld8k"
      >
        <div className="absolute top-0 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>
        <Marker
          latitude={house.latitude}
          longitude={house.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button type="button">
            <img src="/home-color.svg" className="w-8" />
          </button>
        </Marker>
      </ReactMapGL>
    </div>
  );
}
