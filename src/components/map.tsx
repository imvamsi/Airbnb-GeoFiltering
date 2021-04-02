import React, { useRef, useState, ChangeEvent } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, {
  ExtraState,
  Marker,
  Popup,
  ViewportProps,
  ViewState,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

interface MapProps {
  setDataBounds: (bounds: string) => void;
}

export default function Map({ setDataBounds }: MapProps) {
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewPort, setViewPort] = useLocalState<ViewState>("viewport", {
    latitude: 45.5086157,
    longitude: -73.5903112,
    zoom: 11,
  });

  function handleViewPort(viewPort: ViewportProps): void {
    setViewPort(viewPort);
  }

  function handleBounds(): void {
    if (mapRef.current) {
      const bounds = mapRef.current.getMap().getBounds();
      setDataBounds(JSON.stringify(bounds.toArray()));
    }
  }

  function handleMapStateChange(extra: ExtraState): void {
    if (extra.isDragging && mapRef.current) {
      const bounds = mapRef.current.getMap().getBounds();
      setDataBounds(JSON.stringify(bounds.toArray()));
    }
  }

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewPort}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(viewPort) => handleViewPort(viewPort)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/imvamsi/ckm3y1161c2p717op6vfwld8k"
        onLoad={() => handleBounds()}
        onInteractionStateChange={(e) => handleMapStateChange(e)}
      ></ReactMapGL>
    </div>
  );
}
