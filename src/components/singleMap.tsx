import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface House {
  id: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  house: House;
  nearby: House[];
}

interface ViewPort {
  latitude: number;
  longitude: number;
  zoom: number;
}

export default function SingleMap({ house, nearby }: MapProps) {
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
        mapStyle="mapbox://styles/imvamsi/ckmzo7stw09lc18o5x9yacznn"
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
          <button
            type="button"
            style={{ width: "30px", height: "30px", fontSize: "30px" }}
          >
            <img src="/home-color.svg" className="w-8" />
          </button>
        </Marker>
        {nearby.map((near) => (
          <Marker
            key={near.id}
            latitude={near.latitude}
            longitude={near.longitude}
            offsetLeft={-15}
            offsetTop={-15}
          >
            <Link href={`/houses/${near.id}`}>
              <a style={{ width: "30px", height: "30px", fontSize: "30px" }}>
                <img
                  src="/home-outline.svg"
                  className="w-8"
                  alt="nearby house"
                />
              </a>
            </Link>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
}
